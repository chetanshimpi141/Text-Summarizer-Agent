# Text Summarizer Frontend

A modern Next.js frontend for the AI Text Summarizer Agent that connects to the Python backend for real-time text summarization using OpenAI's API.

## Features

- 🎨 Modern, responsive UI with Tailwind CSS
- 📝 Real-time text input with word/character counting
- 🔧 Configurable summary styles (bullet points vs paragraph)
- 📏 Adjustable summary lengths (short, medium, long)
- 📋 Copy to clipboard functionality
- 💾 Download summaries as text files
- 🔗 Live API integration with Python backend
- ⚡ Fast, efficient Next.js 14 with App Router

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   npm install lucide-react
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the frontend directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Backend Integration

This frontend connects to the Python backend (`../summarizer.py`) through a Next.js API route (`/api/summarize`). The backend:

- Processes text summarization requests
- Handles different summary types and lengths
- Integrates with OpenAI's GPT API
- Provides error handling and validation

## API Endpoints

- `POST /api/summarize` - Generates summaries using the Python backend
  - Body: `{ text: string, summaryType: "bullet"|"paragraph", length: "short"|"medium"|"long" }`
  - Returns: `{ summary: string }` or `{ error: string }`

## Technologies Used

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Icons:** Lucide React
- **Backend:** Python, OpenAI API
- **API:** Next.js API Routes

## Development

- The main component is located at `src/components/TextSummarizerAgent.tsx`
- API routes are in `src/app/api/`
- Styling uses Tailwind CSS with custom configurations

## Production Deployment

For production deployment:

1. Set up your OpenAI API key in your hosting platform's environment variables
2. Build the application: `npm run build`
3. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

The application is production-ready and includes proper error handling and loading states.
