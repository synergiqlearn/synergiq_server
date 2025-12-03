import { Request, Response } from 'express';
import QuestionnaireResponse from '../models/Questionnaire';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { questions } from '../data/questions';
import { adaptiveQuestionTree, getNextQuestion, calculateCategory } from '../data/adaptiveQuestions';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// AI-Powered Personality Analysis
async function generateAIAnalysis(
  responses: any[],
  scores: any,
  traits: any,
  category: string
): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const questionAnswerPairs = responses.map(resp => {
      const question = adaptiveQuestionTree[resp.questionId];
      return `Q: ${question?.text || 'Unknown'}\nA: ${resp.answer}`;
    }).join('\n\n');

    const prompt = `You are an expert educational psychologist analyzing a student's learning profile based on their questionnaire responses.

QUESTIONNAIRE RESPONSES:
${questionAnswerPairs}

CALCULATED METRICS:
Category Scores: Explorer=${scores.Explorer}, Achiever=${scores.Achiever}, Strategist=${scores.Strategist}, Practitioner=${scores.Practitioner}
Personality Traits: ${JSON.stringify(traits, null, 2)}
Primary Category: ${category}

Based on this comprehensive profile, provide a detailed analysis in the following JSON format:
{
  "personalityProfile": "A 3-4 sentence description of their core learning personality, cognitive style, and approach to problem-solving",
  "learningPath": "Recommend the optimal learning path (e.g., 'Project-Based Learning with Theory', 'Deep Specialization', 'Broad Exploration', etc.) with 2-3 sentences explaining why this suits them",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "growthAreas": ["area 1", "area 2"],
  "studyStrategies": ["strategy 1", "strategy 2", "strategy 3", "strategy 4"],
  "projectSuggestions": ["project type 1", "project type 2", "project type 3"],
  "careerPath": "2-3 sentences about potential career directions that align with their profile",
  "motivationalTips": ["tip 1", "tip 2", "tip 3"]
}

Return ONLY valid JSON. Be specific, insightful, and actionable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('AI Analysis error:', error);
    // Return fallback analysis if AI fails
    return {
      personalityProfile: `You have been identified as a ${category} learner. This means you approach learning with a unique combination of analytical thinking, creative problem-solving, and practical application.`,
      learningPath: 'Balanced Learning Approach',
      strengths: ['Adaptable learning style', 'Strong problem-solving skills', 'Good technical foundation'],
      growthAreas: ['Time management', 'Consistent practice'],
      studyStrategies: ['Set clear daily goals', 'Build projects regularly', 'Review concepts periodically', 'Collaborate with peers'],
      projectSuggestions: ['Full-stack web application', 'API development project', 'Open source contribution'],
      careerPath: 'Your profile suggests strong potential in software engineering roles with opportunities for growth in technical leadership.',
      motivationalTips: ['Focus on consistent progress', 'Celebrate small wins', 'Stay curious and keep exploring']
    };
  }
}

// @desc    Get questionnaire questions
// @route   GET /api/profile/questions
// @access  Private
export const getQuestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      questions: questions.map((q) => ({
        id: q.id,
        text: q.text,
        category: q.category,
        options: q.options.map((opt) => ({
          text: opt.text,
          // Don't send type and value to frontend to prevent manipulation
        })),
      })),
    });
  } catch (error: any) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Submit questionnaire responses
// @route   POST /api/profile/questionnaire
// @access  Private
export const submitQuestionnaire = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { responses } = req.body;

    if (!responses || !Array.isArray(responses)) {
      res.status(400).json({
        success: false,
        message: 'Please provide valid responses',
      });
      return;
    }

    // Calculate scores for each category
    const scores = {
      Explorer: 0,
      Achiever: 0,
      Strategist: 0,
      Practitioner: 0,
    };

    const processedResponses = responses.map((resp: any) => {
      const question = questions.find((q) => q.id === resp.questionId);
      if (!question) {
        throw new Error(`Invalid question ID: ${resp.questionId}`);
      }

      const selectedOption = question.options.find(
        (opt) => opt.text === resp.answer
      );
      if (!selectedOption) {
        throw new Error(`Invalid answer for question: ${resp.questionId}`);
      }

      // Add score to corresponding category
      scores[selectedOption.type] += selectedOption.value;

      return {
        questionId: resp.questionId,
        answer: resp.answer,
        score: selectedOption.value,
      };
    });

    // Determine primary category (highest score)
    const category = (Object.keys(scores) as Array<keyof typeof scores>).reduce(
      (a, b) => (scores[a] > scores[b] ? a : b)
    );

    // Save questionnaire response
    const questionnaireResponse = await QuestionnaireResponse.create({
      userId: req.user?._id,
      responses: processedResponses,
      scores,
    });

    // Update user's category and mark profile as completed
    const user = await User.findById(req.user?._id);
    if (user) {
      user.category = category;
      user.profileCompleted = true;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Questionnaire submitted successfully',
      category,
      scores,
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        category: user?.category,
        profileCompleted: user?.profileCompleted,
      },
    });
  } catch (error: any) {
    console.error('Submit questionnaire error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get user's questionnaire results
// @route   GET /api/profile/results
// @access  Private
export const getResults = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const result = await QuestionnaireResponse.findOne({
      userId: req.user?._id,
    }).sort({ createdAt: -1 });

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'No questionnaire results found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      result: {
        scores: result.scores,
        completedAt: result.completedAt,
        responses: result.responses,
      },
    });
  } catch (error: any) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// ==================== ADAPTIVE QUESTIONNAIRE ====================

// @desc    Get adaptive questionnaire - starting question
// @route   GET /api/profile/adaptive/start
// @access  Private
export const getAdaptiveStart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const startQuestion = adaptiveQuestionTree['start'];
    
    res.status(200).json({
      success: true,
      question: {
        id: startQuestion.id,
        text: startQuestion.text,
        category: startQuestion.category,
        description: startQuestion.description,
        options: startQuestion.options.map(opt => ({
          text: opt.text,
        }))
      }
    });
  } catch (error: any) {
    console.error('Get adaptive start error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get next adaptive question based on previous answer
// @route   POST /api/profile/adaptive/next
// @access  Private
export const getAdaptiveNext = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { currentQuestionId, selectedOptionIndex } = req.body;

    console.log('=== getAdaptiveNext called ===');
    console.log('currentQuestionId:', currentQuestionId);
    console.log('selectedOptionIndex:', selectedOptionIndex);

    if (!currentQuestionId || selectedOptionIndex === undefined) {
      res.status(400).json({
        success: false,
        message: 'Please provide current question ID and selected option',
      });
      return;
    }

    const currentQuestion = adaptiveQuestionTree[currentQuestionId];
    console.log('Current question found:', currentQuestion?.id);
    
    if (!currentQuestion) {
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
      return;
    }

    const selectedOption = currentQuestion.options[selectedOptionIndex];
    console.log('Selected option:', selectedOption?.text);
    console.log('Next question ID:', selectedOption?.nextQuestionId);
    
    if (!selectedOption) {
      res.status(400).json({
        success: false,
        message: 'Invalid option selected',
      });
      return;
    }

    // If nextQuestionId is null, questionnaire is complete
    if (!selectedOption.nextQuestionId) {
      console.log('Questionnaire COMPLETED!');
      res.status(200).json({
        success: true,
        completed: true,
        message: 'Questionnaire completed!',
      });
      return;
    }

    // Get next question
    const nextQuestion = adaptiveQuestionTree[selectedOption.nextQuestionId];
    console.log('Next question found:', nextQuestion?.id);
    
    if (!nextQuestion) {
      console.log('ERROR: Next question not found in tree:', selectedOption.nextQuestionId);
      res.status(404).json({
        success: false,
        message: 'Next question not found',
      });
      return;
    }

    console.log('Returning next question successfully');
    res.status(200).json({
      success: true,
      completed: false,
      question: {
        id: nextQuestion.id,
        text: nextQuestion.text,
        category: nextQuestion.category,
        description: nextQuestion.description,
        options: nextQuestion.options.map(opt => ({
          text: opt.text,
        }))
      }
    });
  } catch (error: any) {
    console.error('Get adaptive next error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Submit adaptive questionnaire responses
// @route   POST /api/profile/adaptive/submit
// @access  Private
export const submitAdaptiveQuestionnaire = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { responses } = req.body;

    if (!responses || !Array.isArray(responses)) {
      res.status(400).json({
        success: false,
        message: 'Please provide valid responses',
      });
      return;
    }

    // Calculate scores
    const scores = {
      Explorer: 0,
      Achiever: 0,
      Strategist: 0,
      Practitioner: 0,
    };

    const traits = {
      analytical: 0,
      creative: 0,
      social: 0,
      practical: 0,
      detail_oriented: 0,
      big_picture: 0,
      independent: 0,
      collaborative: 0,
      theoretical: 0,
      experimental: 0,
    };

    const processedResponses = responses.map((resp: any) => {
      const question = adaptiveQuestionTree[resp.questionId];
      if (!question) {
        throw new Error(`Invalid question ID: ${resp.questionId}`);
      }

      const selectedOption = question.options[resp.selectedOptionIndex];
      if (!selectedOption) {
        throw new Error(`Invalid option index`);
      }

      // Add scores
      if (selectedOption.scores) {
        Object.keys(selectedOption.scores).forEach(category => {
          const key = category as keyof typeof scores;
          scores[key] += (selectedOption.scores?.[key] || 0);
        });
      }

      // Add traits
      if (selectedOption.traits) {
        Object.keys(selectedOption.traits).forEach(trait => {
          const key = trait as keyof typeof traits;
          if (key in traits) {
            traits[key] += (selectedOption.traits?.[key] || 0);
          }
        });
      }

      return {
        questionId: resp.questionId,
        answer: selectedOption.text,
        score: Object.values(selectedOption.scores || {}).reduce((a, b) => a + b, 0),
      };
    });

    const category = calculateCategory(scores);

    // Generate AI-powered personality analysis
    console.log('Generating AI analysis for user:', req.user!._id);
    const aiInsights = await generateAIAnalysis(processedResponses, scores, traits, category);

    await QuestionnaireResponse.create({
      userId: req.user!._id,
      responses: processedResponses,
      scores,
    });

    await User.findByIdAndUpdate(req.user!._id, {
      category,
      profileCompleted: true,
    });

    const topTraits = Object.entries(traits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([trait]) => trait);

    res.status(201).json({
      success: true,
      category,
      scores,
      traits,
      analysis: {
        primaryCategory: category,
        topTraits,
      },
      aiInsights: aiInsights || {
        personalityProfile: `You are a ${category} learner with strong ${topTraits.join(', ')} traits.`,
        learningPath: 'Personalized Learning Path',
        strengths: topTraits,
        growthAreas: ['Consistency', 'Practice'],
        studyStrategies: ['Regular practice', 'Build projects', 'Collaborate with peers'],
        projectSuggestions: ['Full-stack app', 'Open source contribution'],
        careerPath: 'Software Engineering and Development',
        motivationalTips: ['Stay consistent', 'Keep learning']
      }
    });
  } catch (error: any) {
    console.error('Submit adaptive error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
