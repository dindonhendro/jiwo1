"use client";

import { useState, useRef, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function SFBTChatPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
      } else {
        setUser(user);
        const welcomeMessage: Message = {
          id: '1',
          content: 'Selamat datang di SFBT (Solution-Focused Brief Therapy) Chat! Saya di sini untuk membantu Anda fokus pada solusi dan kekuatan yang Anda miliki. Mari kita mulai dengan berbicara tentang apa yang ingin Anda capai.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
      setLoading(false);
    };
    initChat();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const payload = {
        user_id: user.id,
        message: messageToSend
      };

      console.log('Sending to n8n SFBT webhook (POST):', payload);

      const response = await fetch('https://dindon.app.n8n.cloud/webhook/sfbt-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('SFBT Webhook response:', data);

        const botResponse = 
          data.bot_response ||
          data.response || 
          data.reply || 
          data.text ||
          data.output ||
          data.answer ||
          data.result ||
          data.advice ||
          "Terima kasih atas respons Anda. Mari kita lanjutkan eksplorasi solusi yang dapat membantu Anda.";

        console.log('✅ Bot response extracted:', botResponse);

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);

      } else {
        // Fallback response when webhook fails
        console.warn('Webhook failed, using fallback response');
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Terima kasih telah berbagi. Dalam SFBT, kita fokus pada solusi dan kekuatan yang Anda miliki. Bisakah Anda ceritakan lebih lanjut tentang apa yang ingin Anda capai?",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }

    } catch (error) {
      console.error('SFBT Chat error:', error);
      // Fallback response on error
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Saya mendengarkan Anda. Mari kita fokus pada solusi - apa yang sudah pernah berhasil untuk Anda di masa lalu?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
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

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=sfbt-therapist" />
                  <AvatarFallback>SFBT</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">SFBT Therapist</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm text-purple-600">Solution-Focused Brief Therapy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {message.sender === 'bot' ? (
                    <>
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=sfbt-therapist" />
                      <AvatarFallback>SFBT</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} />
                      <AvatarFallback>U</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className={`rounded-lg p-4 shadow-sm ${
                  message.sender === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('id-ID', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-2xl">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=sfbt-therapist" />
                  <AvatarFallback>SFBT</AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik respons Anda..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Terapi SFBT berbasis AI • Untuk bantuan darurat hubungi 119
          </p>
        </div>
      </div>
    </div>
  );
}