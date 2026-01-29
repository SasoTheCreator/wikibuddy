# WikiBuddy - Vercel Deployment Guide

This guide will help you migrate your WikiBuddy project from Railway to Vercel.

## Overview

Your project has been configured to run on Vercel with:
- **Frontend**: React/Vite application
- **Backend**: Serverless functions in the `/api` directory
- **API Integration**: Anthropic Claude AI

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your Anthropic API key
3. Git repository connected to Vercel

## Deployment Steps

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2. Configure Environment Variables

In your Vercel project dashboard, add the following environment variable:

**Required:**
- `ANTHROPIC_API_KEY` - Your Anthropic API key from https://console.anthropic.com

**Optional:**
- `NODE_ENV` - Set to `production` (usually set automatically by Vercel)
- `VITE_BACKEND_URL` - Leave empty for production (uses relative paths)

#### How to add environment variables in Vercel:

1. Go to your project in Vercel dashboard
2. Click on "Settings"
3. Navigate to "Environment Variables"
4. Add each variable with its value
5. Select which environments (Production, Preview, Development) should use each variable

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect the configuration from `vercel.json`
4. Click "Deploy"

#### Option B: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### 4. Verify Deployment

After deployment, test these endpoints:

1. **Health Check**: `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

2. **Frontend**: `https://your-app.vercel.app`
   - Your React app should load normally

3. **Chat API**: Test by using the app and asking questions about Wikipedia articles

## Project Structure

```
wiki-scribe-buddy/
├── api/                      # Serverless functions for Vercel
│   ├── health.js            # Health check endpoint
│   └── chat/
│       └── message.js       # Chat API endpoint
├── server/                   # Original Express server (not used on Vercel)
│   └── src/
│       ├── index.ts
│       ├── routes/
│       └── services/
├── src/                      # Frontend React application
├── dist/                     # Build output (generated)
├── vercel.json              # Vercel configuration
├── package.json
└── vite.config.ts
```

## Configuration Files

### vercel.json

This file configures your Vercel deployment:
- Routes API requests to serverless functions
- Sets memory and timeout for functions
- Configures build settings

### API Routes

The backend API has been converted to Vercel serverless functions:

- `/api/health` → `api/health.js`
- `/api/chat/message` → `api/chat/message.js`

## Local Development

For local development, you still have two options:

### Option 1: Use the Express Server (Recommended for Development)

```bash
# Terminal 1: Start the Express backend
cd server
npm install
npm run dev

# Terminal 2: Start the Vite frontend
npm run dev
```

### Option 2: Test Vercel Functions Locally

```bash
# Install Vercel CLI
npm install -g vercel

# Run Vercel dev server
vercel dev
```

## Environment Variables Reference

### Backend (Serverless Functions)

Set these in Vercel dashboard under "Environment Variables":

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes | `sk-ant-...` |
| `NODE_ENV` | Environment mode | No | `production` |

### Frontend (Vite)

These are set at build time:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_BACKEND_URL` | Backend API URL | No | `` (empty = relative) |
| `VITE_DEV_SERVER_PORT` | Dev server port | No | `8080` |

## Troubleshooting

### Issue: "Cannot connect to backend server"

**Solution**: Check that:
1. Your `ANTHROPIC_API_KEY` is set in Vercel environment variables
2. The API functions are deployed (check Vercel deployment logs)
3. Your frontend is using the correct backend URL

### Issue: "Authentication failed"

**Solution**:
1. Verify your `ANTHROPIC_API_KEY` is correct
2. Check that the key has the necessary permissions
3. Make sure the environment variable is set for the correct environment (Production/Preview)

### Issue: API function timeout

**Solution**:
1. Check the function logs in Vercel dashboard
2. Increase the `maxDuration` in `vercel.json` if needed (max 10s on Hobby plan)
3. Consider optimizing the Anthropic API request

### Issue: CORS errors

**Solution**:
Since the frontend and API are on the same domain with Vercel, CORS shouldn't be an issue. If you see CORS errors:
1. Clear your browser cache
2. Make sure you're not using localhost URLs in production
3. Check that the frontend is using relative API paths (empty `backendUrl`)

## Differences from Railway

| Aspect | Railway | Vercel |
|--------|---------|--------|
| **Backend** | Express server (always running) | Serverless functions (on-demand) |
| **Scaling** | Container-based | Automatic, per-function |
| **Cold starts** | No | Yes (first request may be slower) |
| **Deployment** | Git push or CLI | Git push or CLI |
| **Environment** | Persistent | Stateless |
| **API Route** | Separate domain | Same domain (relative paths) |

## Cost Considerations

Vercel pricing (as of 2025):

- **Hobby Plan** (Free):
  - 100GB bandwidth/month
  - Unlimited deployments
  - Serverless functions: 100 hours execution time/month
  - Function timeout: 10s max

- **Pro Plan** ($20/month):
  - 1TB bandwidth/month
  - Extended function timeout options
  - More concurrent builds

For typical usage of WikiBuddy, the Hobby plan should be sufficient.

## Migration Checklist

- [ ] Create Vercel account
- [ ] Connect your Git repository to Vercel
- [ ] Add `ANTHROPIC_API_KEY` environment variable in Vercel dashboard
- [ ] Deploy the project
- [ ] Test the health endpoint
- [ ] Test the chat functionality
- [ ] Update any external links to point to new Vercel URL
- [ ] Remove Railway deployment (optional)

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Anthropic API Documentation](https://docs.anthropic.com/)

## Support

If you encounter issues during migration:
1. Check Vercel deployment logs
2. Test API endpoints individually
3. Verify environment variables are set correctly
4. Check browser console for frontend errors

---

**Note**: The original Express server in the `/server` directory is kept for local development but is not used in Vercel deployment. The serverless functions in `/api` provide the same functionality.
