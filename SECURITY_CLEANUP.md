# 🚨 SECURITY INCIDENT - API Key Exposed

## What Happened
Your Anthropic API key was committed to git and pushed to GitHub. GitHub detected it and notified Anthropic, who **deactivated the key** to prevent abuse.

## ✅ I've Already Done:
1. ✅ Removed the exposed key from `server/.env`
2. ✅ Created `server/.env.example` as a template
3. ✅ Verified `.gitignore` includes `server/.env` (line 19)

## 🔥 What YOU Need to Do NOW:

### Step 1: Create New API Key (URGENT)
1. Go to https://console.anthropic.com/settings/keys
2. Delete the old key: `api-key` (Key ID: 4592357) - already deactivated
3. Click **"Create Key"**
4. Name it something like `wikibuddy-production`
5. **Copy the key immediately** - you only see it once!

### Step 2: Add New Key to Local Dev (for testing)
```bash
# Edit server/.env and add your NEW key
# Replace 'your-api-key-here' with the actual key
nano server/.env
# or
code server/.env
```

Change line 7 from:
```
ANTHROPIC_API_KEY=your-api-key-here
```
To:
```
ANTHROPIC_API_KEY=sk-ant-YOUR-NEW-KEY-HERE
```

**IMPORTANT**: Do NOT commit this file!

### Step 3: Add New Key to Vercel
1. Go to https://vercel.com/dashboard
2. Select your WikiBuddy project
3. Go to **Settings** → **Environment Variables**
4. Find `ANTHROPIC_API_KEY` and click **Edit**
5. Replace with your NEW key
6. Make sure all three environments are checked (Production, Preview, Development)
7. Click **Save**

### Step 4: Remove Key from Git History

The old key is in your git history. You need to remove it:

#### Option A: Use BFG Repo-Cleaner (Recommended)

```bash
# Install BFG
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Backup your repo first!
cd ..
cp -r wiki-scribe-buddy wiki-scribe-buddy-backup

# Clean the key from history
cd wiki-scribe-buddy
bfg --replace-text <(echo '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==>***REMOVED***')

# Clean up and force push
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (this rewrites history)
git push --force origin main
```

#### Option B: Use git-filter-repo (Alternative)

```bash
# Install git-filter-repo
pip3 install git-filter-repo

# Create a file with the key to remove
echo "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" > /tmp/secret.txt

# Remove it from history
git filter-repo --replace-text /tmp/secret.txt

# Force push
git push --force origin main
```

#### Option C: Nuclear Option - Start Fresh (Easiest)

If the above are too complex, you can start with a clean slate:

```bash
# 1. Delete the GitHub repo (save a local copy first!)
# Go to GitHub → Your Repo → Settings → Delete Repository

# 2. Remove git history locally
cd wiki-scribe-buddy
rm -rf .git

# 3. Initialize new repo
git init
git add .
git commit -m "Initial commit with security fixes"

# 4. Create new GitHub repo and push
git remote add origin https://github.com/YOUR-USERNAME/wikibuddy.git
git branch -M main
git push -u origin main
```

### Step 5: Commit Current Changes (Without the Key)

```bash
# Stage the sanitized files
git add server/.env server/.env.example .gitignore
git commit -m "Security: Remove exposed API key and add .env.example"

# Only push if you've cleaned the history (Step 4)
# Otherwise, the old key is still in git history!
```

### Step 6: Redeploy Vercel

After adding the new key to Vercel:
```bash
# Trigger a redeploy
git commit --allow-empty -m "Redeploy with new API key"
git push
```

Or manually redeploy from Vercel dashboard.

## 🔒 Future Prevention

### Never Commit These Files:
- ❌ `.env`
- ❌ `.env.local`
- ❌ `server/.env`
- ❌ Any file with actual API keys

### Always Commit These:
- ✅ `.env.example` (with placeholder values)
- ✅ `.gitignore` (to ignore .env files)
- ✅ Documentation about required env vars

### Best Practices:
1. **Use environment variables** for all secrets
2. **Never hardcode** API keys in source code
3. **Use `.env.example`** to show what variables are needed
4. **Double-check** before committing: `git diff --cached`
5. **Enable secret scanning** on GitHub (should already be active)

## Verify Everything Works

After completing all steps:

1. **Test local dev:**
   ```bash
   cd server
   npm run dev
   ```
   Should start without errors

2. **Test Vercel:**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should show `"hasAnthropicKey": true`

3. **Test the app:**
   Load a Wikipedia article and ask a question

## Questions?

If you have questions about any step, ask before proceeding. Security cleanup is critical!

## Summary Checklist

- [ ] Created new API key at Anthropic console
- [ ] Added new key to `server/.env` locally (for dev)
- [ ] Added new key to Vercel environment variables
- [ ] Removed old key from git history (Option A, B, or C)
- [ ] Force pushed cleaned history (if using Option A or B)
- [ ] Committed sanitized files
- [ ] Redeployed Vercel
- [ ] Tested that everything works
- [ ] Deleted backup files/repos

---

**Current Status**: Old key deactivated ✅ | New key needed ⏳ | Git history needs cleaning 🚨
