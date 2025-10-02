import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Calendar, Target, BookOpen, Brain, Heart, Award, BarChart3, LineChart, PieChart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProgressPage() {
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

  // Mock progress data
  const weeklyProgress = [
    { day: "Sen", mood: 7, journal: 1, screening: 0 },
    { day: "Sel", mood: 6, journal: 1, screening: 1 },
    { day: "Rab", mood: 8, journal: 1, screening: 0 },
    { day: "Kam", mood: 7, journal: 1, screening: 0 },
    { day: "Jum", mood: 9, journal: 1, screening: 0 },
    { day: "Sab", mood: 8, journal: 1, screening: 1 },
    { day: "Min", mood: 7, journal: 1, screening: 0 }
  ];

  const screeningHistory = [
    { date: "2024-01-15", type: "PHQ-9", score: 8, severity: "Mild Depression", color: "text-yellow-600" },
    { date: "2024-01-10", type: "GAD-7", score: 12, severity: "Moderate Anxiety", color: "text-orange-600" },
    { date: "2024-01-05", type: "PHQ-9", score: 14, severity: "Moderate Depression", color: "text-orange-600" },
    { date: "2024-01-01", type: "GAD-7", score: 16, severity: "Severe Anxiety", color: "text-red-600" }
  ];

  const achievements = [
    { title: "7 Hari Berturut-turut", description: "Menulis jurnal setiap hari", icon: BookOpen, color: "bg-blue-600" },
    { title: "Screening Rutin", description: "Melakukan 5 screening bulan ini", icon: Brain, color: "bg-purple-600" },
    { title: "Mood Stabil", description: "Mood rata-rata baik minggu ini", icon: Heart, color: "bg-green-600" },
    { title: "Konsisten Chat", description: "Aktif chat dengan AI Terapis", icon: Award, color: "bg-orange-600" }
  ];

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
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pantau perkembangan kesehatan mental Anda melalui berbagai metrik dan visualisasi data.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mood Rata-rata</p>
                  <p className="text-2xl font-bold text-green-600">7.4/10</p>
                  <p className="text-xs text-green-600">↑ 0.8 dari minggu lalu</p>
                </div>
                <Heart className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Streak Jurnal</p>
                  <p className="text-2xl font-bold text-blue-600">7 hari</p>
                  <p className="text-xs text-blue-600">Target: 30 hari</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Screening Bulan Ini</p>
                  <p className="text-2xl font-bold text-purple-600">5</p>
                  <p className="text-xs text-purple-600">Terakhir: 2 hari lalu</p>
                </div>
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Skor Kemajuan</p>
                  <p className="text-2xl font-bold text-orange-600">78%</p>
                  <p className="text-xs text-orange-600">↑ 12% bulan ini</p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Progress Mingguan
                </CardTitle>
                <CardDescription>
                  Aktivitas dan mood Anda dalam 7 hari terakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mood Chart */}
                  <div>
                    <h4 className="font-medium mb-2">Mood Harian (1-10)</h4>
                    <div className="flex items-end space-x-2 h-32">
                      {weeklyProgress.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-blue-600 rounded-t"
                            style={{ height: `${(day.mood / 10) * 100}%` }}
                          ></div>
                          <span className="text-xs text-gray-600 mt-1">{day.day}</span>
                          <span className="text-xs font-medium">{day.mood}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Summary */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">7/7</div>
                      <div className="text-sm text-gray-600">Jurnal Harian</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">2/7</div>
                      <div className="text-sm text-gray-600">Screening</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Screening History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="w-5 h-5 mr-2 text-purple-600" />
                  Riwayat Screening
                </CardTitle>
                <CardDescription>
                  Perkembangan skor screening dari waktu ke waktu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {screeningHistory.map((screening, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Brain className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">{screening.type}</div>
                          <div className="text-sm text-gray-600">{screening.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{screening.score}</div>
                        <div className={`text-sm ${screening.color}`}>{screening.severity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-green-600" />
                  Analisis Mood
                </CardTitle>
                <CardDescription>
                  Distribusi mood Anda bulan ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">😊</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">65%</div>
                    <div className="text-sm text-gray-600">Mood Baik</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">😐</span>
                    </div>
                    <div className="text-lg font-bold text-yellow-600">25%</div>
                    <div className="text-sm text-gray-600">Mood Netral</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">😔</span>
                    </div>
                    <div className="text-lg font-bold text-red-600">10%</div>
                    <div className="text-sm text-gray-600">Mood Buruk</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Pencapaian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className={`w-10 h-10 ${achievement.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Target Bulan Ini
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Jurnal Harian</span>
                    <span>23/30</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '77%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Screening Mingguan</span>
                    <span>2/4</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '50%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mood Rata-rata</span>
                    <span>7.4/8.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '93%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>• Mood Anda cenderung lebih baik di akhir pekan</p>
                <p>• Konsistensi menulis jurnal meningkatkan mood harian</p>
                <p>• Skor screening menunjukkan tren perbaikan</p>
                <p>• Aktivitas chat dengan AI membantu stabilitas emosi</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}