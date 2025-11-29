# Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free at [vercel.com](https://vercel.com))
- Backend deployed and accessible via HTTPS

### Step 1: Deploy Backend First

You need to deploy the backend before deploying the frontend. Options:

#### Option A: Railway (Recommended - Free Tier)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   - `GROQ_API_KEY`
   - `SECRET_KEY`
   - `JWT_SECRET_KEY`
   - `PORT=5000`
6. Railway will auto-detect Flask and deploy
7. Copy your backend URL (e.g., `https://your-app.railway.app`)

#### Option B: Render (Free Tier)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Root Directory**: `backend`
6. Add environment variables (same as Railway)
7. Add `gunicorn` to `backend/requirements.txt`:
   ```txt
   flask==3.0.0
   flask-cors==4.0.0
   flask-jwt-extended==4.6.0
   python-dotenv==1.0.0
   groq==0.11.0
   httpx==0.27.0
   werkzeug==3.0.1
   gunicorn==21.2.0
   ```
8. Copy your backend URL

### Step 2: Deploy Frontend to Vercel

#### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

3. **Set environment variable** (replace with your actual backend URL):
   ```bash
   # Create .env.production file
   echo "VITE_API_URL=https://your-backend-url.railway.app/api" > .env.production
   ```

4. **Deploy**:
   ```bash
   vercel
   ```

5. **Follow prompts**:
   - Set up and deploy? **Y**
   - Which scope? (select your account)
   - Link to existing project? **N**
   - Project name? (press enter or type a name)
   - In which directory is your code located? **.**
   - Want to override settings? **N**

6. **Set production environment variable** in Vercel dashboard:
   - Go to your project on [vercel.com](https://vercel.com)
   - Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`
   - Click "Add"

7. **Redeploy** to use environment variable:
   ```bash
   vercel --prod
   ```

#### Method 2: Vercel Dashboard

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/qr-convention-app.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variable**:
   - Before deploying, click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`
   - Select all environments (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

### Step 3: Verify Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Test login/register
3. Grant camera permissions (HTTPS required)
4. Test QR code scanning
5. Test AI processing

### Troubleshooting

#### 404 Errors on Routes
- ✅ Fixed by `vercel.json` configuration
- Ensure `frontend/vercel.json` exists

#### Camera Not Working
- **Issue**: Camera requires HTTPS
- **Solution**: Vercel automatically provides HTTPS ✅

#### Backend Connection Fails
- Check `VITE_API_URL` environment variable in Vercel
- Ensure backend URL is HTTPS
- Check backend CORS is configured for your Vercel domain
- Test backend API directly: `https://your-backend-url.railway.app/api/health`

#### Build Fails
- Check build logs in Vercel dashboard
- Ensure `package.json` has correct dependencies
- Try building locally first: `npm run build`

#### Environment Variables Not Working
- Vercel requires `VITE_` prefix for client-side variables
- Redeploy after adding environment variables
- Clear build cache: Settings → General → Clear Cache and Redeploy

### Update Backend CORS for Production

If you get CORS errors, update `backend/app.py`:

```python
# Instead of:
CORS(app)

# Use:
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "https://your-app.vercel.app",  # Add your Vercel URL
            "https://*.vercel.app"  # Allow all Vercel preview URLs
        ]
    }
})
```

### Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Update backend CORS to include your custom domain

## Backend Deployment Options Comparison

| Platform | Free Tier | HTTPS | Database | Setup Difficulty |
|----------|-----------|-------|----------|------------------|
| Railway | ✅ 500 hrs/month | ✅ | Add-ons available | Easy |
| Render | ✅ | ✅ | Add-ons available | Easy |
| Heroku | ❌ (paid only) | ✅ | Add-ons available | Medium |
| DigitalOcean | ❌ | ✅ | Separate service | Hard |
| AWS/GCP | ✅ (limited) | ✅ | Separate service | Hard |

**Recommendation**: Use Railway or Render for easy, free backend hosting.

## Complete Deployment Checklist

### Backend
- [ ] Add `gunicorn` to `requirements.txt`
- [ ] Deploy to Railway/Render
- [ ] Add environment variables (GROQ_API_KEY, SECRET_KEY, JWT_SECRET_KEY)
- [ ] Test backend health: `/api/health`
- [ ] Note backend URL

### Frontend
- [ ] Create `vercel.json` configuration ✅ (already done)
- [ ] Create `.env.production` with backend URL
- [ ] Test build locally: `npm run build`
- [ ] Deploy to Vercel
- [ ] Add `VITE_API_URL` environment variable
- [ ] Test deployed app

### Post-Deployment
- [ ] Update backend CORS with Vercel URL
- [ ] Test login/register
- [ ] Test camera access
- [ ] Test QR code scanning
- [ ] Test AI processing
- [ ] Test export functionality
- [ ] Test PWA installation on mobile
- [ ] (Optional) Add custom domain

## Environment Variables Summary

### Backend (.env)
```env
GROQ_API_KEY=gsk_...
SECRET_KEY=<generated>
JWT_SECRET_KEY=<generated>
FLASK_ENV=production
PORT=5000
```

### Frontend (Vercel Environment Variables)
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

## Monitoring

### Backend
- Railway/Render dashboards show logs
- Check error logs if issues occur
- Monitor API usage in Groq console

### Frontend
- Vercel dashboard shows deployment status
- Check browser console for errors
- Use Vercel Analytics (free) for usage stats

---

Need help? Check the logs first:
- **Backend logs**: Railway/Render dashboard
- **Frontend logs**: Vercel dashboard → Deployments → View Function Logs
- **Browser logs**: Press F12 → Console tab
