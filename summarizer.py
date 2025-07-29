import os
import openai
import sys
import json

# Set your OpenAI API key as an environment variable: OPENAI_API_KEY
client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def summarize_text(text, summary_type="bullet", length="medium", model="gpt-3.5-turbo"):
    """
    Summarize text based on type and length preferences
    
    Args:
        text (str): Input text to summarize
        summary_type (str): "bullet" or "paragraph"
        length (str): "short", "medium", or "long"
        model (str): OpenAI model to use
    """
    
    # Build dynamic prompt based on preferences
    if summary_type == "bullet":
        if length == "short":
            prompt = "Create 3-4 key bullet points from the following article:\n\n"
        elif length == "medium":
            prompt = "Create 5-7 comprehensive bullet points from the following article:\n\n"
        else:  # long
            prompt = "Create 8-10 detailed bullet points from the following article:\n\n"
    else:  # paragraph
        if length == "short":
            prompt = "Write a concise 2-3 sentence summary of the following article:\n\n"
        elif length == "medium":
            prompt = "Write a comprehensive paragraph summary of the following article:\n\n"
        else:  # long
            prompt = "Write a detailed 2-3 paragraph summary of the following article:\n\n"
    
    prompt += f"{text}\n\nSummary:"
    
    # Set max tokens based on length
    max_tokens = 150 if length == "short" else (300 if length == "medium" else 500)
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that creates clear, accurate summaries. Focus on the most important information and maintain the requested format."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            temperature=0.5,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error calling OpenAI API: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    # Check if running as API (with JSON input) or command line
    if len(sys.argv) > 1 and sys.argv[1].endswith('.txt'):
        # Command line mode - read from file
        file_path = sys.argv[1]
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                article = f.read()
            
            # Default to bullet points, medium length for command line
            summary = summarize_text(article, "bullet", "medium")
            if summary:
                print(f"Summary:\n{summary}")
            else:
                print("Error: Failed to generate summary", file=sys.stderr)
                sys.exit(1)
        except FileNotFoundError:
            print(f"Error: File {file_path} not found", file=sys.stderr)
            sys.exit(1)
    else:
        # API mode - read from stdin
        try:
            input_data = json.loads(sys.stdin.read())
            text = input_data.get('text', '')
            summary_type = input_data.get('summaryType', 'bullet')
            length = input_data.get('length', 'medium')
            
            if not text:
                print(json.dumps({"error": "No text provided"}), file=sys.stderr)
                sys.exit(1)
            
            summary = summarize_text(text, summary_type, length)
            if summary:
                print(json.dumps({"summary": summary}))
            else:
                print(json.dumps({"error": "Failed to generate summary"}), file=sys.stderr)
                sys.exit(1)
        except json.JSONDecodeError:
            print(json.dumps({"error": "Invalid JSON input"}), file=sys.stderr)
            sys.exit(1)
        except Exception as e:
            print(json.dumps({"error": str(e)}), file=sys.stderr)
            sys.exit(1) 