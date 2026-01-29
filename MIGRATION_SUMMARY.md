# Railway to Vercel Migration Summary

## What Changed

Your WikiBuddy project has been successfully configured for Vercel deployment. Here's what was done:

### 1. **Created Vercel Configuration** (`vercel.json`)
   - Configured build settings for Vite
   - Set up API routing to serverless functions
   - Configured function memory and timeout limits

### 2. **Created Serverless API Functions** (`/api` directory)
   - `api/health.js` - Health check endpoint
   - `api/chat/message.js` - Chat endpoint with Anthropic integration
   - These replace your Express server for production deployment

### 3. **Updated Frontend** (`src/lib/ai.ts:32-44`)
   - Modified backend URL detection to use relative paths on Vercel
   - Removed hardcoded Railway URL
   - Kept localhost fallback for local development

### 4. **Updated Build Scripts** (`package.json:15`)
   - Added `vercel-build` script for Vercel deployment

### 5. **Updated `.gitignore`**
   - Added environment files to prevent committing secrets
   - Added `.vercel` folder to ignore Vercel CLI artifacts

## Quick Start - Deploy to Vercel

### Step 1: Push to Git
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect the configuration
4. Click "Deploy" (but wait - set environment variables first!)

### Step 3: Configure Environment Variables
Before your first deployment, add this in Vercel dashboard:

**Go to: Project Settings → Environment Variables**

Add:
- **Name**: `ANTHROPIC_API_KEY`
- **Value**: Your Anthropic API key (starts with `sk-ant-`)
- **Environments**: Select all (Production, Preview, Development)

### Step 4: Deploy
Click "Deploy" and wait for the build to complete.

### Step 5: Test
Visit your new Vercel URL and test:
1. Navigate to a Wikipedia article
2. Ask the AI a question
3. Verify it responds correctly

## What to Do with Railway

Once you've confirmed Vercel is working:

1. **Test thoroughly** - Make sure all features work on Vercel
2. **Update DNS** (if you have a custom domain)
3. **Delete Railway deployment** - Stop paying for unused services
4. **Keep the code** - The `/server` directory is still useful for local development

## Local Development

Your local development setup hasn't changed:

### Option 1: Use Express Server (Recommended)
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
npm run dev
```

### Option 2: Test with Vercel CLI
```bash
npm install -g vercel
vercel dev
```

## Key Differences

| Feature | Railway | Vercel |
|---------|---------|--------|
| **Backend Type** | Express server (always running) | Serverless functions (on-demand) |
| **URL Structure** | `https://backend.railway.app/api/...` | `https://app.vercel.app/api/...` |
| **Cold Starts** | None | Yes (~1-2 seconds first request) |
| **Environment Variables** | Railway dashboard | Vercel dashboard |
| **Deployment** | Git push → auto deploy | Git push → auto deploy |
| **Free Tier** | $5 credit/month | 100GB bandwidth/month |

## Cost Comparison

**Railway** (free trial expired):
- $5/month minimum
- Pay-as-you-go after credit

**Vercel Hobby** (Free):
- 100GB bandwidth/month
- 100 hours serverless execution/month
- Should be sufficient for WikiBuddy

**Vercel Pro** ($20/month):
- 1TB bandwidth/month
- Extended timeout limits
- More concurrent builds

## Troubleshooting

### "Cannot connect to backend server"
→ Check `ANTHROPIC_API_KEY` is set in Vercel environment variables

### "Authentication failed"
→ Verify your Anthropic API key is valid

### API is slow on first request
→ Normal! Vercel serverless functions have ~1-2s cold start

### CORS errors
→ Shouldn't happen since frontend and API are same domain. Clear cache.

## Files Modified

- ✅ `vercel.json` - Created
- ✅ `api/health.js` - Created
- ✅ `api/chat/message.js` - Created
- ✅ `package.json` - Updated (added vercel-build script)
- ✅ `src/lib/ai.ts` - Updated (backend URL logic)
- ✅ `.gitignore` - Updated (added .env and .vercel)
- ✅ `.env.example` - Created
- ✅ `VERCEL_DEPLOYMENT.md` - Created (detailed guide)
- ✅ `MIGRATION_SUMMARY.md` - Created (this file)

## Need Help?

1. Check `VERCEL_DEPLOYMENT.md` for detailed instructions
2. Review Vercel deployment logs
3. Test API endpoints individually
4. Check browser console for errors

## Next Steps

1. ✅ Configuration complete
2. ⏭️ Push code to Git
3. ⏭️ Deploy to Vercel
4. ⏭️ Set environment variables
5. ⏭️ Test the application
6. ⏭️ Remove Railway deployment

---

**Your project is ready for Vercel!** Just follow the "Quick Start" section above.
