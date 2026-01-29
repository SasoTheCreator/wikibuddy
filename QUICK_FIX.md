# Quick Fix for Environment Variable Issue

## Test These URLs After Deploying

After you push these changes and Vercel redeploys:

1. **Test health endpoint first:**
   ```
   https://your-app.vercel.app/api/health
   ```

   Should show:
   ```json
   {
     "status": "OK",
     "hasAnthropicKey": true,
     "keyPrefix": "sk-ant-api..."
   }
   ```

2. **If you get 404**, the API routes aren't working. This means:
   - Vercel isn't detecting the `/api` folder as serverless functions
   - OR the build/deployment has an issue

## If You're Getting 404 on All API Routes

This suggests the `/api` folder structure isn't being recognized. Here's what to check:

### 1. Check Vercel Build Logs

In Vercel Dashboard:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Look at the build logs
4. Check if it says "Detected Serverless Functions" and lists your API files

### 2. Verify Folder Structure

Your structure should be:
```
wiki-scribe-buddy/
├── api/
│   ├── health.js          ← Should become /api/health
│   ├── debug-env.js       ← Should become /api/debug-env
│   └── chat/
│       └── message.js     ← Should become /api/chat/message
├── src/
├── dist/
└── vercel.json
```

### 3. Check if Files Are in Git

Make sure the API files are committed:
```bash
git status
git add api/
git commit -m "Add API serverless functions"
git push
```

### 4. Alternative: Check Function Logs

In Vercel Dashboard:
1. Go to **Deployments** → Latest deployment
2. Click **Functions** tab
3. See if your functions are listed
4. Click on a function to see its logs

## Current Changes Made

I've updated:
1. ✅ `vercel.json` - Simplified configuration
2. ✅ `api/health.js` - Added environment variable debugging
3. ✅ `api/debug-env.js` - Created debug endpoint

## Steps to Deploy and Test

```bash
# 1. Commit changes
git add .
git commit -m "Fix Vercel API routes and add debugging"
git push

# 2. Wait for Vercel to deploy (check dashboard)

# 3. Test health endpoint
curl https://your-app.vercel.app/api/health

# 4. Check the response
# Should see hasAnthropicKey: true or false
```

## What the Response Tells You

### If hasAnthropicKey: true
✅ Environment variable is set correctly!
The original error was probably a different issue.

### If hasAnthropicKey: false
❌ Environment variable not set or not accessible
1. Go to Vercel Settings → Environment Variables
2. Add `ANTHROPIC_API_KEY` (no VITE_ prefix)
3. Check all three environment boxes
4. Redeploy

### If you get 404
❌ API routes not working
- Check build logs in Vercel
- Make sure `api/` folder is committed to git
- Try removing and re-adding the Vercel project

## Screenshot What You See

When you test `/api/health`, take a screenshot or copy the exact response and share it. That will help diagnose the issue.
