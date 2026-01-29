# Fix: ANTHROPIC_API_KEY Not Configured

## The Issue
The error "ANTHROPIC_API_KEY is not configured" means your serverless function cannot access the API key.

## Quick Fix Steps

### 1. Set Environment Variable in Vercel (Correct Way)

Go to: **Your Project → Settings → Environment Variables**

Add this variable:
```
Name:  ANTHROPIC_API_KEY
Value: sk-ant-... (your actual key)
```

**IMPORTANT CHECKBOXES:**
- ✅ Production
- ✅ Preview
- ✅ Development

**DO NOT** add `VITE_` prefix! Serverless functions don't use VITE_ variables.

### 2. Redeploy Your Project

Environment variables only take effect after redeployment.

**Option A: Redeploy from Dashboard**
1. Go to **Deployments** tab
2. Click **"..."** menu on latest deployment
3. Click **"Redeploy"**

**Option B: Trigger New Deployment**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

### 3. Test the Fix

After redeployment, test this debug endpoint:
```
https://your-app.vercel.app/api/debug-env
```

You should see:
```json
{
  "hasAnthropicKey": true,
  "keyPrefix": "sk-ant-api...",
  "allEnvKeys": ["ANTHROPIC_API_KEY"],
  "nodeEnv": "production",
  "vercelEnv": "production"
}
```

If `hasAnthropicKey` is `false`, the variable isn't set correctly.

### 4. Delete Debug Endpoint (After Testing)

Once it works, delete the debug file for security:
```bash
rm api/debug-env.js
git add api/debug-env.js
git commit -m "Remove debug endpoint"
git push
```

## Common Mistakes

### ❌ WRONG: Using VITE_ prefix
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```
This makes the key accessible in the browser (UNSAFE!) and serverless functions can't access it.

### ❌ WRONG: Not selecting all environments
If you only check "Production", previews won't work.

### ❌ WRONG: Not redeploying
Environment variables don't update in existing deployments.

### ✅ CORRECT: Plain name, all environments
```
ANTHROPIC_API_KEY=sk-ant-...
```
Check all three environment boxes, then redeploy.

## Verify Your API Key

Make sure your Anthropic API key:
1. Starts with `sk-ant-`
2. Is active (not deleted in Anthropic console)
3. Has the correct permissions

Test it here: https://console.anthropic.com/settings/keys

## Still Not Working?

### Check Vercel Logs
1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **"Functions"** tab
4. Click on `/api/chat/message`
5. Check the logs for errors

### Check Browser Console
Look for the exact error message. If it still says "ANTHROPIC_API_KEY is not configured", the variable isn't reaching the function.

### Nuclear Option: Delete and Re-add Variable
1. Delete `ANTHROPIC_API_KEY` from Vercel
2. Save changes
3. Add it again with correct value
4. Check all environment boxes
5. Redeploy

## Environment Variables Explained

### Frontend Variables (Browser)
- Prefix: `VITE_`
- Accessible: In browser JavaScript
- Use for: Public configuration (URLs, feature flags)
- Security: ⚠️ NEVER put secrets here!

Example:
```
VITE_APP_NAME=WikiBuddy
VITE_BACKEND_URL=https://api.example.com
```

### Backend Variables (Serverless)
- Prefix: None
- Accessible: Only in serverless functions
- Use for: API keys, secrets, database URLs
- Security: ✅ Safe for sensitive data

Example:
```
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgres://...
```

## Summary

1. Variable name: `ANTHROPIC_API_KEY` (no VITE_)
2. Set in: Vercel Dashboard → Settings → Environment Variables
3. Check all environments: Production, Preview, Development
4. Redeploy after setting
5. Test with `/api/debug-env` endpoint
6. Remove debug endpoint after confirming it works

---

**After following these steps, your API should work!** If you still have issues, share the output from the debug endpoint.
