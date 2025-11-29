#!/usr/bin/env python3
"""Quick startup test"""
import os
from dotenv import load_dotenv

load_dotenv()

print("Testing environment configuration...")
print()

# Check Groq API key
api_key = os.getenv('GROQ_API_KEY')
if api_key:
    print(f"✓ GROQ_API_KEY is set (starts with: {api_key[:10]}...)")
else:
    print("✗ GROQ_API_KEY not found!")

# Check Flask keys
secret_key = os.getenv('SECRET_KEY')
if secret_key and secret_key != 'your_secret_key_here':
    print("✓ SECRET_KEY is set")
else:
    print("✗ SECRET_KEY not properly configured")

jwt_key = os.getenv('JWT_SECRET_KEY')
if jwt_key and jwt_key != 'your_jwt_secret_key_here':
    print("✓ JWT_SECRET_KEY is set")
else:
    print("✗ JWT_SECRET_KEY not properly configured")

print()
print("Testing Groq service initialization...")

try:
    from services.groq_service import GroqService
    groq_service = GroqService()
    print("✓ Groq service initialized successfully!")
    print()
    print("All checks passed! You can now run: python3 app.py")
except Exception as e:
    print(f"✗ Error: {e}")
    print()
    print("Please check your .env file configuration")
