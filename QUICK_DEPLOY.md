# Quick Deploy Checklist

Use this as a quick reference while deploying.

## Backend (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Select repository
4. Settings:
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn app:app`
   - Environment Variables (get these from your backend/.env file):
     ```
     GROQ_API_KEY=your_groq_api_key_from_dotenv_file
     SECRET_KEY=your_secret_key_from_dotenv_file
     JWT_SECRET_KEY=your_jwt_secret_key_from_dotenv_file
     ```
5. Deploy!
6. Test: `https://YOUR-SERVICE.onrender.com/api/health`

## Frontend (Vercel)

1. Update `frontend/.env.production`:
   ```
   VITE_API_URL=https://YOUR-SERVICE.onrender.com/api
   ```
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Settings:
   - Root Directory: `frontend`
   - Framework: Vite
   - Environment Variable:
     ```
     VITE_API_URL=https://YOUR-SERVICE.onrender.com/api
     ```
4. Deploy!
5. Test: Open your Vercel URL

## Files Already Created ✅

- ✅ `backend/requirements.txt` (includes gunicorn)
- ✅ `frontend/vercel.json` (fixes 404 routing)
- ✅ `backend/app.py` (CORS configured for Vercel)
- ✅ `.gitignore` (protects sensitive files)

## Ready to Deploy!

See **RENDER_DEPLOYMENT.md** for detailed step-by-step guide.
