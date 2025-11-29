import os
import re
import requests
from bs4 import BeautifulSoup
from groq import Groq

class GroqService:
    """Service for interacting with Groq API"""

    def __init__(self):
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.1-8b-instant"  # Fast and free model

    def is_url(self, text):
        """Check if text is a URL"""
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        return url_pattern.match(text) is not None

    def fetch_url_content(self, url):
        """Fetch and extract text content from URL"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()

            # Get text
            text = soup.get_text()

            # Clean up text
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)

            # Limit to first 2000 characters to avoid token limits
            return text[:2000] if text else None

        except Exception as e:
            print(f"Error fetching URL {url}: {str(e)}")
            return None

    def categorize_and_summarize(self, qr_content: str) -> dict:
        """
        Categorize and summarize QR code content using Groq AI
        If content is a URL, fetches and analyzes the actual page content

        Args:
            qr_content: The content extracted from the QR code

        Returns:
            dict: Contains 'category' and 'summary' keys
        """
        # Check if QR content is a URL and fetch its content
        additional_context = ""
        if self.is_url(qr_content):
            print(f"Detected URL: {qr_content}, fetching content...")
            url_content = self.fetch_url_content(qr_content)
            if url_content:
                additional_context = f"\n\nWebpage Content:\n{url_content}"
                print(f"Successfully fetched {len(url_content)} characters from URL")
            else:
                additional_context = "\n\n(Unable to fetch webpage content)"

        prompt = f"""Analyze the following QR code content and provide:
1. A category (choose from: Business Contact, Product Info, Website, Social Media, Event Info, Payment, WiFi, Location, Document, Other)
2. A brief 1-2 sentence summary that describes what this is about

QR Code Content: {qr_content}{additional_context}

Respond in this exact format:
Category: [category here]
Summary: [summary here]"""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that categorizes and summarizes QR code content concisely and accurately. When analyzing URLs, focus on the actual webpage content to provide meaningful summaries."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.3,
                max_tokens=200
            )

            response_text = chat_completion.choices[0].message.content.strip()

            # Parse the response
            category = "Other"
            summary = "No summary available"

            lines = response_text.split('\n')
            for line in lines:
                if line.startswith('Category:'):
                    category = line.replace('Category:', '').strip()
                elif line.startswith('Summary:'):
                    summary = line.replace('Summary:', '').strip()

            return {
                'category': category,
                'summary': summary
            }

        except Exception as e:
            print(f"Error calling Groq API: {str(e)}")
            # Return fallback values
            return {
                'category': 'Unknown',
                'summary': f'Content: {qr_content[:100]}...' if len(qr_content) > 100 else qr_content
            }
