import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Heart, AlertTriangle, Smile, Frown, Meh, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function ScreeningPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const screeningTypes = [
    {
      id: "phq9",
      name: "PHQ-9",
      title: "Depression Screening",
      description: "Patient Health Questionnaire untuk mendeteksi gejala depresi",
      duration: "5-7 menit",
      questions: 9,
      color: "bg-blue-600",
      icon: Brain,
      severity: "Ringan - Berat"
    },
    {
      id: "gad7", 
      name: "GAD-7",
      title: "Anxiety Screening",
      description: "Generalized Anxiety Disorder scale untuk mengukur tingkat kecemasan",
      duration: "3-5 menit",
      questions: 7,
      color: "bg-purple-600",
      icon: Heart,
      severity: "Ringan - Berat"
    },
    {
      id: "gds15",
      name: "GDS-15",
      title: "Geriatric Depression Scale",
      description: "Skrining depresi khusus untuk lansia (65+ tahun)",
      duration: "4-6 menit", 
      questions: 15,
      color: "bg-green-600",
      icon: Smile,
      severity: "Normal - Depresi Berat"
    },
    {
      id: "epds",
      name: "EPDS",
      title: "Postpartum Depression",
      description: "Edinburgh Postnatal Depression Scale untuk ibu pasca melahirkan",
      duration: "3-5 menit",
      questions: 10,
      color: "bg-pink-600", 
      icon: Heart,
      severity: "Normal - Risiko Tinggi"
    }
  ];

  const recentScreenings = [
    {
      type: "PHQ-9",
      score: 8,
      severity: "Mild Depression",
      date: "2 hari lalu",
      color: "text-yellow-600"
    },
    {
      type: "GAD-7", 
      score: 12,
      severity: "Moderate Anxiety",
      date: "1 minggu lalu",
      color: "text-orange-600"
    }
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
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Self Screening</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lakukan penilaian mandiri untuk memahami kondisi kesehatan mental Anda. 
            Hasil screening ini dapat membantu profesional memberikan perawatan yang tepat.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Available Screenings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                  Pilih Jenis Screening
                </CardTitle>
                <CardDescription>
                  Pilih assessment yang sesuai dengan kondisi atau kekhawatiran Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {screeningTypes.map((screening) => {
                    const IconComponent = screening.icon;
                    return (
                      <Link key={screening.id} href={`/screening/${screening.id}`}>
                        <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 ${screening.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg">{screening.name}</h3>
                                <Badge variant="secondary">{screening.questions} pertanyaan</Badge>
                              </div>
                              <h4 className="font-medium text-gray-800 mb-1">{screening.title}</h4>
                              <p className="text-sm text-gray-600 mb-3">{screening.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {screening.duration}
                                </div>
                                <div className="flex items-center">
                                  <TrendingUp className="w-4 h-4 mr-1" />
                                  {screening.severity}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                  Penting untuk Diketahui
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>• Screening ini bukan diagnosis medis, melainkan alat bantu untuk memahami kondisi Anda</p>
                <p>• Jawablah dengan jujur berdasarkan perasaan Anda dalam 2 minggu terakhir</p>
                <p>• Hasil screening akan membantu profesional memberikan rekomendasi yang tepat</p>
                <p>• Jika Anda merasa dalam krisis, segera hubungi layanan darurat atau profesional kesehatan mental</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Screenings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Screening Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentScreenings.map((screening, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{screening.type}</span>
                      <span className="text-lg font-bold">{screening.score}</span>
                    </div>
                    <p className={`text-sm font-medium ${screening.color}`}>{screening.severity}</p>
                    <p className="text-xs text-gray-500">{screening.date}</p>
                  </div>
                ))}
                <Link href="/progress">
                  <Button variant="outline" className="w-full">
                    Lihat Semua Hasil
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Crisis Support */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Butuh Bantuan Segera?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">
                  Jika Anda memiliki pikiran untuk menyakiti diri sendiri atau orang lain, segera hubungi:
                </p>
                <div className="space-y-2 text-sm text-red-700">
                  <p>• Hotline 119 ext 8</p>
                  <p>• WhatsApp: 081-111-500-755</p>
                  <p>• IGD Rumah Sakit terdekat</p>
                </div>
                <Button className="w-full mt-3 bg-red-600 hover:bg-red-700">
                  Hubungi Sekarang
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smile className="w-5 h-5 mr-2 text-green-600" />
                  Tips Sebelum Screening
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Cari tempat yang tenang dan nyaman</p>
                <p>• Sisihkan waktu 10-15 menit</p>
                <p>• Jawab berdasarkan perasaan 2 minggu terakhir</p>
                <p>• Jangan terburu-buru, baca setiap pertanyaan dengan teliti</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}