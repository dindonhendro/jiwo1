'use client'

import Link from 'next/link'
import { createClient } from '../../supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { UserCircle, Home, Brain, Heart, BookOpen, TrendingUp, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardNavbar() {
  const supabase = createClient()
  const router = useRouter()

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="text-xl font-bold text-blue-600 flex items-center">
            <Heart className="w-6 h-6 mr-2" />
            MindCare
          </Link>
          <div className="hidden md:flex items-center gap-4 ml-8">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/screening" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Brain className="w-4 h-4" />
              Screening
            </Link>
            <Link href="/journal" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <BookOpen className="w-4 h-4" />
              Journal
            </Link>
            <Link href="/progress" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <TrendingUp className="w-4 h-4" />
              Progress
            </Link>
            <Link href="/chat" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              Chat
            </Link>
            <Link href="/treatment" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Heart className="w-4 h-4" />
              Treatment
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={async () => {
                await supabase.auth.signOut()
                router.refresh()
              }}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}