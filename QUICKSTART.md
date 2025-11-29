# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Python 3.8+ installed (`python3 --version`)
- [ ] Groq API key from [https://console.groq.com](https://console.groq.com)

## 5-Minute Setup

### Step 1: Backend Setup (2 minutes)

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### Step 2: Frontend Setup (2 minutes)

```bash
cd ../frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env if needed (default should work)
```

### Step 3: Run the App (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Mac/Linux or venv\Scripts\activate for Windows
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 4: Open in Browser

Go to: `http://localhost:5173`

## Your First Event

1. **Register** an account (any email/password)
2. **Click "+ New Event"**
3. **Enter event name** (e.g., "Test Event")
4. **Click the event** to open it
5. **Go to "Scan" tab** and grant camera access
6. **Scan a QR code** (or use a QR code generator online)
7. **Switch to "Gallery" tab**
8. **Click "Process with AI"** to categorize

## Testing on Mobile

### Same Network Method

1. Find your computer's local IP:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

2. Look for something like `192.168.1.100`

3. On your phone, open browser and go to:
   ```
   http://192.168.1.100:5173
   ```

4. Make sure phone and computer are on same WiFi

### Test QR Codes

Need QR codes to test? Generate free ones:
- [QR Code Generator](https://www.qr-code-generator.com/)
- [QR Code Monkey](https://www.qrcode-monkey.com/)

Create QR codes for:
- Your website URL
- Contact information (vCard)
- WiFi credentials
- Plain text

## Common Issues

### Camera not working?
- Grant camera permissions in browser
- Use Chrome or Safari (best support)
- Must use HTTPS in production

### Backend won't start?
```bash
# Make sure you're in the virtual environment
source venv/bin/activate  # or venv\Scripts\activate

# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't start?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Groq API errors?
- Check your API key in `backend/.env`
- Verify key at [https://console.groq.com](https://console.groq.com)
- Free tier has rate limits (usually sufficient for testing)

## Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Set up PWA icons (see [ICONS.md](ICONS.md))
3. Deploy to production with HTTPS for full camera support
4. Customize the UI colors in `frontend/src/index.css`

## Development Tips

### Backend Changes
- Flask auto-reloads on file changes
- Check terminal for error messages
- API docs: see README.md

### Frontend Changes
- Vite has hot module replacement (instant updates)
- Check browser console for errors
- Use React DevTools browser extension

### Database
- Currently uses in-memory storage (resets on restart)
- For production, migrate to PostgreSQL/MongoDB
- See backend/app.py comments

## Production Checklist

Before deploying:
- [ ] Create real PWA icons (192x192 and 512x512)
- [ ] Set strong SECRET_KEY and JWT_SECRET_KEY
- [ ] Use real database (not in-memory)
- [ ] Set up HTTPS (required for camera)
- [ ] Update VITE_API_URL to production backend
- [ ] Test on real mobile devices
- [ ] Set up proper error logging
- [ ] Consider rate limiting for API

---

Happy Scanning! 📱✨
