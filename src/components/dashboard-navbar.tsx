'use client'

import Link from 'next/link'
import { createClient } from '../../supabase/client'
import UserProfile from './user-profile'
import { Button } from './ui/button'
import { Home, Brain, Heart, BookOpen, TrendingUp, MessageCircle, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardNavbar() {
  const supabase = createClient()
  const router = useRouter()

  return (
    <nav className="w-full border-b border-[#756657]/20 bg-[#f7f7f7] dark:bg-[#1b1918] py-4 relative z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="text-xl font-bold text-[#756657] flex items-center">
            <Heart className="w-6 h-6 mr-2" />
            Jiwo.AI
          </Link>
          <div className="hidden md:flex items-center gap-4 ml-8">
            <Link href="/screening" className="flex items-center gap-2 text-[#7a736c] dark:text-[#a19991] hover:text-[#756657] transition-colors">
              <Brain className="w-4 h-4" />
              Screening
            </Link>
            <Link href="/journal" className="flex items-center gap-2 text-[#7a736c] dark:text-[#a19991] hover:text-[#756657] transition-colors">
              <BookOpen className="w-4 h-4" />
              Journal
            </Link>
            <Link href="/progress" className="flex items-center gap-2 text-[#7a736c] dark:text-[#a19991] hover:text-[#756657] transition-colors">
              <TrendingUp className="w-4 h-4" />
              Progress
            </Link>
            <Link href="/sfbt-chat" className="flex items-center gap-2 text-[#7a736c] dark:text-[#a19991] hover:text-[#756657] transition-colors">
              <Sparkles className="w-4 h-4" />
              SFBT Chat
            </Link>
            <Link href="/treatment" className="flex items-center gap-2 text-[#7a736c] dark:text-[#a19991] hover:text-[#756657] transition-colors">
              <Heart className="w-4 h-4" />
              Treatment
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#7a736c] dark:text-[#a19991] hover:text-[#756657] transition-colors">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link href="/chat" className="flex items-center gap-2 text-[#7a736c] dark:text-[#a19991] hover:text-[#756657] transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </Link>
          <UserProfile />
        </div>
      </div>
    </nav>
  )
}