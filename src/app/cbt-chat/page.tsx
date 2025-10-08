"use client";

import { useState, useRef, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Bot, User, Info } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface CBTStep {
  step: number;
  title: string;
  prompt_text: string;
  examples: string | null;
}

export default function CBTChatPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<CBTStep | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

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
        redirect("/sign-in");
      }
      setUser(user);

      // Load initial CBT step
      const { data: stepData } = await supabase
        .from('cbt_content')
        .select('*')
        .eq('step', 1)
        .single();

      if (stepData) {
        setCurrentStep(stepData);
        const welcomeMessage: Message = {
          id: '1',
          content: `**${stepData.title}**\n\n${stepData.prompt_text}`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
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
      // Prepare payload
      const payload = {
        user_id: user.id,
        message: messageToSend
      };

      console.log('Sending to n8n webhook (POST):', payload);

      // Send to n8n test webhook for debugging
      const response = await fetch('https://dindon.app.n8n.cloud/webhook-test/sfbt-chat', {
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
        console.log('CBT Webhook response:', data);

        // Check if webhook is async (production mode)
        const isAsyncWebhook = data.message === "Workflow was started";

        if (isAsyncWebhook) {
          // Show loading message
          const loadingMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "⏳ Memproses respons Anda...",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, loadingMessage]);

          // Store timestamp when request was sent
          const requestTimestamp = new Date().toISOString();

          // Poll for response from sessions table
          let attempts = 0;
          const maxAttempts = 15;
          const pollInterval = setInterval(async () => {
            attempts++;
            
            console.log(`[Polling ${attempts}/${maxAttempts}] Looking for message: "${messageToSend}"`);
            console.log(`[Polling ${attempts}/${maxAttempts}] Request timestamp: ${requestTimestamp}`);
            
            // Get latest session for this user created AFTER the request
            const { data: sessionList, error: sessionError } = await supabase
              .from('sessions')
              .select('*')
              .eq('user_id', user.id)
              .gte('created_at', requestTimestamp)
              .order('created_at', { ascending: false })
              .limit(1);

            const sessionData = sessionList && sessionList.length > 0 ? sessionList[0] : null;

            console.log(`[Polling ${attempts}/${maxAttempts}] Session data:`, sessionData);
            console.log(`[Polling ${attempts}/${maxAttempts}] Session error:`, sessionError);

            // Check if we got a NEW session with matching message
            if (sessionData && sessionData.step && sessionData.user_message === messageToSend) {
              console.log('✅ Match found! Step:', sessionData.step);
              clearInterval(pollInterval);
              
              // Get bot response from CBT content based on step
              const { data: stepData } = await supabase
                .from('cbt_content')
                .select('*')
                .eq('step', sessionData.step)
                .single();

              console.log('Step data:', stepData);

              const botResponse = stepData?.prompt_text || "Terima kasih atas respons Anda.";

              // Remove loading message and add real response
              setMessages(prev => {
                const filtered = prev.filter(m => !m.content.includes("Memproses"));
                return [...filtered, {
                  id: (Date.now() + 2).toString(),
                  content: botResponse,
                  sender: 'bot',
                  timestamp: new Date()
                }];
              });

              if (stepData) {
                setCurrentStep(stepData);
              }
            } else if (attempts >= maxAttempts) {
              console.error('❌ Timeout reached. No matching session found.');
              clearInterval(pollInterval);
              setMessages(prev => {
                const filtered = prev.filter(m => !m.content.includes("Memproses"));
                return [...filtered, {
                  id: (Date.now() + 2).toString(),
                  content: "⚠️ Response timeout. Silakan coba lagi atau refresh halaman.",
                  sender: 'bot',
                  timestamp: new Date()
                }];
              });
            }
          }, 1000);
        } else {
          // Handle synchronous response (test mode)
          console.log('🔍 Test mode - checking response fields:', data);
          console.log('🔍 Full response object:', JSON.stringify(data, null, 2));
          
          // Try to extract bot response from various possible fields
          const botResponse = 
            data.bot_response ||
            data.response || 
            data.reply || 
            data.text ||
            data.output ||
            data.answer ||
            data.result ||
            (typeof data.message === 'string' && data.message !== 'Workflow was started' ? data.message : null);

          console.log('✅ Bot response extracted:', botResponse);

          // If no response found, show error
          if (!botResponse) {
            console.error('❌ No valid response field found in webhook response');
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: "⚠️ Tidak ada response dari webhook. Pastikan n8n mengembalikan field: bot_response, response, reply, text, output, answer, atau result",
              sender: 'bot',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
          } else {
            // Use the response from webhook
            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: botResponse,
              sender: 'bot',
              timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);

            // Update step if provided (optional)
            const nextStep = data.next_step || data.step;
            if (nextStep && nextStep !== currentStep?.step) {
              const { data: stepData } = await supabase
                .from('cbt_content')
                .select('*')
                .eq('step', nextStep)
                .single();

              if (stepData) {
                setCurrentStep(stepData);
              }
            }
          }
        }
      } else {
        const errorText = await response.text();
        console.error('Webhook error response:', errorText);
        throw new Error(`Webhook request failed: ${response.status} - ${errorText}`);
      }

    } catch (error) {
      console.error('CBT Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Maaf, terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}. Silakan coba lagi.`,
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
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
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=cbt-therapist" />
                    <AvatarFallback>CBT</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-gray-900">CBT Therapist</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-green-600">Cognitive Behavioral Therapy</span>
                    </div>
                  </div>
                </div>
              </div>
              {currentStep && (
                <Badge variant="outline" className="text-sm">
                  Step {currentStep.step}: {currentStep.title}
                </Badge>
              )}
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
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=cbt-therapist" />
                        <AvatarFallback>CBT</AvatarFallback>
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
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
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
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=cbt-therapist" />
                    <AvatarFallback>CBT</AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Terapi CBT berbasis AI • Untuk bantuan darurat hubungi 119
            </p>
          </div>
        </div>

        {/* Sidebar - CBT Info */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="flex items-center text-lg">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Tentang CBT
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-3">
                  <strong>Cognitive Behavioral Therapy (CBT)</strong> adalah metode terapi yang membantu Anda memahami hubungan antara pikiran, perasaan, dan perilaku.
                </p>
              </div>

              {currentStep && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-blue-900 mb-2">
                    Step {currentStep.step}: {currentStep.title}
                  </h3>
                  {currentStep.examples && (
                    <div className="text-xs text-blue-800 mt-2">
                      <p className="font-medium mb-1">Contoh:</p>
                      <p className="whitespace-pre-wrap">{currentStep.examples}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-900">9 Langkah CBT:</h3>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>1. Psychoeducation</li>
                  <li>2. Mood Check-in</li>
                  <li>3. Identify Thought</li>
                  <li>4. Challenge Thought</li>
                  <li>5. Reframe</li>
                  <li>6. Behavioral Experiment</li>
                  <li>7. Track Progress</li>
                  <li>8. Relapse Prevention</li>
                  <li>9. Closing / Reflection</li>
                </ul>
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Catatan:</strong> CBT AI adalah alat bantu pembelajaran dan tidak menggantikan terapi profesional.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}