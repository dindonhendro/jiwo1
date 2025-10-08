"use client";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageCircle, Send, User, Phone, Video, MoreVertical, Smile, Paperclip, Image as ImageIcon, Check, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  user_id: string;
  professional_id: string;
  message: string;
  sender: 'user' | 'professional';
  message_type: 'text' | 'image';
  image_url?: string;
  read_at?: string;
  created_at: string;
}

interface Professional {
  id: string;
  full_name: string;
  specialization?: string;
  avatar_url?: string;
}

export default function ChatPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatChannelRef = useRef<RealtimeChannel | null>(null);
  const typingChannelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MESSAGES_PER_PAGE = 20;

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
      } else {
        setUser(user);
        loadProfessionals();
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const loadProfessionals = async () => {
    const { data } = await supabase
      .from('professionals')
      .select('id, full_name, specialization, avatar_url')
      .eq('is_available', true)
      .limit(10);
    
    if (data) {
      setProfessionals(data);
      if (data.length > 0) {
        setSelectedProfessional(data[0]);
      }
    }
  };

  useEffect(() => {
    if (user && selectedProfessional) {
      loadMessages();
      setupRealtimeSubscription();
      setupTypingIndicator();
    }

    return () => {
      if (chatChannelRef.current) {
        supabase.removeChannel(chatChannelRef.current);
      }
      if (typingChannelRef.current) {
        supabase.removeChannel(typingChannelRef.current);
      }
    };
  }, [user, selectedProfessional]);

  const loadMessages = async (pageNum = 1) => {
    if (!user || !selectedProfessional) return;

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .or(`and(user_id.eq.${user.id},professional_id.eq.${selectedProfessional.id}),and(user_id.eq.${selectedProfessional.id},professional_id.eq.${user.id})`)
      .order('created_at', { ascending: false })
      .range((pageNum - 1) * MESSAGES_PER_PAGE, pageNum * MESSAGES_PER_PAGE - 1);

    if (data) {
      if (pageNum === 1) {
        setMessages(data.reverse());
      } else {
        setMessages(prev => [...data.reverse(), ...prev]);
      }
      setHasMore(data.length === MESSAGES_PER_PAGE);
      
      // Mark messages as read
      markMessagesAsRead();
    }
  };

  const markMessagesAsRead = async () => {
    if (!user || !selectedProfessional) return;

    await supabase
      .from('chats')
      .update({ read_at: new Date().toISOString() })
      .eq('professional_id', selectedProfessional.id)
      .eq('user_id', user.id)
      .eq('sender', 'professional')
      .is('read_at', null);
  };

  const setupRealtimeSubscription = () => {
    if (!user || !selectedProfessional) return;

    chatChannelRef.current = supabase
      .channel(`chat:${user.id}:${selectedProfessional.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `user_id=eq.${user.id},professional_id=eq.${selectedProfessional.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `user_id=eq.${selectedProfessional.id},professional_id=eq.${user.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
          markMessagesAsRead();
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chats'
        },
        (payload) => {
          setMessages(prev => 
            prev.map(msg => msg.id === payload.new.id ? payload.new as Message : msg)
          );
        }
      )
      .subscribe();
  };

  const setupTypingIndicator = () => {
    if (!user || !selectedProfessional) return;

    typingChannelRef.current = supabase
      .channel(`typing:${user.id}:${selectedProfessional.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `user_id=eq.${selectedProfessional.id},professional_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new) {
            setIsTyping((payload.new as any).is_typing);
          }
        }
      )
      .subscribe();
  };

  const handleTyping = async () => {
    if (!user || !selectedProfessional) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Update typing status
    await supabase
      .from('typing_indicators')
      .upsert({
        user_id: user.id,
        professional_id: selectedProfessional.id,
        is_typing: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,professional_id'
      });

    // Set timeout to clear typing status
    typingTimeoutRef.current = setTimeout(async () => {
      await supabase
        .from('typing_indicators')
        .upsert({
          user_id: user.id,
          professional_id: selectedProfessional.id,
          is_typing: false,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,professional_id'
        });
    }, 2000);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedProfessional) return;

    const messageData = {
      user_id: user.id,
      professional_id: selectedProfessional.id,
      message: newMessage,
      sender: 'user',
      message_type: 'text'
    };

    const { error } = await supabase
      .from('chats')
      .insert(messageData);

    if (!error) {
      setNewMessage("");
      
      // Clear typing indicator
      await supabase
        .from('typing_indicators')
        .upsert({
          user_id: user.id,
          professional_id: selectedProfessional.id,
          is_typing: false,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,professional_id'
        });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !selectedProfessional) return;

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      const messageData = {
        user_id: user.id,
        professional_id: selectedProfessional.id,
        message: 'Sent an image',
        sender: 'user',
        message_type: 'image',
        image_url: publicUrl
      };

      await supabase.from('chats').insert(messageData);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMoreMessages = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMessages(nextPage);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <p>Loading...</p>
    </div>;
  }

  if (!user || !selectedProfessional) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedProfessional.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfessional.id}`} />
                  <AvatarFallback>{selectedProfessional.full_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedProfessional.full_name}</h2>
                  <div className="flex items-center space-x-2">
                    {isTyping ? (
                      <span className="text-sm text-blue-600">typing...</span>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {hasMore && (
            <div className="text-center">
              <Button variant="ghost" size="sm" onClick={loadMoreMessages}>
                Load more messages
              </Button>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={message.sender === 'user' 
                    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}` 
                    : selectedProfessional.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfessional.id}`
                  } />
                  <AvatarFallback>{message.sender === 'user' ? 'U' : 'P'}</AvatarFallback>
                </Avatar>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200'
                }`}>
                  {message.message_type === 'image' && message.image_url ? (
                    <img src={message.image_url} alt="Shared image" className="rounded max-w-xs" />
                  ) : (
                    <p className="text-sm">{message.message}</p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-xs ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {message.sender === 'user' && (
                      <span className="ml-2">
                        {message.read_at ? (
                          <CheckCheck className="w-3 h-3 text-blue-200" />
                        ) : (
                          <Check className="w-3 h-3 text-blue-200" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Ketik pesan Anda..."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                className="pr-10"
              />
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}