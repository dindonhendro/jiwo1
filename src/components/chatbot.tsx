'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Halo! Saya adalah asisten AI untuk kesehatan mental. Bagaimana saya bisa membantu Anda hari ini?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send to n8n webhook
      const response = await fetch('https://dindon.app.n8n.cloud/webhook/6f49e2fe-d2ff-427b-8e79-6628403ebb73', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          timestamp: userMessage.timestamp.toISOString(),
          session_id: `chatbot_${Date.now()}`,
          type: 'chatbot_message'
        })
      });

      let botResponse = 'Maaf, saya mengalami kesulitan memproses pesan Anda. Silakan coba lagi.';

      if (response.ok) {
        const data = await response.json();
        console.log('Webhook response:', data); // Debug log
        
        // Try different possible response formats from n8n
        botResponse = data.reply || 
                     data.message || 
                     data.response || 
                     data.text ||
                     data.content ||
                     data.output ||
                     (typeof data === 'string' ? data : null) ||
                     (data.data && (data.data.reply || data.data.message || data.data.response)) ||
                     JSON.stringify(data) || // Fallback to show raw response
                     'Terima kasih atas pesan Anda. Saya sedang memproses informasi ini.';
      } else {
        console.error('Webhook response error:', response.status, response.statusText);
        botResponse = 'Maaf, saya mengalami kesulitan memproses pesan Anda. Silakan coba lagi.';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Maaf, terjadi kesalahan dalam menghubungi layanan. Silakan coba lagi nanti.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 group"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
          {/* Chat Button Label */}
          <div className="absolute -left-32 top-1/2 transform -translate-y-1/2 bg-[#161413] dark:bg-white text-white dark:text-[#161413] px-3 py-2 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Chat dengan AI
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#161413] dark:bg-white rotate-45"></div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed top-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col bg-[#f7f7f7] dark:bg-[#1b1918] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#756657] text-white p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Asisten Kesehatan Mental</h3>
                  <p className="text-xs text-white/80">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f7f7f7] dark:bg-[#1b1918]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-[#756657] text-white'
                      : 'bg-white dark:bg-[#302d2a] text-[#161413] dark:text-[#eeedec] shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && (
                      <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#756657]" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' 
                          ? 'text-white/70' 
                          : 'text-[#7a736c] dark:text-[#a19991]'
                      }`}>
                        {message.timestamp.toLocaleTimeString('id-ID', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#302d2a] text-[#161413] dark:text-[#eeedec] p-3 rounded-lg max-w-[80%] shadow-sm">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#756657]" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#756657] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#756657] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#756657] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-[#756657]/20 p-4 flex-shrink-0 bg-[#f7f7f7] dark:bg-[#1b1918]">
            <div className="flex gap-2">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan Anda..."
                disabled={isLoading}
                className="flex-1 bg-white dark:bg-[#302d2a] border border-[#756657]/20 rounded-lg px-4 py-3 text-sm text-[#161413] dark:text-[#eeedec] placeholder-[#7a736c] dark:placeholder-[#a19991] focus:ring-2 focus:ring-[#756657] focus:border-[#756657] outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-[#756657] hover:bg-[#756657]/90 disabled:bg-[#756657]/50 text-white p-3 rounded-lg transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#7a736c] dark:text-[#a19991] mt-2 text-center">
              Didukung oleh AI • Untuk bantuan darurat hubungi 119
            </p>
          </div>
        </div>
      )}
    </>
  );
}