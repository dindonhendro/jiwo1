"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calendar, Heart, TrendingUp, Smile, Meh, Frown, Plus, Eye } from "lucide-react";
import Link from "next/link";

export default function JournalPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      setUser(user);
      setIsLoading(false);
    };

    getUser();
  }, [router, supabase.auth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock data for recent entries
  const recentEntries = [
    {
      id: 1,
      date: "Hari ini",
      mood: "good",
      title: "Hari yang produktif",
      preview: "Hari ini saya merasa lebih baik dari kemarin. Berhasil menyelesaikan beberapa tugas...",
      sentiment_score: 0.7
    },
    {
      id: 2,
      date: "Kemarin",
      mood: "neutral", 
      title: "Perasaan campur aduk",
      preview: "Ada beberapa hal yang membuat saya khawatir, tapi secara keseluruhan masih bisa...",
      sentiment_score: 0.1
    },
    {
      id: 3,
      date: "2 hari lalu",
      mood: "bad",
      title: "Hari yang berat",
      preview: "Merasa sangat lelah dan tidak bersemangat. Sulit untuk fokus pada pekerjaan...",
      sentiment_score: -0.5
    }
  ];

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'good': return <Smile className="w-4 h-4 text-green-600" />;
      case 'neutral': return <Meh className="w-4 h-4 text-yellow-600" />;
      case 'bad': return <Frown className="w-4 h-4 text-red-600" />;
      default: return <Meh className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      case 'bad': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Jurnal Harian</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tulis perasaan dan pikiran Anda setiap hari. Jurnal membantu memahami pola emosi dan mendukung proses penyembuhan.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Entry Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-purple-600" />
                  Tulis Entri Baru
                </CardTitle>
                <CardDescription>
                  Bagaimana perasaan Anda hari ini? Ceritakan apa yang ada di pikiran Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mood Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bagaimana suasana hati Anda hari ini?
                  </label>
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors">
                      <Smile className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Baik</span>
                    </button>
                    <button className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors">
                      <Meh className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm">Biasa</span>
                    </button>
                    <button className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">
                      <Frown className="w-5 h-5 text-red-600" />
                      <span className="text-sm">Buruk</span>
                    </button>
                  </div>
                </div>

                {/* Journal Entry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ceritakan hari Anda
                  </label>
                  <Textarea
                    placeholder="Tulis tentang perasaan, pikiran, atau kejadian yang Anda alami hari ini..."
                    className="min-h-[200px] resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Simpan Entri
                  </Button>
                  <Button variant="outline">
                    Draft
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Entri Terbaru
                </CardTitle>
                <CardDescription>
                  Lihat kembali jurnal-jurnal Anda sebelumnya
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEntries.map((entry) => (
                  <div key={entry.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getMoodIcon(entry.mood)}
                        <span className="font-medium">{entry.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getMoodColor(entry.mood)}>
                          {entry.mood === 'good' ? 'Baik' : entry.mood === 'neutral' ? 'Biasa' : 'Buruk'}
                        </Badge>
                        <span className="text-sm text-gray-500">{entry.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{entry.preview}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Sentiment: {entry.sentiment_score > 0.3 ? 'Positif' : entry.sentiment_score < -0.3 ? 'Negatif' : 'Netral'}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Baca
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Lihat Semua Entri
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Writing Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Statistik Menulis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">7</div>
                  <div className="text-sm text-gray-600">Hari berturut-turut</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Entri bulan ini</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total kata</span>
                    <span className="font-medium">12,450</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rata-rata mood</span>
                    <span className="font-medium text-green-600">Positif</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mood Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-pink-600" />
                  Pelacak Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">7 hari terakhir</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div key={day} className="flex-1 h-8 bg-green-200 rounded flex items-center justify-center">
                        <Smile className="w-4 h-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Mood Anda cenderung stabil dan positif minggu ini
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Writing Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Tips Menulis Jurnal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Tulis secara konsisten setiap hari</p>
                <p>• Jujur dengan perasaan Anda</p>
                <p>• Fokus pada pengalaman dan emosi</p>
                <p>• Jangan khawatir tentang tata bahasa</p>
                <p>• Refleksikan pola yang Anda temukan</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}