import os
import sys
import json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai

# Load environment variables from .env if present
load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("GEMINI_API_KEY is not set. Please check your .env file.")

genai.configure(api_key=api_key)

app = FastAPI()

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummarizeRequest(BaseModel):
    text: str
    summaryType: str = "bullet"
    length: str = "medium"

class SummarizeResponse(BaseModel):
    summary: str 

@app.post("/summarize", response_model=SummarizeResponse)
def summarize_api(req: SummarizeRequest):
    summary = summarize_text(req.text, req.summaryType, req.length)
    if not summary:
        raise HTTPException(status_code=500, detail="Failed to generate summary")
    return {"summary": summary}

def summarize_text(text, summary_type="bullet", length="medium", model="gemini-1.5-flash"):
    """
    Summarize text based on type and length preferences using Gemini API
    """
    # Build dynamic prompt based on preferences
    if summary_type == "bullet":
        if length == "short":
            prompt = "Create 3-4 key bullet points using dashes (-) from the following article:\n\n"
        elif length == "medium":
            prompt = "Create 5-7 comprehensive bullet points using dashes (-) from the following article:\n\n"
        else:  # long
            prompt = "Create 8-10 detailed bullet points using dashes (-) from the following article:\n\n"
    else:  # paragraph
        if length == "short":
            prompt = "Write a concise 2-3 sentence summary of the following article:\n\n"
        elif length == "medium":
            prompt = "Write a comprehensive paragraph summary of the following article:\n\n"
        else:  # long
            prompt = "Write a detailed 2-3 paragraph summary of the following article:\n\n"
    prompt += f"{text}\n\nSummary:"

    try:
        model = genai.GenerativeModel(model)
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini API: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1].endswith('.txt'):
        file_path = sys.argv[1]
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                article = f.read()
            summary = summarize_text(article, "bullet", "medium")
            if summary:
                print(f"Summary:\n{summary}")
            else:
                print("Error: Failed to generate summary", file=sys.stderr)
                sys.exit(1)
        except FileNotFoundError:
            print(f"Error: File {file_path} not found", file=sys.stderr)
            sys.exit(1)