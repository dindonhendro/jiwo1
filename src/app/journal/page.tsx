"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calendar, Heart, TrendingUp, Smile, Meh, Frown, Plus, Eye, BarChart3, Brain } from "lucide-react";
import Link from "next/link";

export default function JournalPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [recentEntries, setRecentEntries] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
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
      await loadRecentEntries(user.id);
      setIsLoading(false);
    };

    getUser();
  }, [router, supabase.auth]);

  const loadRecentEntries = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error loading entries:', error);
        return;
      }

      setRecentEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const handleSaveEntry = async () => {
    if (!journalContent.trim() || !selectedMood) {
      alert('Mohon pilih mood dan tulis entri Anda');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('journals')
        .insert({
          user_id: user.id,
          content: journalContent,
          mood: selectedMood,
          sentiment_score: Math.random() * 2 - 1 // Mock sentiment score for now
        });

      if (error) {
        console.error('Error saving entry:', error);
        alert('Terjadi kesalahan saat menyimpan entri');
        return;
      }

      // Reset form
      setJournalContent("");
      setSelectedMood("");
      
      // Reload entries
      await loadRecentEntries(user.id);
      
      alert('Entri berhasil disimpan!');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Terjadi kesalahan saat menyimpan entri');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyzeEntries = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('content, mood, sentiment_score, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading entries for analysis:', error);
        alert('Terjadi kesalahan saat mengambil data');
        return;
      }

      if (!data || data.length === 0) {
        alert('Belum ada entri jurnal untuk dianalisis');
        return;
      }

      // Perform analysis
      const totalEntries = data.length;
      const moodCounts = data.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {});

      const avgSentiment = data.reduce((sum, entry) => sum + (entry.sentiment_score || 0), 0) / totalEntries;
      
      const recentEntries = data.slice(0, 7);
      const recentMoodTrend = recentEntries.map(entry => entry.mood);
      
      const commonWords = extractCommonWords(data.map(entry => entry.content).join(' '));
      
      const analysis = {
        totalEntries,
        moodDistribution: moodCounts,
        averageSentiment: avgSentiment,
        recentMoodTrend,
        commonWords,
        timeRange: {
          from: new Date(data[data.length - 1].created_at).toLocaleDateString('id-ID'),
          to: new Date(data[0].created_at).toLocaleDateString('id-ID')
        },
        insights: generateInsights(moodCounts, avgSentiment, recentMoodTrend)
      };

      setAnalysisResult(analysis);
    } catch (error) {
      console.error('Error analyzing entries:', error);
      alert('Terjadi kesalahan saat menganalisis entri');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractCommonWords = (text: string) => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['yang', 'dengan', 'untuk', 'dari', 'pada', 'dalam', 'akan', 'adalah', 'atau', 'dan', 'ini', 'itu', 'saya', 'hari', 'bisa', 'juga', 'tidak', 'sudah', 'masih', 'sangat'].includes(word));
    
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  };

  const generateInsights = (moodCounts: any, avgSentiment: number, recentTrend: string[]) => {
    const insights = [];
    
    const dominantMood = Object.entries(moodCounts).reduce((a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b)[0];
    insights.push(`Mood dominan Anda adalah "${dominantMood}"`);
    
    if (avgSentiment > 0.3) {
      insights.push("Secara keseluruhan, sentimen jurnal Anda cenderung positif");
    } else if (avgSentiment < -0.3) {
      insights.push("Sentimen jurnal Anda menunjukkan adanya tantangan emosional");
    } else {
      insights.push("Sentimen jurnal Anda cukup seimbang");
    }
    
    const recentPositive = recentTrend.filter(mood => mood === 'good').length;
    if (recentPositive >= 5) {
      insights.push("Mood Anda menunjukkan tren positif dalam 7 hari terakhir");
    } else if (recentPositive <= 2) {
      insights.push("Perhatikan pola mood yang kurang baik dalam beberapa hari terakhir");
    }
    
    return insights;
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diary/Curhat</h1>
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
                    <button 
                      className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${
                        selectedMood === 'good' 
                          ? 'bg-green-50 border-green-300 ring-2 ring-green-200' 
                          : 'hover:bg-green-50 hover:border-green-300'
                      }`}
                      onClick={() => setSelectedMood('good')}
                    >
                      <Smile className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Baik</span>
                    </button>
                    <button 
                      className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${
                        selectedMood === 'neutral' 
                          ? 'bg-yellow-50 border-yellow-300 ring-2 ring-yellow-200' 
                          : 'hover:bg-yellow-50 hover:border-yellow-300'
                      }`}
                      onClick={() => setSelectedMood('neutral')}
                    >
                      <Meh className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm">Biasa</span>
                    </button>
                    <button 
                      className={`flex items-center space-x-2 p-3 border rounded-lg transition-colors ${
                        selectedMood === 'bad' 
                          ? 'bg-red-50 border-red-300 ring-2 ring-red-200' 
                          : 'hover:bg-red-50 hover:border-red-300'
                      }`}
                      onClick={() => setSelectedMood('bad')}
                    >
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
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    onClick={handleSaveEntry}
                    disabled={isSaving}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {isSaving ? 'Menyimpan...' : 'Simpan Entri'}
                  </Button>
                  <Button variant="outline">
                    Draft
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-600" />
                    Hasil Analisis Jurnal
                  </CardTitle>
                  <CardDescription>
                    Analisis dari {analysisResult.totalEntries} entri jurnal ({analysisResult.timeRange.from} - {analysisResult.timeRange.to})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mood Distribution */}
                  <div>
                    <h4 className="font-semibold mb-3">Distribusi Mood</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(analysisResult.moodDistribution).map(([mood, count]) => (
                        <div key={mood} className="text-center p-3 bg-gray-50 rounded-lg">
                          {getMoodIcon(mood)}
                          <div className="text-lg font-bold mt-1">{count as number}</div>
                          <div className="text-xs text-gray-600 capitalize">{mood === 'good' ? 'Baik' : mood === 'neutral' ? 'Biasa' : 'Buruk'}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insights */}
                  <div>
                    <h4 className="font-semibold mb-3">Insight & Rekomendasi</h4>
                    <div className="space-y-2">
                      {analysisResult.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                          <span className="text-sm text-blue-800">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Words */}
                  <div>
                    <h4 className="font-semibold mb-3">Kata-kata yang Sering Muncul</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.commonWords.slice(0, 8).map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item.word} ({item.count})
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Sentiment Score */}
                  <div>
                    <h4 className="font-semibold mb-3">Skor Sentimen Rata-rata</h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            analysisResult.averageSentiment > 0.3 ? 'bg-green-500' :
                            analysisResult.averageSentiment < -0.3 ? 'bg-red-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${Math.abs(analysisResult.averageSentiment) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {analysisResult.averageSentiment > 0.3 ? 'Positif' :
                         analysisResult.averageSentiment < -0.3 ? 'Negatif' : 'Netral'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Entries */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Entri Terbaru
                    </CardTitle>
                    <CardDescription>
                      Lihat kembali jurnal-jurnal Anda sebelumnya
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleAnalyzeEntries}
                    disabled={isAnalyzing || recentEntries.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {isAnalyzing ? 'Menganalisis...' : 'Analisis'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentEntries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Belum ada entri jurnal. Mulai tulis entri pertama Anda!</p>
                  </div>
                ) : (
                  recentEntries.map((entry) => (
                    <div key={entry.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getMoodIcon(entry.mood)}
                          <span className="font-medium">Entri Jurnal</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={getMoodColor(entry.mood)}>
                            {entry.mood === 'good' ? 'Baik' : entry.mood === 'neutral' ? 'Biasa' : 'Buruk'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{entry.content}</p>
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
                  ))
                )}
                {recentEntries.length > 0 && (
                  <Button variant="outline" className="w-full">
                    Lihat Semua Entri
                  </Button>
                )}
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
                  <div className="text-3xl font-bold text-green-600">{recentEntries.length}</div>
                  <div className="text-sm text-gray-600">Total entri</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Entri bulan ini</span>
                    <span className="font-medium">{recentEntries.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rata-rata mood</span>
                    <span className="font-medium text-green-600">
                      {recentEntries.length > 0 ? 
                        (recentEntries.filter(e => e.mood === 'good').length > recentEntries.length / 2 ? 'Positif' : 'Netral')
                        : 'Belum ada data'
                      }
                    </span>
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
                    {recentEntries.slice(0, 7).map((entry, index) => (
                      <div key={index} className="flex-1 h-8 bg-gray-100 rounded flex items-center justify-center">
                        {getMoodIcon(entry.mood)}
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 7 - recentEntries.length) }).map((_, index) => (
                      <div key={`empty-${index}`} className="flex-1 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {recentEntries.length > 0 ? 
                      `${recentEntries.length} entri dalam 7 hari terakhir` :
                      'Belum ada entri minggu ini'
                    }
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