import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, Bot, User, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sources?: Array<{ web?: { uri: string; title: string } }>;
  timestamp: string;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Greetings. I am your Wall Street AI Market Analyst powered by Gemini 3.6 Flash. Ask me anything regarding global equity benchmarks, crypto assets, foreign exchange rates, macroeconomic policy, or recent market movements.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: 'GLOBAL',
          name: 'Global Financial Markets',
          category: 'Market Intelligence',
          question: textToSend,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.analysis,
        sources: data.groundingSources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Error: ${err.message || 'Unable to connect to AI server.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Why is the Nasdaq 100 up today?',
    'What is the 2026 Fed interest rate outlook?',
    'Summarize current Bitcoin market sentiment',
    'Which AI semiconductor stocks are performing best?',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1A1A1A]/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] border-l border-[#1A1A1A]/15 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-[#1A1A1A]/12 flex items-center justify-between bg-[#FAFAF7]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#1A1A1A] text-[#F5F2ED]">
                <Sparkles className="w-4 h-4 text-[#C4A484]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#1A1A1A] text-sm">Gemini Market Copilot</h3>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#1A5E3A] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1A5E3A] animate-ping" />
                  Live Wall Street Data
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMessages([])}
                className="p-1.5 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#F5F2ED] rounded-lg transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#F5F2ED] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-[#F5F2ED] border-b border-[#1A1A1A]/10 overflow-x-auto hide-scrollbar flex gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-[11px] font-sans font-medium text-[#1A1A1A]/70 hover:text-[#F5F2ED] bg-[#FFFFFF] border border-[#1A1A1A]/12 hover:bg-[#1A1A1A] rounded-full px-3 py-1 whitespace-nowrap transition-all cursor-pointer shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAF7]/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-[#1A1A1A] text-[#F5F2ED] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-[#C4A484]" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-sans leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1A1A1A] text-[#F5F2ED] rounded-tr-none shadow-sm'
                      : 'bg-[#F5F2ED] border border-[#1A1A1A]/12 text-[#1A1A1A] rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#1A1A1A]/10 text-[10px] space-y-1">
                      <span className="font-bold text-[#1A1A1A]/60">Sources:</span>
                      {msg.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.web?.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[#1A1A1A] underline truncate hover:opacity-80"
                        >
                          {src.web?.title || src.web?.uri}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="text-[9px] text-right mt-1 opacity-50 font-sans">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-[#E5E0D8] text-[#1A1A1A] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs font-sans text-[#1A1A1A]/70 p-3 bg-[#F5F2ED] rounded-xl w-fit border border-[#1A1A1A]/10">
                <Loader2 className="w-4 h-4 text-[#1A1A1A] animate-spin" />
                <span>Analyzing market data...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#FAFAF7] border-t border-[#1A1A1A]/12">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask financial AI..."
                className="flex-1 bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-xl px-3.5 py-2 text-xs font-sans text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A]"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#333333] text-[#F5F2ED] rounded-xl text-xs font-sans font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
