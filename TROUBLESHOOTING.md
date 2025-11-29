# Troubleshooting Guide

## Authentication Failed Error

If you're getting "Authentication failed" when trying to register or login, follow these steps:

### Step 1: Check Browser Console

1. Open your browser's Developer Tools (Press F12 or right-click → Inspect)
2. Go to the **Console** tab
3. Try to register/login again
4. Look for errors

**Common errors you might see:**

#### Error 1: Network Request Failed
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```
**Cause:** Frontend can't reach backend
**Solution:** Check Step 2

#### Error 2: CORS Error
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```
**Cause:** Backend CORS not configured for your Vercel domain
**Solution:** Check Step 3

#### Error 3: 404 Not Found
```
GET https://your-backend.onrender.com/api/auth/login 404
```
**Cause:** Backend URL incorrect or backend not deployed
**Solution:** Check Step 2

### Step 2: Verify Backend is Running

Test your backend directly:

1. **Find your backend URL** (from Render dashboard)
   - Example: `https://qr-scanner-backend.onrender.com`

2. **Test health endpoint** in browser:
   ```
   https://your-backend-url.onrender.com/api/health
   ```

   ✅ **Success:** Should show `{"status":"healthy"}`
   ❌ **Fail:** Shows error or nothing

3. **If backend is not responding:**
   - Go to Render dashboard
   - Check if service is "Live" (green)
   - Check Logs tab for errors
   - Free tier services sleep after 15min - first request takes 30-60 seconds

### Step 3: Verify Frontend Configuration

#### On Vercel:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Check `VITE_API_URL` is set correctly:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   ⚠️ **Must include `/api` at the end!**

4. If you changed it:
   - Go to Deployments tab
   - Click three dots on latest deployment → Redeploy

#### On Local Development:

Check `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Test Backend Endpoints Manually

Use your browser or a tool like curl/Postman:

**Test Registration:**
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

✅ **Expected response:**
```json
{
  "token": "eyJ...",
  "email": "test@example.com"
}
```

❌ **Error responses:**

**500 Internal Server Error:**
- Check Render logs
- Check environment variables are set (GROQ_API_KEY, SECRET_KEY, JWT_SECRET_KEY)

**CORS error:**
- Update backend CORS configuration

### Step 5: Check Network Tab

In browser Developer Tools:

1. Go to **Network** tab
2. Try to register/login
3. Look for the request to `/api/auth/login` or `/api/auth/register`
4. Click on it to see details:
   - **Request URL:** Should be your backend URL
   - **Status Code:** Should be 200 or 201 for success
   - **Response:** Shows what backend returned

### Common Issues & Solutions

#### Issue: "Failed to fetch" error

**Possible causes:**
1. Backend is sleeping (Render free tier)
   - **Solution:** Wait 30-60 seconds and try again
2. Backend URL is wrong
   - **Solution:** Check Vercel environment variable
3. Backend is not deployed
   - **Solution:** Deploy backend to Render

#### Issue: CORS errors

**Solution:** Update `backend/app.py` to include your Vercel domain:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "https://*.vercel.app",
            "https://your-actual-domain.vercel.app"  # Add your specific domain
        ]
    }
})
```

Then redeploy backend to Render.

#### Issue: Backend returns 500 error

**Check Render logs:**
1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for Python errors

**Common causes:**
- Missing environment variables
- Groq API key invalid
- Python error in code

#### Issue: Working locally but not on Vercel

**Checklist:**
- [ ] Backend deployed and live on Render
- [ ] `VITE_API_URL` set in Vercel environment variables
- [ ] Environment variable includes `/api` at the end
- [ ] Redeployed Vercel after setting variable
- [ ] Backend CORS allows Vercel domain

### Step 6: Complete Debugging Checklist

Run through this checklist:

**Backend (Render):**
- [ ] Service shows "Live" status (green)
- [ ] Health endpoint works: `https://backend-url/api/health`
- [ ] Environment variables are set:
  - [ ] GROQ_API_KEY
  - [ ] SECRET_KEY
  - [ ] JWT_SECRET_KEY
- [ ] No errors in Render logs

**Frontend (Vercel):**
- [ ] Deployment succeeded (green checkmark)
- [ ] Environment variable `VITE_API_URL` is set
- [ ] Variable value ends with `/api`
- [ ] Variable value matches Render backend URL
- [ ] Redeployed after setting variable

**Browser:**
- [ ] No CORS errors in console
- [ ] Network tab shows requests going to correct backend URL
- [ ] Requests return 200/201 status codes

### Quick Fix Commands

If all else fails, try these:

**Redeploy Backend (Render):**
1. Go to Render dashboard
2. Your service → Manual Deploy → Clear build cache & deploy

**Redeploy Frontend (Vercel):**
1. Go to Vercel dashboard
2. Deployments → Three dots → Redeploy

**Check Environment Variables:**
```bash
# In Vercel deployment logs, you should see:
Building with:
  VITE_API_URL=https://your-backend.onrender.com/api
```

### Still Not Working?

If you've tried everything above:

1. **Test with curl/Postman:**
   - Confirm backend works independently
   - Isolates issue to frontend or backend

2. **Check Render free tier limits:**
   - Free tier has usage limits
   - Service might be paused

3. **Try a different browser:**
   - Sometimes browser extensions block requests

4. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

5. **Check backend/frontend versions:**
   - Make sure both are deployed from latest Git commit
   - Verify `gunicorn` is in requirements.txt

### Get Detailed Errors

Add this to your browser console to see detailed error:

```javascript
// In browser console on your Vercel site
localStorage.setItem('debug', 'true');

// Then check console when you try to login/register
// You'll see detailed fetch errors
```

### Contact Info in Errors

If you need to share errors for help:
1. Screenshot of browser console
2. Screenshot of Network tab showing the failed request
3. Render logs (from Logs tab)
4. Your Vercel deployment URL
5. Your Render backend URL

---

**Pro Tip:** The most common issue is forgetting to add `/api` at the end of `VITE_API_URL`!

**Example:**
- ❌ Wrong: `VITE_API_URL=https://backend.onrender.com`
- ✅ Correct: `VITE_API_URL=https://backend.onrender.com/api`
