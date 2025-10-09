'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import DashboardNavbar from '@/components/dashboard-navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Loader2, CheckCircle2, Circle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface Professional {
  id: string
  full_name: string
  specialization: string
  is_available: boolean
}

interface Message {
  id: string
  message: string
  sender: 'user' | 'professional'
  user_id: string
  professional_id: string
  created_at: string
}

export default function ChatPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadUser()
    loadProfessionals()
  }, [])

  useEffect(() => {
    if (selectedProfessional && currentUser) {
      loadMessages()
      subscribeToMessages()
    }
  }, [selectedProfessional, currentUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      setCurrentUser(userData)
    }
    setLoading(false)
  }

  const loadProfessionals = async () => {
    const { data } = await supabase
      .from('professionals')
      .select('*')
      .order('full_name')
    
    if (data) setProfessionals(data)
  }

  const loadMessages = async () => {
    if (!selectedProfessional || !currentUser) return

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('professional_id', selectedProfessional.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading messages:', error)
    } else {
      setMessages(data || [])
    }
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedProfessional || !currentUser || sending) return

    setSending(true)
    
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: currentUser.id,
          professional_id: selectedProfessional.id,
          message: newMessage.trim(),
          sender: 'user'
        })
        .select()

      if (error) {
        console.error('Error sending message:', error)
      } else {
        console.log('Message sent successfully:', data)
        setNewMessage('')
        await loadMessages()
      }
    } catch (err) {
      console.error('Error in sendMessage:', err)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#1b1918]">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="w-8 h-8 animate-spin text-[#756657]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#1b1918]">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Professionals List */}
          <Card className="md:col-span-1 bg-white dark:bg-[#302d2a] border-[#756657]/20">
            <CardHeader>
              <CardTitle className="text-[#161413] dark:text-[#eeedec]">Profesional</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="space-y-2">
                  {professionals.map((prof) => (
                    <Button
                      key={prof.id}
                      variant={selectedProfessional?.id === prof.id ? 'default' : 'outline'}
                      className={`w-full justify-start ${
                        selectedProfessional?.id === prof.id
                          ? 'bg-[#756657] text-white'
                          : 'bg-white dark:bg-[#1b1918] text-[#161413] dark:text-[#eeedec] border-[#756657]/20'
                      }`}
                      onClick={() => setSelectedProfessional(prof)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-[#756657] text-white">
                            {prof.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{prof.full_name}</div>
                          <div className="text-xs opacity-70">{prof.specialization}</div>
                        </div>
                        {prof.is_available ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 bg-white dark:bg-[#302d2a] border-[#756657]/20 flex flex-col">
            {selectedProfessional ? (
              <>
                <CardHeader className="border-b border-[#756657]/20">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#756657] text-white">
                        {selectedProfessional.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-[#161413] dark:text-[#eeedec]">
                        {selectedProfessional.full_name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={selectedProfessional.is_available ? 'default' : 'secondary'}>
                          {selectedProfessional.is_available ? 'Online' : 'Offline'}
                        </Badge>
                        <span className="text-xs text-[#7a736c] dark:text-[#a19991]">
                          {selectedProfessional.specialization}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isOwn = msg.sender === 'user'
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                isOwn
                                  ? 'bg-[#756657] text-white'
                                  : 'bg-[#f7f7f7] dark:bg-[#1b1918] text-[#161413] dark:text-[#eeedec]'
                              }`}
                            >
                              <div className="text-sm">{msg.message}</div>
                              <div className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-[#7a736c] dark:text-[#a19991]'}`}>
                                {new Date(msg.created_at).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <form onSubmit={sendMessage} className="p-4 border-t border-[#756657]/20">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan..."
                        disabled={sending}
                        className="flex-1 bg-[#f7f7f7] dark:bg-[#1b1918] border-[#756657]/20 text-[#161413] dark:text-[#eeedec]"
                      />
                      <Button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="bg-[#756657] hover:bg-[#756657]/90 text-white"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#7a736c] dark:text-[#a19991]">
                Pilih profesional untuk memulai chat
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}