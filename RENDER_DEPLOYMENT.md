# Deploy to Render - Step by Step Guide

This guide will walk you through deploying your QR Convention Scanner to Render (backend) and Vercel (frontend).

## Prerequisites

- [ ] GitHub account
- [ ] Render account (sign up at [render.com](https://render.com) - FREE)
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com) - FREE)
- [ ] Your Groq API key

## Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub

If you haven't already:

```bash
cd /Users/lironkatsif/desktop/swe/personal/qr-convention-app

# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - QR Convention Scanner"

# Create repo on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/qr-convention-app.git
git push -u origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 3: Create New Web Service

1. From Render dashboard, click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Find and select your `qr-convention-app` repository
4. If you don't see it, click "Configure account" and grant access

### Step 4: Configure Web Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `qr-scanner-backend` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT!**
- **Runtime**: `Python 3`

**Build & Deploy:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

**Instance Type:**
- Select **"Free"** (0$/month)

### Step 5: Add Environment Variables

Scroll down to **Environment Variables** section and add these THREE variables:

⚠️ **Copy these values from your `backend/.env` file**

1. Click **"Add Environment Variable"**

   **Variable 1:**
   - Key: `GROQ_API_KEY`
   - Value: (paste value from your backend/.env file)

   **Variable 2:**
   - Key: `SECRET_KEY`
   - Value: (paste value from your backend/.env file)

   **Variable 3:**
   - Key: `JWT_SECRET_KEY`
   - Value: (paste value from your backend/.env file)

### Step 6: Deploy!

1. Click **"Create Web Service"** at the bottom
2. Render will start building and deploying your backend
3. Wait 2-3 minutes for the build to complete
4. Look for "Your service is live 🎉" message

### Step 7: Get Your Backend URL

Once deployed:
1. You'll see your service URL at the top (e.g., `https://qr-scanner-backend.onrender.com`)
2. **Copy this URL** - you'll need it for the frontend
3. Test it by visiting: `https://your-service-name.onrender.com/api/health`
4. You should see: `{"status":"healthy"}`

**⚠️ Important Note about Free Tier:**
- Free Render services spin down after 15 minutes of inactivity
- First request after spindown takes ~30-60 seconds to wake up
- Subsequent requests are fast
- This is normal for free tier!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment Variable

Before deploying, you need to set your backend URL.

Edit `frontend/.env.production`:

```env
VITE_API_URL=https://your-service-name.onrender.com/api
```

Replace `your-service-name` with your actual Render service name.

**OR** commit the change:

```bash
cd frontend
echo "VITE_API_URL=https://qr-scanner-backend.onrender.com/api" > .env.production
cd ..
git add .
git commit -m "Add production backend URL"
git push
```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your `qr-convention-app` repository
5. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT!**
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)
   - **Install Command**: `npm install` (should be auto-detected)

6. Add Environment Variable:
   - Click **"Environment Variables"**
   - Key: `VITE_API_URL`
   - Value: `https://qr-scanner-backend.onrender.com/api` (use YOUR Render URL)
   - Select all environments: Production, Preview, Development

7. Click **"Deploy"**
8. Wait 1-2 minutes for deployment

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts, then deploy to production
vercel --prod
```

### Step 3: Get Your Frontend URL

Once deployed:
1. Vercel shows your live URL (e.g., `https://qr-convention-app.vercel.app`)
2. Click on it to open your app!

---

## Part 3: Test Your Deployment

### Backend Tests

Visit these URLs (replace with your actual Render URL):

1. **Health Check**: `https://qr-scanner-backend.onrender.com/api/health`
   - Should return: `{"status":"healthy"}`

2. **CORS Test**: Open browser console on your Vercel URL and run:
   ```javascript
   fetch('https://qr-scanner-backend.onrender.com/api/health')
     .then(r => r.json())
     .then(console.log)
   ```
   - Should return the health status without CORS errors

### Frontend Tests

On your Vercel URL:

1. ✅ **Page loads** (not 404)
2. ✅ **Register** a new account
3. ✅ **Login** with your account
4. ✅ **Create** a new event
5. ✅ **Grant camera access** (HTTPS required - should work)
6. ✅ **Scan** a QR code (use [qr-code-generator.com](https://www.qr-code-generator.com/) to create test codes)
7. ✅ **Process with AI** - switch to Gallery tab and click "Process"
8. ✅ **Export** - download CSV/JSON

---

## Troubleshooting

### Backend Issues

**Build fails on Render:**
```bash
# Check that backend/requirements.txt includes gunicorn
gunicorn==21.2.0
```

**Service won't start:**
- Check Render logs (Logs tab in dashboard)
- Verify environment variables are set
- Check that Root Directory is set to `backend`

**Health endpoint returns 404:**
- Verify Start Command is `gunicorn app:app`
- Check Render logs for errors

### Frontend Issues

**404 on routes:**
- ✅ Fixed by `vercel.json` (already created)
- Ensure file is in `frontend/` directory
- Redeploy if needed

**Can't connect to backend:**
- Check browser console for errors
- Verify `VITE_API_URL` in Vercel environment variables
- Test backend URL directly
- Check for CORS errors (backend should allow `*.vercel.app`)

**Camera doesn't work:**
- Vercel provides HTTPS automatically ✅
- Grant camera permissions in browser
- Try different browser if issues persist

**Environment variable not working:**
- Must be prefixed with `VITE_` for Vite apps
- Redeploy after adding variables
- Clear Vercel cache: Settings → General → Clear Build Cache

### Performance Issues

**Backend is slow (first request):**
- Normal for Render free tier
- Service spins down after 15 minutes
- First request takes ~30-60 seconds
- Consider paid plan ($7/month) for always-on service

**Solutions for free tier:**
- Use a cron job to ping backend every 14 minutes
- Accept the warm-up time
- Upgrade to paid tier

---

## Post-Deployment Checklist

- [ ] Backend is live and health check works
- [ ] Frontend loads on Vercel URL
- [ ] Can register and login
- [ ] Can create events
- [ ] Camera access works (HTTPS)
- [ ] QR code scanning works
- [ ] AI processing works (check Groq API key)
- [ ] Export functionality works
- [ ] PWA can be installed on mobile

---

## Your Deployed URLs

Fill these in after deployment:

**Backend (Render):**
```
https://qr-scanner-backend.onrender.com
Health Check: https://qr-scanner-backend.onrender.com/api/health
```

**Frontend (Vercel):**
```
https://qr-convention-app.vercel.app
```

---

## Updating Your App

### Update Backend:
```bash
git add .
git commit -m "Update backend"
git push
```
Render auto-deploys on push! ✅

### Update Frontend:
```bash
git add .
git commit -m "Update frontend"
git push
```
Vercel auto-deploys on push! ✅

---

## Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to your project → Settings → Domains
2. Add your domain (e.g., `qrscanner.com`)
3. Follow DNS configuration instructions
4. Free SSL certificate included!

### For Render (Backend):
1. Go to your service → Settings → Custom Domains
2. Add your API domain (e.g., `api.qrscanner.com`)
3. Follow DNS configuration instructions
4. Free SSL certificate included!

---

## Cost Summary

| Service | Free Tier | What You Get |
|---------|-----------|--------------|
| Render | ✅ Free | 750 hours/month, auto-sleep after 15min |
| Vercel | ✅ Free | 100GB bandwidth, unlimited projects |
| Groq | ✅ Free | Rate-limited API access |

**Total Monthly Cost: $0** 🎉

---

## Need Help?

Common issues:
1. Check Render logs (Logs tab)
2. Check Vercel logs (Deployments → Function Logs)
3. Check browser console (F12)
4. Verify all environment variables are set
5. Test backend health endpoint directly

Still stuck? Check:
- Render documentation: [render.com/docs](https://render.com/docs)
- Vercel documentation: [vercel.com/docs](https://vercel.com/docs)

---

Happy deploying! 🚀
