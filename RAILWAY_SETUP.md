# Railway Deployment Setup

## Issues Fixed

### 1. Duplicate Schema Index Warning ✅
**Fixed** the duplicate index on `{"user":1}` in the Reward model by:
- Removed the duplicate `RewardSchema.index({ user: 1 })` call
- Kept `unique: true` and added `index: true` on the user field definition

### 2. MongoDB URI Undefined Error

This error occurs because Railway cannot read the `.env` file. Environment variables must be configured in Railway's dashboard.

## Railway Configuration Steps

### Step 1: Add Environment Variables in Railway Dashboard

1. Go to your Railway project dashboard
2. Click on your service
3. Go to **Variables** tab
4. Add the following environment variables:

```
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://admin:admin%40123@synergiq.azv8e6b.mongodb.net/?appName=Synergiq
JWT_SECRET=synergiq-super-secret-jwt-key-2025-change-in-production
JWT_EXPIRE=7d
GEMINI_API_KEY=AIzaSyBcRWAEQQ7ws45dWNTMJsalwb4DVbb-euc
CLIENT_URL=https://your-frontend-url.railway.app
```

**Important Notes:**
- Replace `CLIENT_URL` with your actual frontend Railway URL
- Consider changing `JWT_SECRET` to a stronger secret for production
- Make sure `MONGODB_URI` is exactly as shown (with proper URL encoding for special characters)

### Step 2: Build Configuration

Railway should automatically detect your project type. Verify these settings:

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

**Root Directory:**
```
/
```

### Step 3: Deploy

1. Commit and push your changes to GitHub
2. Railway will automatically redeploy
3. Check the deployment logs for:
   - ✅ MongoDB Connected: ac-rbgtaua-shard-00-01.azv8e6b.mongodb.net
   - 🚀 Server running on port 8080 in production mode
   - **No** duplicate index warnings
   - **No** MongoDB URI undefined errors

## Troubleshooting

### If MongoDB connection still fails:

1. **Check MongoDB Atlas IP Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` to allow all IPs (or add Railway's IPs specifically)

2. **Verify MongoDB URI format:**
   - Should be: `mongodb+srv://username:password@cluster.mongodb.net/?appName=AppName`
   - Special characters in password must be URL encoded (@ becomes %40)

3. **Check Railway logs:**
   ```
   railway logs
   ```

### If duplicate index warning persists:

1. **Drop existing indexes in MongoDB:**
   ```javascript
   // Connect to MongoDB and run:
   db.rewards.dropIndexes()
   ```

2. **Rebuild and redeploy:**
   ```bash
   npm run build
   git add .
   git commit -m "Fix: Remove duplicate index"
   git push
   ```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Railway sets this) | `8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secret-key` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `CLIENT_URL` | Frontend URL for CORS | `https://...` |

## Health Check

Once deployed, test your API:

```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "success": true,
  "message": "SynergiQ API is running",
  "timestamp": "2025-12-03T..."
}
```
