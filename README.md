# Freshmen Helper

A mobile-optimized Progressive Web App for scanning and organizing QR codes at conventions with AI-powered categorization and summarization using Groq.

## Features

- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **QR Code Scanning**: Real-time QR code detection using device camera
- **AI-Powered Organization**: Automatic categorization and summarization using Groq AI (100% FREE)
- **Offline-First**: Works offline with IndexedDB storage and syncs when online
- **PWA Support**: Install on home screen for app-like experience
- **Event Management**: Organize scans by events/conventions
- **Export Functionality**: Export scanned codes as CSV or JSON
- **Duplicate Detection**: Prevents scanning the same QR code twice

## Technology Stack

### Frontend
- React 19 with Vite
- React Router for navigation
- html5-qrcode for QR scanning
- IndexedDB (via idb) for offline storage
- Axios for API calls
- PWA with Service Workers

### Backend
- Flask (Python)
- Flask-JWT-Extended for authentication
- Flask-CORS for cross-origin requests
- Groq API for AI categorization (FREE)

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Groq API key (free from [Groq Console](https://console.groq.com))

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
cd qr-convention-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `backend/.env` and add your configuration:

```env
# Get your free API key from https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# Generate secure keys (you can use: python -c "import secrets; print(secrets.token_hex(32))")
SECRET_KEY=your_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here

FLASK_ENV=development
PORT=5000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the Application

#### Start Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

Backend will run on `http://localhost:5000`

#### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to `http://localhost:5173`

For mobile testing:
1. Find your local IP address (e.g., `192.168.1.100`)
2. Access `http://192.168.1.100:5173` from your mobile device
3. Make sure both devices are on the same network

## Usage Guide

### First Time Setup

1. **Register**: Create an account with email and password
2. **Login**: Sign in with your credentials

### Creating an Event

1. Click "+ New Event" on the dashboard
2. Enter event name (e.g., "Tech Conference 2024")
3. Click "Create"

### Scanning QR Codes

1. Open an event
2. Go to "Scan" tab
3. Grant camera permissions when prompted
4. Point camera at QR codes
5. Codes are automatically detected and saved
6. Duplicate prevention: same codes won't be saved twice

### Processing with AI

1. Switch to "Gallery" tab
2. Click "Process X QR Codes with AI"
3. Wait for Groq AI to categorize and summarize
4. View organized results with categories and summaries

### Exporting Data

1. Go to "Gallery" tab in an event
2. Click "Export JSON" or "Export CSV"
3. File downloads automatically

## PWA Installation

### On Mobile (iOS/Android)

1. Open the app in your mobile browser
2. iOS Safari: Tap Share → Add to Home Screen
3. Android Chrome: Tap Menu → Install App or Add to Home Screen

### On Desktop

1. Open the app in Chrome
2. Click the install icon in the address bar
3. Or go to Menu → Install Freshmen Helper

## Camera Permissions

The app requires camera access to scan QR codes:

- **iOS Safari**: Grant camera permission when prompted
- **Android Chrome**: Grant camera permission when prompted
- **Desktop**: Select camera from browser prompt

If camera doesn't work:
1. Check browser permissions in settings
2. Ensure you're using HTTPS in production
3. Try a different browser

## Offline Functionality

The app works offline thanks to:
- **IndexedDB**: Stores events and QR codes locally
- **Service Worker**: Caches app resources
- **Sync Queue**: Saves pending operations for when online

When back online, the app automatically syncs data.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/:id/export?format=json|csv` - Export event data

### QR Codes
- `GET /api/events/:id/qrcodes` - Get all QR codes for event
- `POST /api/events/:id/qrcodes` - Add new QR code
- `POST /api/events/:id/qrcodes/process` - Process with Groq AI

## File Structure

```
qr-convention-app/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── services/
│   │   └── groq_service.py    # Groq AI integration
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment template
│
└── frontend/
    ├── src/
    │   ├── components/       # React components
    │   │   ├── QRScanner.jsx
    │   │   └── QRGallery.jsx
    │   ├── pages/           # Page components
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Event.jsx
    │   ├── hooks/           # Custom React hooks
    │   │   └── useAuth.js
    │   ├── utils/           # Utilities
    │   │   ├── api.js       # API client
    │   │   ├── db.js        # IndexedDB operations
    │   │   └── toast.js     # Toast notifications
    │   ├── App.jsx          # Main app component
    │   ├── main.jsx         # Entry point
    │   └── index.css        # Global styles
    ├── public/
    │   ├── manifest.json    # PWA manifest
    │   └── sw.js           # Service worker
    └── package.json
```

## Troubleshooting

### Camera Not Working

- **Issue**: Camera doesn't start
- **Solution**:
  - Ensure HTTPS in production (required for camera access)
  - Check browser permissions
  - Try different browser (Chrome/Safari recommended)

### Groq API Errors

- **Issue**: AI processing fails
- **Solution**:
  - Verify `GROQ_API_KEY` in backend/.env
  - Check API key is valid at [Groq Console](https://console.groq.com)
  - Ensure internet connection for API calls

### CORS Errors

- **Issue**: Frontend can't connect to backend
- **Solution**:
  - Verify backend is running on port 5000
  - Check `VITE_API_URL` in frontend/.env
  - Ensure Flask-CORS is installed

### QR Codes Not Saving

- **Issue**: Scanned codes disappear
- **Solution**:
  - Check backend logs for errors
  - Verify authentication token is valid
  - Check IndexedDB in browser dev tools

## Production Deployment

### Backend Deployment (Example: Heroku/Railway)

1. Set environment variables
2. Use production WSGI server (gunicorn)
3. Add to requirements.txt: `gunicorn==21.2.0`
4. Create Procfile: `web: gunicorn app:app`

### Frontend Deployment (Example: Vercel/Netlify)

1. Build the app: `npm run build`
2. Set environment variable: `VITE_API_URL=https://your-backend.com/api`
3. Deploy `dist` folder
4. Configure HTTPS for camera access

### Important for Production

- Use HTTPS everywhere (required for camera and PWA)
- Set strong SECRET_KEY and JWT_SECRET_KEY
- Consider using a real database (PostgreSQL, MongoDB) instead of in-memory storage
- Implement rate limiting
- Add proper error logging
- Create actual PWA icons (192x192 and 512x512 PNG)

## Getting Groq API Key (FREE)

1. Go to [Groq Console](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `backend/.env` file

Groq offers FREE access to fast LLM models like Llama 3.1, making it perfect for this app!

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review browser console for errors
3. Check backend terminal for error logs

## Future Enhancements

- [ ] User profile management
- [ ] Share events with other users
- [ ] Advanced filtering and search
- [ ] QR code statistics and analytics
- [ ] Batch QR code generation
- [ ] Custom AI prompts for categorization
- [ ] Dark mode support
- [ ] Multi-language support

---

Built with React, Flask, and Groq AI
