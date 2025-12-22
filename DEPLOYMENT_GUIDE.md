# 🚀 TutorConnect Deployment Guide
## Hosting Frontend on Vercel + Backend via Ngrok

This guide walks you through deploying your frontend to Vercel while running your backend locally and exposing it via ngrok.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup with Ngrok](#backend-setup-with-ngrok)
3. [Frontend Deployment to Vercel](#frontend-deployment-to-vercel)
4. [Testing the Setup](#testing-the-setup)
5. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### Required Accounts
- **GitHub Account** - You already have a repo, so you're set! ✓
- **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier is fine)
- **Ngrok Account** - Sign up at [ngrok.com](https://ngrok.com) (free tier is fine)

### Required Software
- Node.js (v16 or higher)
- Git
- npm or yarn

---

## 🔧 Backend Setup with Ngrok

### Step 1: Install Ngrok

**Option A: Download from Website**
1. Go to [ngrok.com/download](https://ngrok.com/download)
2. Download the Windows version
3. Extract to a folder (e.g., `C:\ngrok`)
4. Add to PATH or run from that folder

**Option B: Using Chocolatey (if you have it)**
```powershell
choco install ngrok
```

### Step 2: Configure Ngrok with Your Auth Token

1. Go to [ngrok.com/dashboard](https://dashboard.ngrok.com/)
2. Copy your auth token
3. Run this command:
```powershell
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### Step 3: Update Backend Environment Variables

1. Navigate to your backend folder:
```powershell
cd d:\tutorconnect\backend
```

2. Make sure your `.env` file exists and has:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

> ⚠️ **IMPORTANT**: Never commit your `.env` file! It's already in `.gitignore`.

### Step 4: Start Your Backend Server

In the backend folder, run:
```powershell
npm install
npm start
```

Your backend should now be running on `http://localhost:5000`

### Step 5: Start Ngrok Tunnel

Open a **new terminal window** and run:
```powershell
ngrok http 5000
```

You'll see output like this:
```
ngrok by @inconshreveable

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Forwarding                    https://abc123xyz.ngrok-free.app -> http://localhost:5000
```

> 📝 **COPY THE HTTPS URL** - You'll need this for Vercel!
> Example: `https://abc123xyz.ngrok-free.app`

### Step 6: Update CORS in Backend (if needed)

Your backend is already configured correctly! Line 22 in `server.js` has:
```javascript
"https://tutorconnect-five.vercel.app"
```

If your Vercel URL is different, you'll update this after deploying to Vercel.

---

## 🌐 Frontend Deployment to Vercel

### Step 1: Push Code to GitHub

1. **Check current git status:**
```powershell
cd d:\tutorconnect
git status
```

2. **Add and commit all changes:**
```powershell
git add .
git commit -m "Prepare for Vercel deployment"
```

3. **Push to GitHub:**
```powershell
git push origin main
```
> Note: Replace `main` with `master` if that's your default branch

### Step 2: Create Vercel Account & Connect GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → Choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub repositories

### Step 3: Import Your Project to Vercel

1. Click **"Add New Project"** or **"Import Project"**
2. Find and select your `tutorconnect` repository
3. Vercel will detect it's a Vite app automatically

### Step 4: Configure Build Settings

Vercel should auto-detect these settings, but verify:
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 5: Add Environment Variables

This is **CRITICAL** for connecting to your ngrok backend!

In the Vercel project settings:
1. Scroll to **"Environment Variables"**
2. Add this variable:
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: `https://abc123xyz.ngrok-free.app` (your ngrok URL from Step 5 above)
   - **Environment**: Check all (Production, Preview, Development)

![Environment Variables Example](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F2mKXxqe7rKHpCLipKkxWwT%2F2b0f3b3b3b3b3b3b3b3b3b3b%2Fenv-vars.png&w=3840&q=75)

### Step 6: Deploy!

1. Click **"Deploy"**
2. Wait 1-2 minutes for the build to complete
3. You'll get a URL like: `https://tutorconnect-abc123.vercel.app`

---

## 🎯 Final Configuration

### Update Backend CORS (if your Vercel URL differs)

1. Open `d:\tutorconnect\backend\server.js`
2. Update line 22 with your actual Vercel URL:
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://your-actual-vercel-url.vercel.app", // ← Update this
  process.env.CLIENT_URL
].filter(Boolean);
```

3. Restart your backend server (stop with Ctrl+C, then `npm start`)
4. Make sure ngrok is still running!

---

## 🧪 Testing the Setup

### Test 1: Health Check
1. Open your browser
2. Go to your Vercel URL: `https://tutorconnect-abc123.vercel.app`
3. The site should load!

### Test 2: Backend Connection
1. Open browser DevTools (F12)
2. Go to Console tab
3. You should see: `🔗 Backend URL: https://abc123xyz.ngrok-free.app`
4. Try logging in or signing up - it should work!

### Test 3: API Request
In your browser console, try:
```javascript
fetch('https://abc123xyz.ngrok-free.app/api/health')
  .then(r => r.json())
  .then(console.log)
```

You should see: `{status: "ok"}`

---

## ⚠️ Important Notes

### Ngrok Free Tier Limitations
- 🔄 **URL Changes**: Your ngrok URL changes every time you restart ngrok
- ⏰ **Session Timeout**: Free tier sessions expire after 2 hours
- 🔧 **To Fix**: Get a static domain on paid plan OR update `VITE_BACKEND_URL` in Vercel each time

### Keeping Your Backend Running
1. Backend must be running on your laptop (`npm start` in backend folder)
2. Ngrok must be running (`ngrok http 5000` in separate terminal)
3. Your laptop must be connected to the internet
4. Don't close these terminal windows!

### For Long-Term Use
Consider:
- **Ngrok Paid Plan**: Get a static subdomain that doesn't change
- **Backend Hosting**: Deploy backend to Heroku, Railway, Render, or AWS
- **Database**: Make sure MongoDB is accessible (use MongoDB Atlas for cloud DB)

---

## 🐛 Troubleshooting

### Problem: "Failed to fetch" errors

**Solution 1: Check ngrok is running**
```powershell
# In terminal, you should see:
Forwarding   https://abc123xyz.ngrok-free.app -> http://localhost:5000
```

**Solution 2: Update Vercel environment variable**
1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Update `VITE_BACKEND_URL` with current ngrok URL
4. Redeploy: Deployments tab → Click ⋮ → Redeploy

**Solution 3: Check CORS**
Look at backend terminal logs - should see OPTIONS requests being handled

### Problem: Ngrok shows "Visit Site" button

This is normal for free tier. Users will see a warning page first, then can click "Visit Site".

To skip this, add the header (already done in your `api.js`!):
```javascript
"ngrok-skip-browser-warning": "true"
```

### Problem: Vercel build fails

**Check these:**
1. Is `package.json` in the frontend folder?
2. Did you set Root Directory to `frontend` in Vercel settings?
3. Check build logs in Vercel dashboard

### Problem: WebSocket/Socket.io connection fails

Make sure your socket connection uses the ngrok URL:
1. Check `config.js` - it should use `VITE_BACKEND_URL`
2. Ngrok supports WebSockets on free tier ✓

---

## 📝 Quick Reference Commands

### Start Development
```powershell
# Terminal 1: Backend
cd d:\tutorconnect\backend
npm start

# Terminal 2: Ngrok
ngrok http 5000

# Terminal 3: Frontend (local testing)
cd d:\tutorconnect\frontend
npm run dev
```

### Deploy Updates
```powershell
cd d:\tutorconnect
git add .
git commit -m "Your update message"
git push origin main
# Vercel auto-deploys on push!
```

### Update Ngrok URL in Vercel
1. Copy new ngrok URL from terminal
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Select your project → Settings → Environment Variables
4. Edit `VITE_BACKEND_URL` → Save
5. Deployments tab → Redeploy latest

---

## 🎉 You're All Set!

Your frontend is now hosted on Vercel and connected to your local backend via ngrok!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend (via ngrok): `https://abc123xyz.ngrok-free.app`
- Backend (local): `http://localhost:5000`

Remember to keep both your backend and ngrok running whenever you want the app to work!
