"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle2, AlertCircle, TrendingUp, Clock, Heart, Moon, Zap } from "lucide-react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";

const MENTAL_HEALTH_CONDITIONS = [
  {
    id: "anxiety",
    name: "Kecemasan",
    description: "Kecemasan umum, kekhawatiran, dan gugup",
    icon: Heart,
    color: "bg-yellow-500",
    duration: "5-7 menit"
  },
  {
    id: "depression", 
    name: "Depresi",
    description: "Suasana hati, minat, dan tingkat energi",
    icon: Brain,
    color: "bg-blue-500",
    duration: "5-7 menit"
  },
  {
    id: "sleep",
    name: "Masalah Tidur/Insomnia",
    description: "Kualitas dan pola tidur",
    icon: Moon,
    color: "bg-purple-500",
    duration: "3-5 menit"
  },
  {
    id: "stress",
    name: "Stres",
    description: "Stres harian dan mekanisme koping",
    icon: Zap,
    color: "bg-red-500",
    duration: "4-6 menit"
  },
  {
    id: "burnout",
    name: "Burnout",
    description: "Kelelahan dan sinisme terkait pekerjaan",
    icon: TrendingUp,
    color: "bg-orange-500",
    duration: "6-8 menit"
  },
  {
    id: "adhd",
    name: "ADHD",
    description: "Gejala perhatian dan hiperaktivitas",
    icon: Brain,
    color: "bg-green-500",
    duration: "8-10 menit"
  },
  {
    id: "panic",
    name: "Gangguan Panik",
    description: "Serangan panik dan kecemasan terkait",
    icon: Heart,
    color: "bg-red-600",
    duration: "5-7 menit"
  },
  {
    id: "schizophrenia",
    name: "Skizofrenia",
    description: "Skrining gejala psikotik",
    icon: Brain,
    color: "bg-gray-600",
    duration: "10-12 menit"
  },
  {
    id: "substance",
    name: "Gangguan Penggunaan Zat",
    description: "Pola penggunaan alkohol dan obat-obatan",
    icon: AlertCircle,
    color: "bg-amber-600",
    duration: "6-8 menit"
  },
  {
    id: "bipolar",
    name: "Gangguan Mood Bipolar",
    description: "Perubahan suasana hati dan episode manik",
    icon: TrendingUp,
    color: "bg-indigo-500",
    duration: "8-10 menit"
  },
  {
    id: "postpartum",
    name: "Depresi Postpartum",
    description: "Depresi setelah melahirkan",
    icon: Heart,
    color: "bg-pink-500",
    duration: "5-7 menit"
  },
  {
    id: "social-anxiety",
    name: "Kecemasan Sosial",
    description: "Ketakutan terhadap situasi sosial",
    icon: Heart,
    color: "bg-teal-500",
    duration: "5-7 menit"
  },
  {
    id: "phobia",
    name: "Fobia",
    description: "Ketakutan spesifik dan penghindaran",
    icon: AlertCircle,
    color: "bg-violet-500",
    duration: "4-6 menit"
  }
];

const PHQ9_QUESTIONS = [
  "Sedikit minat atau kesenangan dalam melakukan hal-hal",
  "Merasa sedih, depresi, atau putus asa", 
  "Kesulitan tertidur atau tetap tidur, atau tidur terlalu banyak",
  "Merasa lelah atau memiliki sedikit energi",
  "Nafsu makan buruk atau makan berlebihan",
  "Merasa buruk tentang diri sendiri atau merasa gagal atau mengecewakan diri sendiri atau keluarga",
  "Kesulitan berkonsentrasi pada hal-hal, seperti membaca koran atau menonton televisi",
  "Bergerak atau berbicara sangat lambat sehingga orang lain bisa menyadarinya. Atau sebaliknya sangat gelisah atau resah sehingga bergerak lebih banyak dari biasanya",
  "Pikiran bahwa Anda lebih baik mati, atau menyakiti diri sendiri"
];

const ANSWER_OPTIONS = [
  { value: 0, label: "Tidak sama sekali" },
  { value: 1, label: "Beberapa hari" },
  { value: 2, label: "Lebih dari setengah hari" },
  { value: 3, label: "Hampir setiap hari" }
];

const getSeverityLevel = (score: number) => {
  if (score <= 4) return "Minimal";
  if (score <= 9) return "Ringan";
  if (score <= 14) return "Sedang";
  return "Berat";
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Minimal": return "text-green-600 bg-green-50 border-green-200";
    case "Ringan": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "Sedang": return "text-orange-600 bg-orange-50 border-orange-200";
    case "Berat": return "text-red-600 bg-red-50 border-red-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

export default function ScreeningPage() {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{score: number, severity: string, condition: string} | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleConditionSelect = (conditionId: string) => {
    if (conditionId === "depression") {
      setSelectedCondition(conditionId);
    } else {
      // For other conditions, show coming soon message
      alert(`Skrining ${MENTAL_HEALTH_CONDITIONS.find(c => c.id === conditionId)?.name} akan segera hadir! Saat ini, kami menyediakan skrining Depresi PHQ-9.`);
    }
  };

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const isComplete = answers.every(answer => answer !== -1);

  const handleSubmit = async () => {
    if (!isComplete) return;

    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      const score = answers.reduce((sum, answer) => sum + answer, 0);
      const severity = getSeverityLevel(score);

      // Save to Supabase
      const { error: dbError } = await supabase
        .from('screenings')
        .insert({
          user_id: user.id,
          type: 'PHQ-9',
          score,
          answers,
          severity
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Gagal menyimpan hasil skrining');
      }

      // Call n8n webhook
      try {
        await fetch('/webhook/screening', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            type: 'PHQ-9',
            score,
            answers
          })
        });
      } catch (webhookError) {
        console.warn('Webhook call failed:', webhookError);
        // Continue even if webhook fails
      }

      setResult({ score, severity, condition: "Depresi" });
    } catch (error) {
      console.error('Submission error:', error);
      alert('Gagal mengirim skrining. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToSelection = () => {
    setSelectedCondition(null);
    setAnswers(new Array(9).fill(-1));
    setResult(null);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Skrining Selesai</h1>
            <p className="text-gray-600">Hasil penilaian {result.condition} Anda</p>
          </div>

          <Card className={`mb-6 border-2 ${getSeverityColor(result.severity)}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Skor Anda: {result.score}/27</CardTitle>
              <CardDescription className="text-lg font-semibold">
                Tingkat Keparahan Depresi: {result.severity}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${(result.score / 27) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <h3 className="font-semibold">Arti hasil ini:</h3>
                {result.severity === "Minimal" && (
                  <p>Respons Anda menunjukkan gejala depresi minimal. Terus pantau kesehatan mental Anda dan pertahankan kebiasaan sehat.</p>
                )}
                {result.severity === "Ringan" && (
                  <p>Respons Anda menunjukkan gejala depresi ringan. Pertimbangkan untuk berbicara dengan profesional kesehatan mental dan menerapkan strategi perawatan diri.</p>
                )}
                {result.severity === "Sedang" && (
                  <p>Respons Anda menunjukkan gejala depresi sedang. Kami merekomendasikan konsultasi dengan profesional kesehatan mental untuk evaluasi dan pilihan perawatan yang tepat.</p>
                )}
                {result.severity === "Berat" && (
                  <p>Respons Anda menunjukkan gejala depresi berat. Harap segera cari bantuan profesional. Pertimbangkan untuk menghubungi layanan krisis kesehatan mental jika Anda memiliki pikiran untuk menyakiti diri sendiri.</p>
                )}
              </div>

              {result.severity === "Berat" && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 text-red-800">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">Dukungan Krisis Tersedia</span>
                    </div>
                    <p className="text-red-700 text-sm mt-2">
                      Jika Anda memiliki pikiran untuk menyakiti diri sendiri, harap segera hubungi layanan krisis kesehatan mental atau rumah sakit terdekat.
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="flex-1"
            >
              Kembali ke Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={resetToSelection}
              className="flex-1"
            >
              Ambil Skrining Lain
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCondition === "depression") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={resetToSelection}
              className="mb-4"
            >
              ← Kembali ke Pilihan Kondisi
            </Button>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Skrining Depresi PHQ-9</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selama 2 minggu terakhir, seberapa sering Anda terganggu oleh masalah-masalah berikut?
            </p>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(answers.filter(a => a !== -1).length / 9) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {answers.filter(a => a !== -1).length} dari 9 pertanyaan selesai
            </p>
          </div>

          <div className="space-y-6">
            {PHQ9_QUESTIONS.map((question, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {index + 1}. {question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ANSWER_OPTIONS.map((option) => (
                      <label 
                        key={option.value} 
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option.value}
                          checked={answers[index] === option.value}
                          onChange={() => handleAnswerChange(index, option.value)}
                          className="text-blue-600"
                        />
                        <span className="flex-1">{option.label}</span>
                        <span className="text-sm text-gray-500">({option.value} poin)</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Mengirim..." : "Selesaikan Penilaian"}
            </Button>
            {!isComplete && (
              <p className="text-sm text-gray-500 mt-2">
                Harap jawab semua pertanyaan untuk melanjutkan
              </p>
            )}
          </div>

          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Tentang PHQ-9</p>
                  <p>
                    Patient Health Questionnaire-9 (PHQ-9) adalah alat skrining yang tervalidasi untuk depresi. 
                    Respons Anda bersifat rahasia dan akan membantu kami memberikan dukungan yang dipersonalisasi.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main condition selection page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skrining Kesehatan Mental</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pilih kondisi kesehatan mental untuk diskrining. Penilaian tervalidasi kami membantu mengidentifikasi gejala dan memberikan rekomendasi yang dipersonalisasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENTAL_HEALTH_CONDITIONS.map((condition) => {
            const IconComponent = condition.icon;
            return (
              <Card 
                key={condition.id}
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300"
                onClick={() => handleConditionSelect(condition.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${condition.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{condition.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{condition.duration}</span>
                        {condition.id !== "depression" && (
                          <Badge variant="secondary" className="text-xs">Segera Hadir</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {condition.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">Skrining Kesehatan Mental Profesional</p>
                <p className="mb-3">
                  Platform kami menyediakan alat skrining berbasis bukti untuk berbagai kondisi kesehatan mental. 
                  Penilaian ini dirancang untuk membantu mengidentifikasi gejala potensial dan mengarahkan Anda ke perawatan yang tepat.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-medium mb-1">Saat Ini Tersedia:</p>
                    <p>• Depresi (PHQ-9) - Skrining tervalidasi penuh</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Segera Hadir:</p>
                    <p>• Semua kondisi lain dengan penilaian khusus</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}