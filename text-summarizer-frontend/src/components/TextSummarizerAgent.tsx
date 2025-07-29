'use client';

import React, { useState } from 'react';
import { FileText, Zap, Copy, Download, AlertCircle } from 'lucide-react';

const TextSummarizerAgent = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryType, setSummaryType] = useState('bullet');
  const [length, setLength] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Sample text for demo
  const sampleText = `Artificial Intelligence (AI) has emerged as one of the most transformative technologies of the 21st century, revolutionizing industries from healthcare to finance, transportation to entertainment. At its core, AI refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. The field encompasses various subdomains including machine learning, natural language processing, computer vision, and robotics.

Machine learning, a subset of AI, enables computers to learn and improve from experience without being explicitly programmed for every task. This technology powers recommendation systems on platforms like Netflix and Amazon, fraud detection in banking, and predictive maintenance in manufacturing. Deep learning, a more advanced form of machine learning inspired by the human brain's neural networks, has achieved remarkable breakthroughs in image recognition, speech processing, and game playing.

The healthcare industry has witnessed significant AI adoption, with applications ranging from medical imaging analysis to drug discovery. AI algorithms can now detect diseases like cancer in medical scans with accuracy matching or exceeding human specialists. In drug development, AI accelerates the identification of potential therapeutic compounds, potentially reducing the time and cost of bringing new medicines to market.

Transportation is being revolutionized by autonomous vehicles, which rely heavily on AI technologies including computer vision, sensor fusion, and decision-making algorithms. Companies like Tesla, Google's Waymo, and traditional automakers are racing to develop fully self-driving cars that could dramatically reduce traffic accidents and improve mobility for disabled individuals.

However, AI development also raises important ethical considerations including job displacement, privacy concerns, algorithmic bias, and the need for transparency in AI decision-making. As AI systems become more sophisticated and integrated into society, ensuring they are developed and deployed responsibly becomes increasingly critical.

The future of AI promises even more exciting developments, with researchers working on artificial general intelligence (AGI) - AI systems that could match or exceed human cognitive abilities across all domains. While this remains a long-term goal, the rapid pace of current AI advancement suggests we are living through a pivotal moment in technological history.`;

  const handleTextChange = (text: string) => {
    setInputText(text);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const generateSummary = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    
    try {
      const requestBody = {
        text: inputText,
        summaryType: summaryType,
        length: length,
      };
      
      console.log('Sending request body:', requestBody);
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setSummary(data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Error: Failed to generate summary. Please check your OpenAI API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
  };

  const downloadSummary = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'summary.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadSample = () => {
    setInputText(sampleText);
    handleTextChange(sampleText);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <FileText className="w-12 h-12 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-800">AI Text Summarizer</h1>
        </div>
        <p className="text-lg text-gray-600">Agent #1 - Transform long articles into concise, actionable summaries</p>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mt-4 inline-block">
          <p className="text-blue-800 font-medium">🎯 Skills: API Integration • Prompt Engineering • Text Processing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Input Text</h2>
            <button
              onClick={loadSample}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Load Sample
            </button>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Paste your article or long text here..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          
          <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
            <span>Words: {wordCount}</span>
            <span>Characters: {inputText.length}</span>
          </div>

          {/* Configuration */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Summary Style</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="bullet"
                    checked={summaryType === 'bullet'}
                    onChange={(e) => setSummaryType(e.target.value)}
                    className="mr-2"
                  />
                  <span>Bullet Points</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="paragraph"
                    checked={summaryType === 'paragraph'}
                    onChange={(e) => setSummaryType(e.target.value)}
                    className="mr-2"
                  />
                  <span>Paragraph</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Summary Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="short">Short (Quick overview)</option>
                <option value="medium">Medium (Balanced detail)</option>
                <option value="long">Long (Comprehensive)</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateSummary}
            disabled={!inputText.trim() || isLoading}
            className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate Summary
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">AI Summary</h2>
            {summary && (
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={downloadSummary}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  title="Download summary"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          {summary ? (
            <div className="bg-gray-50 p-4 rounded-lg min-h-64">
              <div className="prose prose-sm max-w-none">
                {summaryType === 'bullet' ? (
                  <div className="space-y-2">
                    {summary.split('\n').map((line, index) => (
                      line.trim() && (
                        <div key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span className="text-gray-700">{line.replace('•', '').trim()}</span>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg min-h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Your AI-generated summary will appear here</p>
                <p className="text-sm mt-2">Enter text and click "Generate Summary" to begin</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technical Details */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🛠️ Technical Implementation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">API Integration</h4>
            <p className="text-sm text-blue-700">OpenAI GPT API calls with proper error handling and rate limiting</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Prompt Engineering</h4>
            <p className="text-sm text-green-700">Dynamic prompts based on user preferences for optimal results</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Text Processing</h4>
            <p className="text-sm text-purple-700">Input validation, word counting, and output formatting</p>
          </div>
        </div>
      </div>

      {/* API Integration Notice */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-green-800 font-medium">Live API Integration</h4>
            <p className="text-green-700 text-sm mt-1">
              This application is now connected to OpenAI's API for real-time text summarization. 
              Make sure your OPENAI_API_KEY environment variable is set to use this feature!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSummarizerAgent; 