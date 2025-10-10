'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import DashboardNavbar from '@/components/dashboard-navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Loader2, CheckCircle2, Circle, Users } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'

interface Professional {
  id: string
  full_name: string
  specialization: string
  is_available: boolean
  bio?: string
  rating?: number
}

interface ChatUser {
  id: string
  name: string
  nickname: string
  full_name?: string
  email: string
  role: string
}

interface Message {
  id: string
  message: string
  sender: 'user' | 'professional'
  user_id: string
  professional_id: string
  created_at: string
  message_type?: string
  read_at?: string
}

interface User {
  id: string
  name: string
  nickname: string
  email: string
  role: string
}

export default function ChatPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [users, setUsers] = useState<ChatUser[]>([])
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const channelRef = useRef<any>(null)
  const presenceChannelRef = useRef<any>(null)

  useEffect(() => {
    loadUser()
    
    return () => {
      // Cleanup realtime subscriptions
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'user') {
        loadProfessionals()
      } else {
        loadUsers()
      }
      // Setup global presence tracking when user is loaded
      setupGlobalPresence()
    }
  }, [currentUser])

  useEffect(() => {
    const selectedContact = currentUser?.role === 'user' ? selectedProfessional : selectedUser
    if (selectedContact && currentUser) {
      loadMessages()
      setupRealtimeSubscription()
    }
    
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [selectedProfessional, selectedUser, currentUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error) {
          console.error('Error loading user:', error)
          toast({
            title: "Error",
            description: "Gagal memuat data pengguna",
            variant: "destructive"
          })
        } else {
          setCurrentUser(userData)
        }
      }
    } catch (err) {
      console.error('Error in loadUser:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('full_name')
      
      if (error) {
        console.error('Error loading professionals:', error)
        toast({
          title: "Error",
          description: "Gagal memuat daftar profesional",
          variant: "destructive"
        })
      } else {
        setProfessionals(data || [])
      }
    } catch (err) {
      console.error('Error in loadProfessionals:', err)
    }
  }

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'user')
        .order('name')
      
      if (error) {
        console.error('Error loading users:', error)
        toast({
          title: "Error",
          description: "Gagal memuat daftar pengguna",
          variant: "destructive"
        })
      } else {
        setUsers(data || [])
      }
    } catch (err) {
      console.error('Error in loadUsers:', err)
    }
  }

  const loadMessages = async () => {
    const selectedContact = currentUser?.role === 'user' ? selectedProfessional : selectedUser
    if (!selectedContact || !currentUser) return

    try {
      let query
      if (currentUser.role === 'user') {
        // User viewing messages with professional
        query = supabase
          .from('chats')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('professional_id', selectedContact.id)
      } else {
        // Professional viewing messages with user
        query = supabase
          .from('chats')
          .select('*')
          .eq('user_id', selectedContact.id)
          .eq('professional_id', currentUser.id)
      }

      const { data, error } = await query.order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading messages:', error)
        toast({
          title: "Error",
          description: "Gagal memuat pesan",
          variant: "destructive"
        })
      } else {
        setMessages(data || [])
        // Mark messages as read
        markMessagesAsRead(data || [])
      }
    } catch (err) {
      console.error('Error in loadMessages:', err)
    }
  }

  const markMessagesAsRead = async (messages: Message[]) => {
    if (!currentUser) return
    
    const unreadMessages = messages.filter(
      msg => !msg.read_at && msg.sender !== (currentUser.role === 'user' ? 'user' : 'professional')
    )

    if (unreadMessages.length > 0) {
      const { error } = await supabase
        .from('chats')
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadMessages.map(msg => msg.id))

      if (error) {
        console.error('Error marking messages as read:', error)
      }
    }
  }

  const setupGlobalPresence = useCallback(() => {
    if (!currentUser) return

    // Remove existing presence subscription
    if (presenceChannelRef.current) {
      supabase.removeChannel(presenceChannelRef.current)
    }

    // Create global presence channel
    const presenceChannel = supabase
      .channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const newState = presenceChannel.presenceState()
        const users = new Set<string>()
        Object.keys(newState).forEach(key => {
          const presences = newState[key] as any[]
          presences.forEach(presence => {
            if (presence.user_id) {
              users.add(presence.user_id)
            }
          })
        })
        setOnlineUsers(users)
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        newPresences.forEach((presence: any) => {
          if (presence.user_id) {
            setOnlineUsers(prev => new Set([...prev, presence.user_id]))
          }
        })
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        leftPresences.forEach((presence: any) => {
          if (presence.user_id) {
            setOnlineUsers(prev => {
              const newSet = new Set(prev)
              newSet.delete(presence.user_id)
              return newSet
            })
          }
        })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track current user's presence
          await presenceChannel.track({
            user_id: currentUser.id,
            online_at: new Date().toISOString(),
            role: currentUser.role
          })
        }
      })

    presenceChannelRef.current = presenceChannel
  }, [currentUser, supabase])

  const setupRealtimeSubscription = useCallback(() => {
    const selectedContact = currentUser?.role === 'user' ? selectedProfessional : selectedUser
    if (!selectedContact || !currentUser) return

    // Remove existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    let filter
    if (currentUser.role === 'user') {
      filter = `and(user_id.eq.${currentUser.id},professional_id.eq.${selectedContact.id})`
    } else {
      filter = `and(user_id.eq.${selectedContact.id},professional_id.eq.${currentUser.id})`
    }

    // Create new subscription for messages only (presence is handled globally)
    const channel = supabase
      .channel(`chat-${currentUser.id}-${selectedContact.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chats',
          filter: filter
        },
        (payload) => {
          const newMessage = payload.new as Message
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some(msg => msg.id === newMessage.id)) {
              return prev
            }
            return [...prev, newMessage]
          })
          
          // Show notification for received messages
          if (newMessage.sender !== (currentUser.role === 'user' ? 'user' : 'professional')) {
            const contactName = currentUser.role === 'user' ? selectedProfessional?.full_name : selectedUser?.name
            toast({
              title: "Pesan Baru",
              description: `${contactName}: ${newMessage.message.substring(0, 50)}${newMessage.message.length > 50 ? '...' : ''}`,
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chats',
          filter: filter
        },
        (payload) => {
          const updatedMessage = payload.new as Message
          setMessages((prev) => 
            prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
          )
        }
      )
      .subscribe()

    channelRef.current = channel
  }, [selectedProfessional, selectedUser, currentUser, supabase])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const selectedContact = currentUser?.role === 'user' ? selectedProfessional : selectedUser
    if (!newMessage.trim() || !selectedContact || !currentUser || sending) return

    setSending(true)
    
    try {
      let messageData
      if (currentUser.role === 'user') {
        messageData = {
          user_id: currentUser.id,
          professional_id: selectedContact.id,
          message: newMessage.trim(),
          sender: 'user',
          message_type: 'text'
        }
      } else {
        messageData = {
          user_id: selectedContact.id,
          professional_id: currentUser.id,
          message: newMessage.trim(),
          sender: 'professional',
          message_type: 'text'
        }
      }

      const { error } = await supabase
        .from('chats')
        .insert(messageData)

      if (error) {
        console.error('Error sending message:', error)
        toast({
          title: "Error",
          description: "Gagal mengirim pesan",
          variant: "destructive"
        })
      } else {
        setNewMessage('')
      }
    } catch (err) {
      console.error('Error in sendMessage:', err)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim pesan",
        variant: "destructive"
      })
    } finally {
      setSending(false)
    }
  }

  const isUserOnline = (userId: string) => {
    return onlineUsers.has(userId)
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

  const contactList = currentUser?.role === 'user' ? professionals : users
  const selectedContact = currentUser?.role === 'user' ? selectedProfessional : selectedUser
  const contactTitle = currentUser?.role === 'user' ? 'Profesional' : 'Pengguna'

  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-[#1b1918]">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Contact List */}
          <Card className="md:col-span-1 bg-white dark:bg-[#302d2a] border-[#756657]/20">
            <CardHeader>
              <CardTitle className="text-[#161413] dark:text-[#eeedec] flex items-center gap-2">
                <Users className="w-5 h-5" />
                {contactTitle} ({contactList.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="space-y-2">
                  {contactList.length === 0 ? (
                    <div className="text-center text-[#7a736c] dark:text-[#a19991] py-8">
                      Belum ada {contactTitle.toLowerCase()} tersedia
                    </div>
                  ) : (
                    contactList.map((contact) => {
                      const isSelected = currentUser?.role === 'user' 
                        ? selectedProfessional?.id === contact.id
                        : selectedUser?.id === contact.id
                      const displayName = currentUser?.role === 'user' 
                        ? (contact as Professional).full_name
                        : (contact as ChatUser).name || (contact as ChatUser).nickname
                      const subtitle = currentUser?.role === 'user'
                        ? (contact as Professional).specialization
                        : (contact as ChatUser).email

                      return (
                        <Button
                          key={contact.id}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`w-full justify-start ${
                            isSelected
                              ? 'bg-[#756657] text-white'
                              : 'bg-white dark:bg-[#1b1918] text-[#161413] dark:text-[#eeedec] border-[#756657]/20'
                          }`}
                          onClick={() => {
                            if (currentUser?.role === 'user') {
                              setSelectedProfessional(contact as Professional)
                            } else {
                              setSelectedUser(contact as ChatUser)
                            }
                          }}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-[#756657] text-white">
                                  {displayName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {isUserOnline(contact.id) && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium">{displayName}</div>
                              <div className="text-xs opacity-70">{subtitle}</div>
                              {currentUser?.role === 'user' && (contact as Professional).rating && (
                                <div className="text-xs opacity-70">⭐ {(contact as Professional).rating.toFixed(1)}</div>
                              )}
                            </div>
                            {currentUser?.role === 'user' ? (
                              (contact as Professional).is_available ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400" />
                              )
                            ) : (
                              <Circle className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                        </Button>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 bg-white dark:bg-[#302d2a] border-[#756657]/20 flex flex-col">
            {selectedContact ? (
              <>
                <CardHeader className="border-b border-[#756657]/20">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-[#756657] text-white">
                          {currentUser?.role === 'user' 
                            ? (selectedContact as Professional).full_name.charAt(0)
                            : (selectedContact as ChatUser).name?.charAt(0) || (selectedContact as ChatUser).nickname.charAt(0)
                          }
                        </AvatarFallback>
                      </Avatar>
                      {isUserOnline(selectedContact.id) && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-[#161413] dark:text-[#eeedec]">
                        {currentUser?.role === 'user' 
                          ? (selectedContact as Professional).full_name
                          : (selectedContact as ChatUser).name || (selectedContact as ChatUser).nickname
                        }
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={isUserOnline(selectedContact.id) ? 'default' : 'secondary'}>
                          {isUserOnline(selectedContact.id) ? 'Online' : 'Offline'}
                        </Badge>
                        <span className="text-xs text-[#7a736c] dark:text-[#a19991]">
                          {currentUser?.role === 'user' 
                            ? (selectedContact as Professional).specialization
                            : 'Pengguna'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-[#7a736c] dark:text-[#a19991] py-8">
                          <div className="text-lg mb-2">👋</div>
                          <div>Mulai percakapan dengan {
                            currentUser?.role === 'user' 
                              ? (selectedContact as Professional).full_name
                              : (selectedContact as ChatUser).name || (selectedContact as ChatUser).nickname
                          }</div>
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isOwn = currentUser?.role === 'user' ? msg.sender === 'user' : msg.sender === 'professional'
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
                                <div className={`text-xs mt-1 flex items-center gap-1 ${isOwn ? 'text-white/70' : 'text-[#7a736c] dark:text-[#a19991]'}`}>
                                  <span>
                                    {new Date(msg.created_at).toLocaleTimeString('id-ID', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                  {isOwn && msg.read_at && (
                                    <CheckCircle2 className="w-3 h-3" />
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
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
                        maxLength={1000}
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
                    <div className="text-xs text-[#7a736c] dark:text-[#a19991] mt-1">
                      {newMessage.length}/1000 karakter
                    </div>
                  </form>
                </CardContent>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#7a736c] dark:text-[#a19991]">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <div>Pilih {contactTitle.toLowerCase()} untuk memulai chat</div>
                  <div className="text-sm mt-2 opacity-70">
                    {currentUser?.role === 'user' 
                      ? 'Konsultasikan masalah kesehatan mental Anda dengan profesional terpercaya'
                      : 'Mulai percakapan dengan pengguna yang membutuhkan bantuan'
                    }
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}