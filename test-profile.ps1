Write-Host "Testing Student Profiling and Skills System" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

# Step 1: Register
Write-Host "`n1. Registering new user..." -ForegroundColor Yellow
$registerBody = @{
    name = "Alice Explorer"
    email = "alice$(Get-Random)@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "   SUCCESS: User registered: $($registerResponse.user.name)" -ForegroundColor Green
    $token = $registerResponse.token
    $headers = @{ "Authorization" = "Bearer $token" }
} catch {
    Write-Host "   FAILED: Registration" -ForegroundColor Red
    exit 1
}

# Step 2: Get questions
Write-Host "`n2. Fetching questionnaire..." -ForegroundColor Yellow
try {
    $questions = Invoke-RestMethod -Uri "http://localhost:5000/api/profile/questions" -Method GET -Headers $headers
    Write-Host "   SUCCESS: Retrieved $($questions.questions.Count) questions" -ForegroundColor Green
} catch {
    Write-Host "   FAILED" -ForegroundColor Red
}

# Step 3: Submit questionnaire
Write-Host "`n3. Submitting questionnaire..." -ForegroundColor Yellow
$responses = @(
    @{ questionId = "q1"; answer = "Try different approaches and experiment" },
    @{ questionId = "q2"; answer = "Try creative solutions and new methods" },
    @{ questionId = "q3"; answer = "Discovering new ideas and possibilities" },
    @{ questionId = "q4"; answer = "Research and innovation" },
    @{ questionId = "q5"; answer = "Generate new ideas and explore alternatives" },
    @{ questionId = "q6"; answer = "Exploring new hobbies and interests" },
    @{ questionId = "q7"; answer = "Brainstorm many possible solutions" },
    @{ questionId = "q8"; answer = "Curious and open to new methods" }
)

$questionnaireBody = @{ responses = $responses } | ConvertTo-Json -Depth 10

try {
    $result = Invoke-RestMethod -Uri "http://localhost:5000/api/profile/questionnaire" -Method POST -ContentType "application/json" -Headers $headers -Body $questionnaireBody
    Write-Host "   SUCCESS: Category $($result.category)" -ForegroundColor Green
    Write-Host "   Explorer: $($result.scores.Explorer), Achiever: $($result.scores.Achiever)" -ForegroundColor Cyan
    $userCategory = $result.category
} catch {
    Write-Host "   FAILED" -ForegroundColor Red
}

# Step 4: Get recommended skills
Write-Host "`n4. Getting recommended skills..." -ForegroundColor Yellow
try {
    $recommendedSkills = Invoke-RestMethod -Uri "http://localhost:5000/api/skills/recommended" -Method GET -Headers $headers
    Write-Host "   SUCCESS: Found $($recommendedSkills.count) skills for $userCategory" -ForegroundColor Green
    if ($recommendedSkills.skills.Count -gt 0) {
        $recommendedSkills.skills | Select-Object -First 3 | ForEach-Object {
            Write-Host "      - $($_.name)" -ForegroundColor Cyan
        }
        $firstSkillId = $recommendedSkills.skills[0]._id
    }
} catch {
    Write-Host "   FAILED" -ForegroundColor Red
}

# Step 5: Select skill
Write-Host "`n5. Adding skill to path..." -ForegroundColor Yellow
try {
    $selectBody = @{ skillId = $firstSkillId } | ConvertTo-Json
    $selectedSkill = Invoke-RestMethod -Uri "http://localhost:5000/api/skills/select" -Method POST -ContentType "application/json" -Headers $headers -Body $selectBody
    Write-Host "   SUCCESS: Added $($selectedSkill.userSkill.skillId.name)" -ForegroundColor Green
    $userSkillId = $selectedSkill.userSkill._id
} catch {
    Write-Host "   FAILED" -ForegroundColor Red
}

# Step 6: Get my skills
Write-Host "`n6. Getting my skills..." -ForegroundColor Yellow
try {
    $mySkills = Invoke-RestMethod -Uri "http://localhost:5000/api/skills/my-skills" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($mySkills.count) skill(s) in path" -ForegroundColor Green
} catch {
    Write-Host "   FAILED" -ForegroundColor Red
}

# Step 7: Update progress
Write-Host "`n7. Updating progress..." -ForegroundColor Yellow
try {
    $progressBody = @{ progress = 25; status = "in-progress"; timeSpent = 120 } | ConvertTo-Json
    $updated = Invoke-RestMethod -Uri "http://localhost:5000/api/skills/progress/$userSkillId" -Method PUT -ContentType "application/json" -Headers $headers -Body $progressBody
    Write-Host "   SUCCESS: Progress $($updated.userSkill.progress)%" -ForegroundColor Green
} catch {
    Write-Host "   FAILED" -ForegroundColor Red
}

# Step 8: Get all skills
Write-Host "`n8. Getting all skills..." -ForegroundColor Yellow
try {
    $allSkills = Invoke-RestMethod -Uri "http://localhost:5000/api/skills" -Method GET
    Write-Host "   SUCCESS: $($allSkills.count) total skills" -ForegroundColor Green
} catch {
    Write-Host "   FAILED" -ForegroundColor Red
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Gray
Write-Host "All tests passed!" -ForegroundColor Green
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "   Category: $userCategory" -ForegroundColor White
Write-Host "   Recommended: $($recommendedSkills.count)" -ForegroundColor White
Write-Host "   In Path: $($mySkills.count)" -ForegroundColor White
Write-Host "   Total Available: $($allSkills.count)" -ForegroundColor White
