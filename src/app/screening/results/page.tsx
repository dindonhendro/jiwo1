"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Heart, 
  Smile, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  TrendingUp,
  Calendar,
  MessageCircle,
  BookOpen,
  Target,
  Apple,
  Flower2,
  Palette,
  Users,
  Phone,
  Shield
} from "lucide-react";
import Link from "next/link";

interface ScreeningResult {
  id: string;
  type: string;
  score: number;
  severity: string;
  condition: string;
  answers: Record<string, string>;
  created_at: string;
}

const screeningInfo = {
  "PHQ-9": {
    name: "Depression Screening",
    title: "Skrining Depresi",
    icon: Brain,
    color: "bg-blue-600",
    maxScore: 27,
    ranges: {
      "Minimal": { min: 0, max: 4, color: "bg-green-500", description: "Tidak ada atau minimal gejala depresi" },
      "Ringan": { min: 5, max: 9, color: "bg-yellow-500", description: "Gejala depresi ringan" },
      "Sedang": { min: 10, max: 14, color: "bg-orange-500", description: "Gejala depresi sedang" },
      "Berat": { min: 15, max: 27, color: "bg-red-500", description: "Gejala depresi berat" }
    }
  },
  "GAD-7": {
    name: "Anxiety Screening", 
    title: "Skrining Kecemasan",
    icon: Heart,
    color: "bg-purple-600",
    maxScore: 21,
    ranges: {
      "Minimal": { min: 0, max: 4, color: "bg-green-500", description: "Tidak ada atau minimal gejala kecemasan" },
      "Ringan": { min: 5, max: 9, color: "bg-yellow-500", description: "Gejala kecemasan ringan" },
      "Sedang": { min: 10, max: 14, color: "bg-orange-500", description: "Gejala kecemasan sedang" },
      "Berat": { min: 15, max: 21, color: "bg-red-500", description: "Gejala kecemasan berat" }
    }
  },
  "GDS-15": {
    name: "Geriatric Depression Screening",
    title: "Skrining Depresi Lansia",
    icon: Smile,
    color: "bg-green-600",
    maxScore: 15,
    ranges: {
      "Minimal": { min: 0, max: 4, color: "bg-green-500", description: "Tidak ada gejala depresi" },
      "Ringan": { min: 5, max: 8, color: "bg-yellow-500", description: "Kemungkinan depresi ringan" },
      "Sedang": { min: 9, max: 11, color: "bg-orange-500", description: "Kemungkinan depresi sedang" },
      "Berat": { min: 12, max: 15, color: "bg-red-500", description: "Kemungkinan depresi berat" }
    }
  },
  "EPDS": {
    name: "Postnatal Depression Screening",
    title: "Skrining Depresi Pasca Melahirkan",
    icon: Heart,
    color: "bg-pink-600",
    maxScore: 30,
    ranges: {
      "Minimal": { min: 0, max: 9, color: "bg-green-500", description: "Tidak ada gejala depresi pasca melahirkan" },
      "Ringan": { min: 10, max: 12, color: "bg-yellow-500", description: "Kemungkinan depresi pasca melahirkan ringan" },
      "Sedang": { min: 13, max: 15, color: "bg-orange-500", description: "Kemungkinan depresi pasca melahirkan sedang" },
      "Berat": { min: 16, max: 30, color: "bg-red-500", description: "Kemungkinan depresi pasca melahirkan berat" }
    }
  }
};

const treatmentRecommendations = {
  "Minimal": {
    priority: "low",
    recommendations: [
      {
        type: "self-care",
        title: "Perawatan Mandiri",
        description: "Lanjutkan kebiasaan sehat dan monitor kondisi Anda",
        actions: ["Jurnal harian", "Olahraga teratur", "Tidur cukup", "Mindfulness"]
      },
      {
        type: "monitoring",
        title: "Monitoring Berkala",
        description: "Lakukan screening ulang secara berkala",
        actions: ["Screening bulanan", "Self-assessment", "Tracking mood"]
      }
    ]
  },
  "Ringan": {
    priority: "medium",
    recommendations: [
      {
        type: "counseling",
        title: "Konseling Psikologi",
        description: "Terapi bicara dengan psikolog untuk mengatasi gejala ringan",
        actions: ["Sesi konseling mingguan", "CBT (Cognitive Behavioral Therapy)", "Teknik coping"]
      },
      {
        type: "lifestyle",
        title: "Perubahan Gaya Hidup",
        description: "Modifikasi gaya hidup untuk mendukung kesehatan mental",
        actions: ["Program olahraga", "Nutrisi seimbang", "Manajemen stres", "Support group"]
      }
    ]
  },
  "Sedang": {
    priority: "high",
    recommendations: [
      {
        type: "professional",
        title: "Terapi Profesional",
        description: "Konsultasi dengan psikolog atau psikiater",
        actions: ["Terapi mingguan", "Assessment mendalam", "Rencana treatment", "Monitoring progress"]
      },
      {
        type: "medication",
        title: "Evaluasi Medis",
        description: "Konsultasi dengan psikiater untuk evaluasi pengobatan",
        actions: ["Konsultasi psikiater", "Evaluasi obat", "Monitoring efek samping"]
      }
    ]
  },
  "Berat": {
    priority: "urgent",
    recommendations: [
      {
        type: "immediate",
        title: "Intervensi Segera",
        description: "Memerlukan perhatian medis segera",
        actions: ["Konsultasi psikiater", "Terapi intensif", "Support system", "Crisis plan"]
      },
      {
        type: "comprehensive",
        title: "Perawatan Komprehensif",
        description: "Kombinasi terapi dan pengobatan",
        actions: ["Terapi kombinasi", "Pengobatan", "Monitoring ketat", "Family support"]
      }
    ]
  }
};

export default function ScreeningResultsPage() {
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const loadLatestResult = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/sign-in');
          return;
        }

        // Get the latest screening result
        const { data, error } = await supabase
          .from('screenings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error loading result:', error);
          return;
        }

        if (data && data.length > 0) {
          setResult(data[0]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestResult();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat hasil screening...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-semibold mb-2">Hasil tidak ditemukan</h2>
            <p className="text-gray-600 mb-4">Belum ada hasil screening yang tersedia.</p>
            <Link href="/screening">
              <Button>Mulai Screening</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const screeningType = result.type;
  const info = screeningInfo[screeningType as keyof typeof screeningInfo];
  const IconComponent = info.icon;
  const severityRange = info.ranges[result.severity as keyof typeof info.ranges];
  const scorePercentage = (result.score / info.maxScore) * 100;
  const recommendations = treatmentRecommendations[result.severity as keyof typeof treatmentRecommendations];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Minimal": return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "Ringan": return <Info className="w-5 h-5 text-yellow-600" />;
      case "Sedang": return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "Berat": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low": return <Badge variant="secondary" className="bg-green-100 text-green-800">Prioritas Rendah</Badge>;
      case "medium": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Prioritas Sedang</Badge>;
      case "high": return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Prioritas Tinggi</Badge>;
      case "urgent": return <Badge variant="destructive">Prioritas Mendesak</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${info.color} rounded-full flex items-center justify-center`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hasil Screening</h1>
              <p className="text-sm text-gray-600">{info.title}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Skor & Status Anda</span>
                  {getPriorityBadge(recommendations.priority)}
                </CardTitle>
                <CardDescription>
                  Hasil screening {info.title} pada {new Date(result.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    {getSeverityIcon(result.severity)}
                    <div>
                      <div className="text-4xl font-bold text-gray-900">{result.score}</div>
                      <div className="text-sm text-gray-600">dari {info.maxScore}</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <Badge 
                      variant="secondary" 
                      className={`${severityRange.color} text-white text-lg px-4 py-2`}
                    >
                      {result.severity}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{severityRange.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Skor Anda</span>
                    <span>{scorePercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={scorePercentage} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0 (Minimal)</span>
                    <span>{info.maxScore} (Maksimal)</span>
                  </div>
                </div>

                {/* Severity Ranges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(info.ranges).map(([severity, range]) => (
                    <div 
                      key={severity}
                      className={`p-3 rounded-lg border-2 ${
                        result.severity === severity ? 'border-gray-400' : 'border-transparent'
                      }`}
                    >
                      <div className={`w-4 h-4 ${range.color} rounded-full mb-2`}></div>
                      <div className="text-sm font-medium">{severity}</div>
                      <div className="text-xs text-gray-600">{range.min}-{range.max}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Analisis Detail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Interpretasi Hasil</h4>
                  <p className="text-blue-800 text-sm">
                    {result.severity === "Minimal" && 
                      "Hasil screening menunjukkan tidak ada atau minimal gejala yang mengkhawatirkan. Ini adalah hasil yang positif, namun tetap penting untuk menjaga kesehatan mental Anda."
                    }
                    {result.severity === "Ringan" && 
                      "Hasil screening menunjukkan adanya gejala ringan yang perlu diperhatikan. Dengan dukungan yang tepat dan perubahan gaya hidup, kondisi ini dapat dikelola dengan baik."
                    }
                    {result.severity === "Sedang" && 
                      "Hasil screening menunjukkan gejala yang cukup signifikan dan memerlukan perhatian profesional. Disarankan untuk berkonsultasi dengan tenaga kesehatan mental."
                    }
                    {result.severity === "Berat" && 
                      "Hasil screening menunjukkan gejala yang serius dan memerlukan intervensi segera. Sangat disarankan untuk segera berkonsultasi dengan profesional kesehatan mental."
                    }
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Catatan Penting</h4>
                  <ul className="text-amber-800 text-sm space-y-1">
                    <li>• Hasil ini adalah screening awal, bukan diagnosis medis</li>
                    <li>• Konsultasi dengan profesional diperlukan untuk evaluasi lengkap</li>
                    <li>• Kondisi mental dapat berubah, monitoring berkala dianjurkan</li>
                    <li>• Dukungan keluarga dan teman sangat membantu proses pemulihan</li>
                  </ul>
                </div>

                {result.severity === "Berat" && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Shield className="w-5 h-5 text-red-600 mr-2" />
                      <h4 className="font-semibold text-red-900">Dukungan Krisis</h4>
                    </div>
                    <p className="text-red-800 text-sm mb-3">
                      Jika Anda memiliki pikiran untuk menyakiti diri sendiri atau orang lain, segera hubungi:
                    </p>
                    <div className="space-y-2">
                      <Button variant="destructive" size="sm" className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Hotline Krisis: 119 ext 8
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat Darurat 24/7
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Treatment Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Rekomendasi Perawatan
                </CardTitle>
                <CardDescription>
                  Berdasarkan hasil screening, berikut adalah rekomendasi langkah selanjutnya
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {rec.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="flex items-center text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Langkah Selanjutnya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/treatment">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Cari Profesional
                  </Button>
                </Link>
                <Link href="/journal">
                  <Button variant="outline" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Mulai Jurnal
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recommended Treatments */}
            <Card>
              <CardHeader>
                <CardTitle>Metode Perawatan Direkomendasikan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.severity === "Minimal" && (
                  <>
                    <Link href="/treatment/book?method=life-coaching">
                      <div className="p-3 border rounded-lg hover:bg-orange-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Target className="w-6 h-6 text-orange-600" />
                          <div>
                            <div className="font-medium text-sm">Life Coaching</div>
                            <div className="text-xs text-gray-600">Pengembangan diri</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/treatment/book?method=holistic-yoga">
                      <div className="p-3 border rounded-lg hover:bg-teal-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Flower2 className="w-6 h-6 text-teal-600" />
                          <div>
                            <div className="font-medium text-sm">Holistik Yoga</div>
                            <div className="text-xs text-gray-600">Relaksasi & mindfulness</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </>
                )}
                
                {(result.severity === "Ringan" || result.severity === "Sedang") && (
                  <>
                    <Link href="/treatment/book?method=psychologist">
                      <div className="p-3 border rounded-lg hover:bg-purple-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Heart className="w-6 h-6 text-purple-600" />
                          <div>
                            <div className="font-medium text-sm">Psikolog</div>
                            <div className="text-xs text-gray-600">Terapi bicara</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/treatment/book?method=nutrition">
                      <div className="p-3 border rounded-lg hover:bg-green-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Apple className="w-6 h-6 text-green-600" />
                          <div>
                            <div className="font-medium text-sm">Health Nutrisi</div>
                            <div className="text-xs text-gray-600">Terapi nutrisi</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </>
                )}

                {result.severity === "Berat" && (
                  <>
                    <Link href="/treatment/book?method=psychiatrist">
                      <div className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Brain className="w-6 h-6 text-blue-600" />
                          <div>
                            <div className="font-medium text-sm">Psikiater</div>
                            <div className="text-xs text-gray-600">Evaluasi medis</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/treatment/book?method=psychologist">
                      <div className="p-3 border rounded-lg hover:bg-purple-50 cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <Heart className="w-6 h-6 text-purple-600" />
                          <div>
                            <div className="font-medium text-sm">Psikolog</div>
                            <div className="text-xs text-gray-600">Terapi intensif</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Schedule Follow-up */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Follow-up
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Disarankan untuk melakukan screening ulang dalam:
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.severity === "Minimal" ? "1 Bulan" :
                     result.severity === "Ringan" ? "2 Minggu" :
                     result.severity === "Sedang" ? "1 Minggu" : "3 Hari"}
                  </div>
                  <p className="text-xs text-gray-500">untuk monitoring progress</p>
                </div>
                <Button variant="outline" className="w-full mt-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Reminder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}