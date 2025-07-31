import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Add debugging to see what's being received
    const requestBody = await request.text();
    
    if (!requestBody) {
      return NextResponse.json(
        { error: 'No request body provided' },
        { status: 400 }
      );
    }
    
    const { text, summaryType, length } = JSON.parse(requestBody);

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Create a temporary file with the input text
    const fs = require('fs');
    const os = require('os');
    const tempFile = path.join(os.tmpdir(), `summary_input_${Date.now()}.txt`);
    
    fs.writeFileSync(tempFile, text, 'utf8');

    // Path to the Python script
    const pythonScriptPath = path.join(process.cwd(), '..', 'summarizer.py');

    // Get the Gemini API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please set GEMINI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    // Call the Python script with environment variable
    const pythonProcess = spawn('python', [pythonScriptPath, tempFile], {
      env: {
        ...process.env,
        GEMINI_API_KEY: apiKey
      }
    });

    return new Promise((resolve, reject) => {
      let summary = '';
      let error = '';

      pythonProcess.stdout.on('data', (data: Buffer) => {
        summary += data.toString();
      });

      pythonProcess.stderr.on('data', (data: Buffer) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code: number) => {
        // Clean up temp file
        try {
          fs.unlinkSync(tempFile);
        } catch (e) {
          console.error('Error deleting temp file:', e);
        }

        if (code !== 0) {
          console.error('Python script error:', error);
          resolve(NextResponse.json(
            { error: 'Failed to generate summary' },
            { status: 500 }
          ));
          return;
        }

        // Extract summary from output (remove the "Summary:" prefix)
        const cleanSummary = summary.replace(/^Summary:\s*/i, '').trim();

        resolve(NextResponse.json({ summary: cleanSummary }));
      });

      pythonProcess.on('error', (err: Error) => {
        console.error('Failed to start Python process:', err);
        resolve(NextResponse.json(
          { error: 'Failed to start summarization process' },
          { status: 500 }
        ));
      });
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}