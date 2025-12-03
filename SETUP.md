# 🔐 SETUP INSTRUCTIONS

## Step 1: Update the .env file

Open `server/.env` and replace these placeholders:

1. **MONGODB_URI**: Replace with your MongoDB Atlas connection string
   - Go to your MongoDB Atlas cluster
   - Click "Connect" → "Drivers"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Example: `mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/synergiq?retryWrites=true&w=majority`

2. **GEMINI_API_KEY**: Replace with your Google AI Studio API key
   - Should look like: `AIzaSy...` (starts with AIza)

3. **JWT_SECRET**: (Already set, but you can change it to something more secure)

## Step 2: Start the server

```bash
cd server
npm run dev
```

You should see:
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
🚀 Server running on port 5000 in development mode

## Step 3: Test the API

Open another terminal and test:

```bash
# Health check
curl http://localhost:5000/health

# Should return:
# {"success":true,"message":"SynergiQ API is running","timestamp":"..."}
```

## API Endpoints Available:

- POST http://localhost:5000/api/auth/register
- POST http://localhost:5000/api/auth/login
- GET  http://localhost:5000/api/auth/me (protected)
- PUT  http://localhost:5000/api/auth/profile (protected)
