#!/usr/bin/env python3
"""
Generate secure secret keys for Flask application
Run this script to generate SECRET_KEY and JWT_SECRET_KEY
"""

import secrets

print("=" * 60)
print("Flask Secret Keys Generator")
print("=" * 60)
print()

secret_key = secrets.token_hex(32)
jwt_secret_key = secrets.token_hex(32)

print("Copy these values to your backend/.env file:")
print()
print(f"SECRET_KEY={secret_key}")
print(f"JWT_SECRET_KEY={jwt_secret_key}")
print()
print("=" * 60)
print("Your .env file should look like this:")
print("=" * 60)
print()
print(f"# Groq API Configuration")
print(f"GROQ_API_KEY=your_groq_api_key_here")
print()
print(f"# Flask Configuration")
print(f"SECRET_KEY={secret_key}")
print(f"JWT_SECRET_KEY={jwt_secret_key}")
print()
print(f"# Server Configuration")
print(f"FLASK_ENV=development")
print(f"PORT=5000")
print()
print("Note: Replace 'your_groq_api_key_here' with your actual Groq API key")
print()
