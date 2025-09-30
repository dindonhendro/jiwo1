"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, User, UserCheck, Clock, CheckCircle2 } from "lucide-react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import { detectCrisisKeywords, triggerCrisisWebhook } from "@/utils/crisis-detection";
import { AlertTriangle } from "lucide-react";

interface ChatMessage {
  id: string;
  user_id: string;
  professional_id: string;
  message: string;
  sender: 'user' | 'professional';
  created_at: string;
}

interface Professional {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  status: 'online' | 'offline';
}

// Mock professional data - in real app this would come from database
const mockProfessionals: Professional[] = [
  {
    id: "prof-1",
    name: "Dr. Sarah Johnson",
    specialty: "Clinical Psychologist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    status: "online"
  },
  {
    id: "prof-2", 
    name: "Dr. Michael Chen",
    specialty: "Psychiatrist",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    status: "offline"
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      setCurrentUser(user);
      setSelectedProfessional(mockProfessionals[0]); // Auto-select first professional
      
      await loadMessages(user.id, mockProfessionals[0].id);
      setupRealtimeSubscription(user.id, mockProfessionals[0].id);
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (userId: string, professionalId: string) => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`and(user_id.eq.${userId},professional_id.eq.${professionalId}),and(user_id.eq.${professionalId},professional_id.eq.${userId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const setupRealtimeSubscription = (userId: string, professionalId: string) => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `or(and(user_id.eq.${userId},professional_id.eq.${professionalId}),and(user_id.eq.${professionalId},professional_id.eq.${userId}))`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProfessional || !currentUser) return;

    setIsSending(true);
    
    try {
      // Check for crisis keywords
      const isCrisis = detectCrisisKeywords(newMessage.trim());
      
      const { error } = await supabase
        .from('chats')
        .insert({
          user_id: currentUser.id,
          professional_id: selectedProfessional.id,
          message: newMessage.trim(),
          sender: 'user'
        });

      if (error) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
      }

      // Trigger crisis webhook if needed
      if (isCrisis) {
        await triggerCrisisWebhook(currentUser.id, newMessage.trim(), 'chat');
        setShowCrisisAlert(true);
        
        // Hide alert after 10 seconds
        setTimeout(() => setShowCrisisAlert(false), 10000);
      }

      setNewMessage("");
      
      // Simulate professional response after 2-3 seconds
      setTimeout(async () => {
        let response;
        
        if (isCrisis) {
          response = "I'm very concerned about what you've shared. I want you to know that you're not alone, and there are people who want to help. Let's talk about what you're going through right now. Are you in a safe place?";
        } else {
          const responses = [
            "Thank you for sharing that with me. How are you feeling about this situation?",
            "I understand. Can you tell me more about what you're experiencing?",
            "That sounds challenging. What coping strategies have you tried so far?",
            "I hear you. Let's explore this together. What would be most helpful right now?",
            "Thank you for being open about this. How long have you been feeling this way?"
          ];
          response = responses[Math.floor(Math.random() * responses.length)];
        }
        
        await supabase
          .from('chats')
          .insert({
            user_id: currentUser.id,
            professional_id: selectedProfessional.id,
            message: response,
            sender: 'professional'
          });
      }, 2000 + Math.random() * 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Crisis Alert */}
        {showCrisisAlert && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Urgent Support Detected</p>
                <p>
                  We detected you might need urgent support. A professional has been notified and will prioritize your message. 
                  If you're in immediate danger, please call emergency services or a crisis hotline.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Chat</h1>
          <p className="text-gray-600">Connect with mental health professionals in real-time</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Professional List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Professionals</CardTitle>
                <CardDescription>Choose a professional to chat with</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockProfessionals.map((professional) => (
                  <div
                    key={professional.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProfessional?.id === professional.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedProfessional(professional)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={professional.avatar} />
                        <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{professional.name}</p>
                        <p className="text-xs text-gray-500">{professional.specialty}</p>
                        <div className="flex items-center mt-1">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            professional.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-xs text-gray-500 capitalize">{professional.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                {selectedProfessional && (
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedProfessional.avatar} />
                      <AvatarFallback>{selectedProfessional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedProfessional.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          selectedProfessional.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        {selectedProfessional.status === 'online' ? 'Online now' : 'Offline'}
                      </CardDescription>
                    </div>
                  </div>
                )}
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400">Start a conversation with your professional</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <Avatar className="w-8 h-8">
                          {message.sender === 'user' ? (
                            <>
                              <AvatarFallback className="bg-blue-600 text-white">
                                <User className="w-4 h-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src={selectedProfessional?.avatar} />
                              <AvatarFallback>{selectedProfessional?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div className={`px-4 py-2 rounded-2xl ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!selectedProfessional || selectedProfessional.status === 'offline'}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending || !selectedProfessional || selectedProfessional.status === 'offline'}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {selectedProfessional?.status === 'offline' && (
                  <p className="text-sm text-gray-500 mt-2">
                    This professional is currently offline. Messages will be delivered when they come online.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">Secure & Confidential</p>
                <p>
                  All conversations are encrypted and confidential. Our licensed professionals are here to provide 
                  support, guidance, and evidence-based therapeutic interventions in a safe environment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}