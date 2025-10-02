"use client";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageCircle, Send, Bot, User, Phone, Video, MoreVertical, Smile, Paperclip, Mic } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect("/sign-in");
      } else {
        setUser(user);
      }
    };
    getUser();
  }, []);

  // Mock chat messages
  const messages = [
    {
      id: 1,
      sender: "ai",
      content: "Halo! Saya AI Terapis Jiwo. Bagaimana perasaan Anda hari ini?",
      timestamp: "10:30",
      type: "text"
    },
    {
      id: 2,
      sender: "user",
      content: "Halo, saya merasa cukup cemas hari ini. Ada beberapa hal yang membuat saya khawatir.",
      timestamp: "10:32",
      type: "text"
    },
    {
      id: 3,
      sender: "ai",
      content: "Saya memahami perasaan cemas yang Anda alami. Kecemasan adalah respons alami tubuh terhadap situasi yang kita anggap mengancam. Bisakah Anda ceritakan lebih detail tentang hal-hal yang membuat Anda khawatir?",
      timestamp: "10:33",
      type: "text"
    },
    {
      id: 4,
      sender: "user",
      content: "Terutama tentang pekerjaan. Saya merasa tidak mampu menyelesaikan tugas-tugas dengan baik dan takut mengecewakan atasan.",
      timestamp: "10:35",
      type: "text"
    },
    {
      id: 5,
      sender: "ai",
      content: "Terima kasih sudah berbagi. Perasaan tidak mampu dan takut mengecewakan orang lain adalah hal yang umum dialami. Mari kita eksplorasi lebih dalam. Apakah ada bukti konkret yang mendukung kekhawatiran Anda tentang performa kerja?",
      timestamp: "10:36",
      type: "text"
    }
  ];

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
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=jiwo-ai" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">AI Terapis Jiwo</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-600">Online</span>
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {message.sender === 'ai' ? (
                    <>
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=jiwo-ai" />
                      <AvatarFallback>AI</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                      <AvatarFallback>U</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=jiwo-ai" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Ketik pesan Anda..."
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Responses */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
              Saya merasa cemas
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
              Butuh motivasi
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
              Sulit tidur
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
              Merasa sedih
            </Badge>
          </div>
        </div>
      </div>

      {/* Sidebar - Hidden on mobile, shown on larger screens */}
      <div className="hidden lg:block fixed right-4 top-20 w-80">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="w-5 h-5 mr-2 text-blue-600" />
              AI Terapis Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">AI Terapis Jiwo siap membantu Anda 24/7 dengan:</p>
              <ul className="space-y-1 text-xs">
                <li>• Mendengarkan keluh kesah Anda</li>
                <li>• Memberikan dukungan emosional</li>
                <li>• Teknik relaksasi dan mindfulness</li>
                <li>• Strategi coping yang sehat</li>
                <li>• Rujukan ke profesional jika diperlukan</li>
              </ul>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Catatan:</strong> AI Terapis adalah alat bantu dan tidak menggantikan konsultasi dengan profesional kesehatan mental.
              </p>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full text-sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Riwayat Chat
              </Button>
              <Button variant="outline" className="w-full text-sm">
                <User className="w-4 h-4 mr-2" />
                Chat dengan Profesional
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}