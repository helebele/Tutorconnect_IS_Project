# 🚀 Quick Start Checklist

Use this checklist to deploy your TutorConnect app to Vercel with ngrok backend.

## ☐ Before You Start
- [ ] Node.js installed
- [ ] Git installed
- [ ] Project code ready in `d:\tutorconnect`
- [ ] MongoDB connection string ready
- [ ] GitHub account created
- [ ] Vercel account created (vercel.com)
- [ ] Ngrok account created (ngrok.com)

## ☐ Git & GitHub Setup
- [ ] Verify `.gitignore` is correct (already done! ✓)
- [ ] Code is committed to git
  ```powershell
  cd d:\tutorconnect
  git status
  git add .
  git commit -m "Ready for deployment"
  ```
- [ ] Code is pushed to GitHub
  ```powershell
  git push origin main
  ```

## ☐ Backend Setup
- [ ] Backend `.env` file configured with:
  - [ ] `MONGO_URI=your_connection_string`
  - [ ] `JWT_SECRET=your_secret`
  - [ ] `PORT=5000`
- [ ] Backend dependencies installed
  ```powershell
  cd d:\tutorconnect\backend
  npm install
  ```
- [ ] Backend server starts without errors
  ```powershell
  npm start
  ```
  Expected: `Server running on port 5000`

## ☐ Ngrok Setup
- [ ] Ngrok downloaded and installed
- [ ] Ngrok auth token configured
  ```powershell
  ngrok config add-authtoken YOUR_TOKEN
  ```
- [ ] Ngrok tunnel started
  ```powershell
  ngrok http 5000
  ```
- [ ] **SAVE YOUR NGROK URL** (e.g., `https://abc123.ngrok-free.app`)
  - Write it here: _______________________________________________

## ☐ Vercel Deployment
- [ ] Signed in to Vercel with GitHub
- [ ] Clicked "Add New Project"
- [ ] Selected `tutorconnect` repository
- [ ] Configured project settings:
  - [ ] Root Directory: `frontend`
  - [ ] Framework: Vite (auto-detected)
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Added environment variable:
  - [ ] Name: `VITE_BACKEND_URL`
  - [ ] Value: (your ngrok URL from above)
  - [ ] Environments: ✓ Production ✓ Preview ✓ Development
- [ ] Clicked "Deploy"
- [ ] **SAVE YOUR VERCEL URL** (e.g., `https://tutorconnect-xyz.vercel.app`)
  - Write it here: _______________________________________________

## ☐ Backend CORS Update
- [ ] Open `backend/server.js`
- [ ] Update line 22 with your Vercel URL:
  ```javascript
  "https://your-vercel-url.vercel.app",
  ```
- [ ] Save the file
- [ ] Restart backend server (Ctrl+C, then `npm start`)

## ☐ Testing
- [ ] Open Vercel URL in browser
- [ ] Frontend loads correctly
- [ ] Open browser DevTools (F12) → Console
- [ ] Check for backend URL log: `🔗 Backend URL: https://...`
- [ ] Try logging in or signing up
- [ ] Check backend terminal for API requests
- [ ] Test a feature (create class, schedule session, etc.)

## ☐ Daily Use
Every time you want to run the app:
1. [ ] Start backend: `cd backend && npm start`
2. [ ] Start ngrok: `ngrok http 5000` (in new terminal)
3. [ ] If ngrok URL changed:
   - [ ] Update `VITE_BACKEND_URL` in Vercel
   - [ ] Redeploy on Vercel

## 🎯 Quick Commands Reference

### Start Everything
Terminal 1 (Backend):
```powershell
cd d:\tutorconnect\backend
npm start
```

Terminal 2 (Ngrok):
```powershell
ngrok http 5000
```

### Deploy Code Updates
```powershell
cd d:\tutorconnect
git add .
git commit -m "Your message"
git push origin main
# Vercel auto-deploys!
```

### Update Ngrok URL in Vercel (when it changes)
1. Copy new ngrok URL from terminal
2. Go to vercel.com → Your Project
3. Settings → Environment Variables
4. Edit `VITE_BACKEND_URL` → Paste new URL → Save
5. Deployments → Latest → Redeploy

## ❗ Troubleshooting

**Frontend can't reach backend:**
- ✓ Is backend running? Check terminal 1
- ✓ Is ngrok running? Check terminal 2
- ✓ Is `VITE_BACKEND_URL` correct in Vercel?
- ✓ Did you redeploy after changing env var?

**Vercel build fails:**
- ✓ Is Root Directory set to `frontend`?
- ✓ Check Vercel build logs
- ✓ Does `npm run build` work locally?

**CORS errors:**
- ✓ Is your Vercel URL in `server.js` line 22?
- ✓ Did you restart backend after updating CORS?

## 📚 Full Documentation
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## ✅ Success Criteria
- [ ] Frontend accessible at Vercel URL
- [ ] Can create account and login
- [ ] Can create classes (tutors)
- [ ] Can enroll in classes (students)
- [ ] Can join video sessions
- [ ] No CORS errors in browser console

**You're done! 🎉**
