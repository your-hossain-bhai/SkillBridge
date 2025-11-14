import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Card from './Card';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CareerBot = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hello! I'm CareerBot, your career mentor. How can I help you today? Try asking: 'Which roles fit my skills?' or 'What should I learn next?'"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/careerbot/chat`,
        { message: userMessage },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessages(prev => [...prev, { role: 'bot', content: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">CareerBot Assistant</h3>
      
      {/* Messages */}
      <div className="h-96 overflow-y-auto mb-4 space-y-3 p-2 bg-gray-50 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about your career..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </form>

      {/* Quick Suggestions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setInput('Which roles fit my skills?')}
          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          Which roles fit my skills?
        </button>
        <button
          onClick={() => setInput('What should I learn next?')}
          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          What should I learn next?
        </button>
        <button
          onClick={() => setInput('Create a roadmap')}
          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          Create a roadmap
        </button>
      </div>
    </Card>
  );
};

export default CareerBot;

