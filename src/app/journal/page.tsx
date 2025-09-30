"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Send, Calendar, Heart, Brain, Smile, Meh, Frown, AlertTriangle } from "lucide-react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import { detectCrisisKeywords, triggerCrisisWebhook } from "@/utils/crisis-detection";

interface Journal {
  id: string;
  content: string;
  ai_summary: string | null;
  mood: string | null;
  sentiment_score: number | null;
  created_at: string;
}

const getMoodIcon = (mood: string | null) => {
  switch (mood?.toLowerCase()) {
    case 'positive':
    case 'happy':
    case 'joy':
      return <Smile className="w-4 h-4 text-green-500" />;
    case 'negative':
    case 'sad':
    case 'angry':
      return <Frown className="w-4 h-4 text-red-500" />;
    case 'neutral':
    case 'calm':
      return <Meh className="w-4 h-4 text-yellow-500" />;
    default:
      return <Heart className="w-4 h-4 text-gray-400" />;
  }
};

const getMoodColor = (mood: string | null) => {
  switch (mood?.toLowerCase()) {
    case 'positive':
    case 'happy':
    case 'joy':
      return 'bg-green-100 text-green-800';
    case 'negative':
    case 'sad':
    case 'angry':
      return 'bg-red-100 text-red-800';
    case 'neutral':
    case 'calm':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSentimentColor = (score: number | null) => {
  if (!score) return 'bg-gray-100 text-gray-800';
  if (score >= 0.6) return 'bg-green-100 text-green-800';
  if (score >= 0.3) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getSentimentLabel = (score: number | null) => {
  if (!score) return 'Belum dianalisis';
  if (score >= 0.6) return 'Positif';
  if (score >= 0.3) return 'Netral';
  return 'Negatif';
};

export default function JournalPage() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading journals:', error);
      } else {
        setJournals(data || []);
      }
    } catch (error) {
      console.error('Error loading journals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      // Check for crisis keywords
      const isCrisis = detectCrisisKeywords(content.trim());

      // Save to Supabase
      const { data, error } = await supabase
        .from('journals')
        .insert({
          user_id: user.id,
          content: content.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to save journal entry');
      }

      // Trigger crisis webhook if needed
      if (isCrisis) {
        await triggerCrisisWebhook(user.id, content.trim(), 'journal');
        setShowCrisisAlert(true);
        
        // Hide alert after 10 seconds
        setTimeout(() => setShowCrisisAlert(false), 10000);
      }

      // Call production n8n webhook for journal processing
      try {
        const webhookResponse = await fetch('https://dindon.app.n8n.cloud/webhook-test/6f49e2fe-d2ff-427b-8e79-6628403ebb73', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            journal_id: data.id,
            content: content.trim(),
            timestamp: new Date().toISOString(),
            type: 'journal_entry'
          })
        });

        if (webhookResponse.ok) {
          console.log('Journal webhook sent successfully');
        } else {
          console.warn('Webhook response not OK:', webhookResponse.status);
        }
      } catch (webhookError) {
        console.warn('Webhook call failed:', webhookError);
        // Continue even if webhook fails - don't block user experience
      }

      // Clear form and reload journals
      setContent("");
      await loadJournals();
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('Gagal menyimpan entri jurnal. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Crisis Alert */}
        {showCrisisAlert && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Ditemukan Dukungan Darurat</p>
                <p>
                  Kami mendeteksi Anda mungkin membutuhkan dukungan darurat. Seorang profesional telah diberitahu dan akan menghubungi Anda segera. 
                  Jika Anda dalam bahaya segera, segera hubungi layanan darurat atau hotline krisis.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Journal</h1>
          <p className="text-gray-600">Express your thoughts and track your emotional journey</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* New Entry */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  New Entry - {new Date().toLocaleDateString()}
                </CardTitle>
                <CardDescription>
                  What's on your mind today? Share your thoughts and feelings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="journal-content" className="text-base font-medium">
                    Your thoughts
                  </Label>
                  <Textarea 
                    id="journal-content"
                    placeholder="Write about your day, your feelings, thoughts, or anything that comes to mind..."
                    className="min-h-[200px] mt-2"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {content.length} characters • AI analysis will be provided after saving
                  </p>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Save Entry
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Past Entries */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Riwayat Jurnal Anda</CardTitle>
                <CardDescription>
                  {journals.length} entri dengan analisis AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Memuat entri...</p>
                  </div>
                ) : journals.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Belum ada entri jurnal</p>
                    <p className="text-sm text-gray-400">Mulai menulis untuk melihat entri Anda di sini</p>
                  </div>
                ) : (
                  journals.map((journal) => (
                    <div key={journal.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {new Date(journal.created_at).toLocaleDateString('id-ID')}
                        </span>
                        <div className="flex gap-2">
                          {journal.mood && (
                            <Badge variant="secondary" className={getMoodColor(journal.mood)}>
                              <span className="flex items-center gap-1">
                                {getMoodIcon(journal.mood)}
                                {journal.mood}
                              </span>
                            </Badge>
                          )}
                          {journal.sentiment_score !== null && (
                            <Badge variant="secondary" className={getSentimentColor(journal.sentiment_score)}>
                              {getSentimentLabel(journal.sentiment_score)} ({(journal.sentiment_score * 100).toFixed(0)}%)
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Original Content Preview */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 line-clamp-2 italic">
                          "{journal.content.substring(0, 100)}{journal.content.length > 100 ? '...' : ''}"
                        </p>
                      </div>
                      
                      {/* AI Analysis Results */}
                      {journal.ai_summary ? (
                        <div className="space-y-3">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-blue-700">Ringkasan AI</span>
                            </div>
                            <p className="text-sm text-blue-800">
                              {journal.ai_summary}
                            </p>
                          </div>
                          
                          {/* Mood and Sentiment Analysis */}
                          <div className="grid grid-cols-2 gap-2">
                            {journal.mood && (
                              <div className="bg-purple-50 p-2 rounded text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  {getMoodIcon(journal.mood)}
                                  <span className="text-xs font-medium text-purple-700">Mood</span>
                                </div>
                                <span className="text-xs text-purple-600 capitalize">{journal.mood}</span>
                              </div>
                            )}
                            
                            {journal.sentiment_score !== null && (
                              <div className="bg-green-50 p-2 rounded text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Heart className="w-3 h-3 text-green-500" />
                                  <span className="text-xs font-medium text-green-700">Sentimen</span>
                                </div>
                                <span className="text-xs text-green-600">
                                  {getSentimentLabel(journal.sentiment_score)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                          <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full"></div>
                          Memproses analisis AI...
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-8 bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="text-sm text-purple-800">
                <p className="font-semibold mb-1">Wawasan Bertenaga AI</p>
                <p>
                  AI kami menganalisis entri jurnal Anda untuk memberikan klasifikasi mood, analisis sentimen, dan ringkasan, 
                  membantu Anda melacak pola dalam perjalanan kesehatan mental Anda. Semua pemrosesan aman dan rahasia.
                </p>
                <div className="mt-2 p-2 bg-white rounded border-l-4 border-purple-400">
                  <p className="text-xs font-medium text-purple-700 mb-1">Endpoint untuk n8n:</p>
                  <code className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    POST /api/journal-ai-response
                  </code>
                  <p className="text-xs text-purple-600 mt-1">
                    Kirim: journal_id, ai_summary, mood, sentiment_score
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}