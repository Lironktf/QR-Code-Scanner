# MongoDB Atlas Setup Guide

Follow these steps to set up your **FREE** MongoDB database for Freshmen Helper.

## Step 1: Create MongoDB Atlas Account

1. **Go to:** [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. **Sign up** with Google, GitHub, or email (it's free!)
3. **Choose the FREE tier** (M0 Sandbox - 512MB storage)

## Step 2: Create a Cluster

1. After signing up, you'll see **"Create a deployment"**
2. **Select:** "M0" (FREE tier)
3. **Cloud Provider:** Choose "AWS" (or any)
4. **Region:** Choose closest to you (e.g., "N. Virginia" for US East)
5. **Cluster Name:** Leave as "Cluster0" or name it "freshmen-helper"
6. **Click:** "Create Deployment"

⏱️ Wait 1-3 minutes for cluster creation

## Step 3: Create Database User

You'll see a modal "Security Quickstart":

1. **Authentication Method:** Username and Password
2. **Username:** `freshmen_admin` (or any name)
3. **Password:** Click "Autogenerate Secure Password"
   - **COPY THIS PASSWORD!** You'll need it later
   - Or create your own strong password
4. **Click:** "Create Database User"

## Step 4: Set Up Network Access

1. **IP Address:**
   - Click "Add My Current IP Address"
   - **ALSO** click "Add IP Address" again
   - Enter: `0.0.0.0/0` (allows access from anywhere - needed for Render)
   - Description: "Allow all"
2. **Click:** "Finish and Close"

## Step 5: Get Your Connection String

1. **Click:** "Database" in left sidebar
2. **Click:** "Connect" button on your cluster
3. **Choose:** "Connect your application"
4. **Driver:** Python
5. **Version:** 3.12 or later
6. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://freshmen_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

7. **Replace `<password>`** with your actual password from Step 3
8. **Add database name** after `.net/`:
   ```
   mongodb+srv://freshmen_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/freshmen_helper?retryWrites=true&w=majority
   ```

## Step 6: Add to Your Environment Variables

### For Local Development:

Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://freshmen_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/freshmen_helper?retryWrites=true&w=majority
```

### For Render Deployment:

1. Go to your Render dashboard
2. Click on your backend service
3. Go to **"Environment"** tab
4. **Add Environment Variable:**
   - **Key:** `MONGODB_URI`
   - **Value:** `mongodb+srv://freshmen_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/freshmen_helper?retryWrites=true&w=majority`
5. **Save**

## Step 7: Test the Connection

**Local testing:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt  # Install new MongoDB dependencies
python3 app.py
```

You should see:
```
✓ Connected to MongoDB: freshmen_helper
✓ MongoDB initialized successfully
```

## Step 8: Verify in MongoDB Atlas

1. Go back to MongoDB Atlas
2. Click **"Database"** → **"Browse Collections"**
3. You should see database **"freshmen_helper"**
4. After you register a user, you'll see collections:
   - `users`
   - `events`
   - `qr_codes`

## What You Get with FREE Tier:

✅ **512 MB storage** (enough for thousands of QR codes)
✅ **Shared RAM and vCPU**
✅ **No credit card required**
✅ **Never expires**
✅ **Automatic backups** (limited)
✅ **99.9% uptime SLA**

## Troubleshooting:

### Connection Error:
- Check password has no special characters that need URL encoding
- If password has `@`, `#`, etc., URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`

### "IP not whitelisted":
- Make sure you added `0.0.0.0/0` in Network Access
- Wait 1-2 minutes for changes to take effect

### "Authentication failed":
- Double-check username and password
- Make sure you replaced `<password>` with actual password
- No extra spaces in the connection string

## Security Best Practices:

⚠️ **DO:**
- Use strong passwords
- Keep connection string in `.env` file (not in code)
- Add `.env` to `.gitignore` (already done)

⚠️ **DON'T:**
- Commit connection string to GitHub
- Share connection string publicly
- Use simple passwords

## What Changed in Your App:

### Before (In-Memory):
```python
users = {}  # Lost on restart
events_store = {}  # Lost on restart
qr_codes_store = {}  # Lost on restart
```

### After (MongoDB):
```python
UserDB.create(...)  # Saved permanently
EventDB.create(...)  # Saved permanently
QRCodeDB.create(...)  # Saved permanently
```

### Data Persistence:
- ✅ Users persist across restarts
- ✅ Events are never lost
- ✅ QR codes are permanently stored
- ✅ Works even if Render restarts

## Next Steps:

1. ✅ Create MongoDB Atlas account
2. ✅ Get connection string
3. ✅ Add to `.env` file
4. ✅ Test locally
5. ✅ Add to Render environment variables
6. ✅ Redeploy backend
7. ✅ Start using persistent storage!

---

**Need help?** MongoDB Atlas has great docs: [https://docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
