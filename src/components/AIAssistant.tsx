
import React, { useState } from 'react';
import { Send, Brain, X, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'mindmap' | 'todo';
  createdAt: Date;
  updatedAt: Date;
}

interface AIAssistantProps {
  onClose: () => void;
  activeNote: Note | null;
  onUpdateNote: (note: Note) => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose, activeNote, onUpdateNote }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant. I can help you improve your notes, generate ideas, or answer questions about your content.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useAuth();

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      if (!apiKey) {
        const errorMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          text: "Please set your OpenAI API key in the settings to use AI features.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI assistant integrated into a notes app. The user is currently ${
                activeNote ? `working on a ${activeNote.type} titled "${activeNote.title}"` : 'not viewing any specific note'
              }. Be concise and helpful.`
            },
            {
              role: 'user',
              content: activeNote 
                ? `Current note content: "${activeNote.content}"\n\nUser question: ${inputText}`
                : inputText
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      const aiMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI request failed:', error);
      const errorMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        text: "Sorry, I couldn't process your request. Please check your API key and try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Assistant
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeNote ? `Helping with: ${activeNote.title}` : 'Ready to help'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl flex items-center space-x-2">
                <Loader className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              placeholder="Ask me anything about your notes..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
