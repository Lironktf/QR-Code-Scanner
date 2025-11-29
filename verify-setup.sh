#!/bin/bash

# QR Convention Scanner - Setup Verification Script
# This script checks if your environment is properly configured

echo "🔍 Verifying QR Convention Scanner Setup..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 18+"
fi

# Check Python
echo ""
echo "🐍 Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Python installed: $PYTHON_VERSION"
else
    echo -e "${RED}✗${NC} Python3 not found. Please install Python 3.8+"
fi

# Check backend structure
echo ""
echo "📁 Checking backend files..."
if [ -f "backend/app.py" ]; then
    echo -e "${GREEN}✓${NC} backend/app.py exists"
else
    echo -e "${RED}✗${NC} backend/app.py not found"
fi

if [ -f "backend/requirements.txt" ]; then
    echo -e "${GREEN}✓${NC} backend/requirements.txt exists"
else
    echo -e "${RED}✗${NC} backend/requirements.txt not found"
fi

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} backend/.env exists"

    # Check for Groq API key
    if grep -q "GROQ_API_KEY=your_groq_api_key_here" backend/.env; then
        echo -e "${YELLOW}⚠${NC}  Groq API key not set in backend/.env"
    elif grep -q "GROQ_API_KEY=" backend/.env; then
        echo -e "${GREEN}✓${NC} Groq API key appears to be set"
    else
        echo -e "${YELLOW}⚠${NC}  GROQ_API_KEY not found in backend/.env"
    fi
else
    echo -e "${YELLOW}⚠${NC}  backend/.env not found (run: cp backend/.env.example backend/.env)"
fi

# Check if virtual environment exists
if [ -d "backend/venv" ]; then
    echo -e "${GREEN}✓${NC} Python virtual environment exists"
else
    echo -e "${YELLOW}⚠${NC}  Python virtual environment not found (run: cd backend && python3 -m venv venv)"
fi

# Check frontend structure
echo ""
echo "📁 Checking frontend files..."
if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}✓${NC} frontend/package.json exists"
else
    echo -e "${RED}✗${NC} frontend/package.json not found"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Node modules installed"
else
    echo -e "${YELLOW}⚠${NC}  Node modules not installed (run: cd frontend && npm install)"
fi

if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓${NC} frontend/.env exists"
else
    echo -e "${YELLOW}⚠${NC}  frontend/.env not found (run: cp frontend/.env.example frontend/.env)"
fi

# Check PWA files
echo ""
echo "📱 Checking PWA files..."
if [ -f "frontend/public/manifest.json" ]; then
    echo -e "${GREEN}✓${NC} manifest.json exists"
else
    echo -e "${RED}✗${NC} manifest.json not found"
fi

if [ -f "frontend/public/sw.js" ]; then
    echo -e "${GREEN}✓${NC} service worker exists"
else
    echo -e "${RED}✗${NC} service worker not found"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Setup Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. If missing, get Groq API key: https://console.groq.com"
echo "2. Add key to backend/.env"
echo "3. Install backend dependencies: cd backend && pip install -r requirements.txt"
echo "4. Install frontend dependencies: cd frontend && npm install"
echo "5. Run backend: cd backend && python app.py"
echo "6. Run frontend: cd frontend && npm run dev"
echo ""
echo "See QUICKSTART.md for detailed instructions"
echo ""
