import os
from groq import Groq

class GroqService:
    """Service for interacting with Groq API"""

    def __init__(self):
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.1-8b-instant"  # Fast and free model

    def categorize_and_summarize(self, qr_content: str) -> dict:
        """
        Categorize and summarize QR code content using Groq AI

        Args:
            qr_content: The content extracted from the QR code

        Returns:
            dict: Contains 'category' and 'summary' keys
        """
        prompt = f"""Analyze the following QR code content and provide:
1. A category (choose from: Business Contact, Product Info, Website, Social Media, Event Info, Payment, WiFi, Location, Document, Other)
2. A brief 1-2 sentence summary

QR Code Content: {qr_content}

Respond in this exact format:
Category: [category here]
Summary: [summary here]"""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that categorizes and summarizes QR code content concisely and accurately."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.3,
                max_tokens=150
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
