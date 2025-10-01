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
    id: "postnatal",
    name: "Postnatal Depression",
    description: "Depresi setelah melahirkan menggunakan EPDS",
    icon: Heart,
    color: "bg-pink-500",
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
    id: "geriatric",
    name: "Masalah Lansia (GDS-15)",
    description: "Skrining depresi untuk lansia menggunakan GDS-15",
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

const GAD7_QUESTIONS = [
  "Merasa gugup, cemas, atau tegang",
  "Tidak dapat menghentikan atau mengendalikan kekhawatiran",
  "Terlalu khawatir tentang berbagai hal",
  "Kesulitan untuk rileks",
  "Sangat gelisah sehingga sulit untuk duduk diam",
  "Mudah terganggu atau mudah tersinggung",
  "Merasa takut seolah-olah sesuatu yang mengerikan akan terjadi"
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

const GDS15_QUESTIONS = [
  "Apakah Anda puas dengan hidup Anda?",
  "Apakah Anda telah meninggalkan banyak kegiatan dan minat Anda?",
  "Apakah Anda merasa hidup Anda kosong?",
  "Apakah Anda sering merasa bosan?",
  "Apakah Anda memiliki semangat yang baik sebagian besar waktu?",
  "Apakah Anda takut bahwa sesuatu yang buruk akan terjadi pada Anda?",
  "Apakah Anda merasa bahagia sebagian besar waktu?",
  "Apakah Anda sering merasa tidak berdaya?",
  "Apakah Anda lebih suka tinggal di rumah daripada keluar dan melakukan hal-hal baru?",
  "Apakah Anda merasa memiliki lebih banyak masalah dengan ingatan daripada kebanyakan orang?",
  "Apakah Anda pikir hidup ini indah?",
  "Apakah Anda merasa tidak berharga seperti sekarang ini?",
  "Apakah Anda merasa penuh energi?",
  "Apakah Anda merasa situasi Anda tidak ada harapan?",
  "Apakah Anda pikir kebanyakan orang lebih baik daripada Anda?"
];

const EPDS_QUESTIONS = [
  "Saya dapat tertawa dan melihat sisi lucu dari berbagai hal",
  "Saya menantikan berbagai hal dengan penuh kegembiraan",
  "Saya menyalahkan diri sendiri tanpa perlu ketika hal-hal berjalan salah",
  "Saya cemas atau khawatir tanpa alasan yang jelas",
  "Saya merasa takut atau panik tanpa alasan yang jelas",
  "Berbagai hal membuat saya kewalahan",
  "Saya sangat tidak bahagia sehingga sulit tidur",
  "Saya merasa sedih atau sengsara",
  "Saya sangat tidak bahagia sehingga saya menangis",
  "Pikiran untuk menyakiti diri sendiri telah terjadi pada saya"
];

const ANSWER_OPTIONS = [
  { value: 0, label: "Tidak sama sekali" },
  { value: 1, label: "Beberapa hari" },
  { value: 2, label: "Lebih dari setengah hari" },
  { value: 3, label: "Hampir setiap hari" }
];

const GDS15_ANSWER_OPTIONS = [
  { value: 0, label: "Ya" },
  { value: 1, label: "Tidak" }
];

const EPDS_ANSWER_OPTIONS = [
  { value: 0, label: "Sama seperti biasanya" },
  { value: 1, label: "Tidak sebanyak sebelumnya" },
  { value: 2, label: "Jelas tidak sebanyak sebelumnya" },
  { value: 3, label: "Tidak sama sekali" }
];

const getSeverityLevel = (score: number, type: string) => {
  if (type === "GAD-7") {
    if (score <= 4) return "Minimal";
    if (score <= 9) return "Ringan";
    if (score <= 14) return "Sedang";
    return "Berat";
  } else if (type === "PHQ-9") {
    if (score <= 4) return "Minimal";
    if (score <= 9) return "Ringan";
    if (score <= 14) return "Sedang";
    return "Berat";
  } else if (type === "GDS-15") {
    if (score <= 4) return "Normal";
    if (score <= 9) return "Depresi Ringan";
    return "Depresi Berat";
  } else if (type === "EPDS") {
    if (score <= 9) return "Minimal";
    if (score <= 12) return "Ringan";
    return "Berat";
  }
  return "Minimal";
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Minimal":
    case "Normal":
      return "border-green-300 bg-green-50";
    case "Ringan":
    case "Depresi Ringan":
      return "border-yellow-300 bg-yellow-50";
    case "Sedang":
      return "border-orange-300 bg-orange-50";
    case "Berat":
    case "Depresi Berat":
      return "border-red-300 bg-red-50";
    default:
      return "border-gray-300 bg-gray-50";
  }
};

export default function ScreeningPage() {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{score: number, severity: string, condition: string, type: string} | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleConditionSelect = (conditionId: string) => {
    if (conditionId === "depression") {
      setSelectedCondition(conditionId);
      setAnswers(new Array(9).fill(-1));
    } else if (conditionId === "anxiety" || conditionId === "stress" || conditionId === "panic") {
      setSelectedCondition(conditionId);
      setAnswers(new Array(7).fill(-1));
    } else if (conditionId === "geriatric") {
      setSelectedCondition(conditionId);
      setAnswers(new Array(15).fill(-1));
    } else if (conditionId === "postnatal") {
      setSelectedCondition(conditionId);
      setAnswers(new Array(10).fill(-1));
    } else {
      // For other conditions, show coming soon message
      alert(`Skrining ${MENTAL_HEALTH_CONDITIONS.find(c => c.id === conditionId)?.name} akan segera hadir!`);
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
      let screeningType = "";
      let conditionName = "";
      
      if (selectedCondition === "depression") {
        screeningType = "PHQ-9";
        conditionName = "Depresi";
      } else if (selectedCondition === "anxiety") {
        screeningType = "GAD-7";
        conditionName = "Kecemasan";
      } else if (selectedCondition === "stress") {
        screeningType = "GAD-7";
        conditionName = "Stres";
      } else if (selectedCondition === "panic") {
        screeningType = "GAD-7";
        conditionName = "Gangguan Panik";
      } else if (selectedCondition === "geriatric") {
        screeningType = "GDS-15";
        conditionName = "Masalah Lansia";
      } else if (selectedCondition === "postnatal") {
        screeningType = "EPDS";
        conditionName = "Postnatal Depression";
      }
      
      const severity = getSeverityLevel(score, screeningType);

      // Save to Supabase
      const { error: dbError } = await supabase
        .from('screenings')
        .insert({
          user_id: user.id,
          type: screeningType,
          score,
          answers,
          severity,
          condition: conditionName
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Gagal menyimpan hasil skrining');
      }

      // Call n8n webhook
      try {
        await fetch('https://dindon.app.n8n.cloud/webhook/6f49e2fe-d2ff-427b-8e79-6628403ebb73', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            type: screeningType,
            score,
            answers,
            condition: conditionName,
            severity
          })
        });
      } catch (webhookError) {
        console.warn('Webhook call failed:', webhookError);
        // Continue even if webhook fails
      }

      setResult({ score, severity, condition: conditionName, type: screeningType });
    } catch (error) {
      console.error('Submission error:', error);
      alert('Gagal mengirim skrining. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToSelection = () => {
    setSelectedCondition(null);
    setAnswers([]);
    setResult(null);
  };

  // Show result if available
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-3xl mx-auto">
          <Card className={`mb-6 border-2 ${getSeverityColor(result.severity)}`}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                Skor Anda: {result.score}/{result.type === "PHQ-9" ? "27" : result.type === "GAD-7" ? "21" : result.type === "GDS-15" ? "15" : "30"}
              </CardTitle>
              <CardDescription className="text-lg font-semibold">
                Tingkat Keparahan {result.condition}: {result.severity}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${(result.score / (result.type === "PHQ-9" ? 27 : result.type === "GAD-7" ? 21 : result.type === "GDS-15" ? 15 : 30)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <h3 className="font-semibold">Arti hasil ini:</h3>
                {result.type === "PHQ-9" && (
                  <>
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
                  </>
                )}
                {result.type === "GAD-7" && (
                  <>
                    {result.severity === "Minimal" && (
                      <p>Respons Anda menunjukkan gejala kecemasan minimal. Terus pantau kesehatan mental Anda dan praktikkan teknik relaksasi secara teratur.</p>
                    )}
                    {result.severity === "Ringan" && (
                      <p>Respons Anda menunjukkan gejala kecemasan ringan. Pertimbangkan untuk mempelajari teknik manajemen stres dan berbicara dengan profesional jika gejala berlanjut.</p>
                    )}
                    {result.severity === "Sedang" && (
                      <p>Respons Anda menunjukkan gejala kecemasan sedang. Kami merekomendasikan konsultasi dengan profesional kesehatan mental untuk evaluasi dan strategi penanganan yang tepat.</p>
                    )}
                    {result.severity === "Berat" && (
                      <p>Respons Anda menunjukkan gejala kecemasan berat. Harap segera cari bantuan profesional. Kecemasan yang parah dapat mengganggu kehidupan sehari-hari dan memerlukan perawatan yang tepat.</p>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <Button onClick={resetToSelection} variant="outline" className="flex-1">
                  Lakukan Skrining Lain
                </Button>
                <Button onClick={() => router.push('/dashboard')} className="flex-1">
                  Kembali ke Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show specific screening forms
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

  if (selectedCondition === "anxiety" || selectedCondition === "stress" || selectedCondition === "panic") {
    const conditionNames = {
      anxiety: "Kecemasan",
      stress: "Stres", 
      panic: "Gangguan Panik"
    };
    
    const conditionName = conditionNames[selectedCondition as keyof typeof conditionNames];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={resetToSelection}
              className="mb-4"
            >
              ← Kembali ke Pilihan Kondisi
            </Button>
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Skrining {conditionName} GAD-7</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selama 2 minggu terakhir, seberapa sering Anda terganggu oleh masalah-masalah berikut?
            </p>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(answers.filter(a => a !== -1).length / 7) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {answers.filter(a => a !== -1).length} dari 7 pertanyaan selesai
            </p>
          </div>

          <div className="space-y-6">
            {GAD7_QUESTIONS.map((question, index) => (
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
                          className="text-yellow-600"
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
              className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
            >
              {isSubmitting ? "Mengirim..." : "Selesaikan Penilaian"}
            </Button>
            {!isComplete && (
              <p className="text-sm text-gray-500 mt-2">
                Harap jawab semua pertanyaan untuk melanjutkan
              </p>
            )}
          </div>

          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Tentang GAD-7</p>
                  <p>
                    Generalized Anxiety Disorder-7 (GAD-7) adalah alat skrining yang tervalidasi untuk kecemasan umum, stres, dan gangguan panik. 
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

  if (selectedCondition === "geriatric") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={resetToSelection}
              className="mb-4"
            >
              ← Kembali ke Pilihan Kondisi
            </Button>
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Skrining Depresi Lansia GDS-15</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Jawablah pertanyaan berikut berdasarkan perasaan Anda dalam 2 minggu terakhir.
            </p>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(answers.filter(a => a !== -1).length / 15) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {answers.filter(a => a !== -1).length} dari 15 pertanyaan selesai
            </p>
          </div>

          <div className="space-y-6">
            {GDS15_QUESTIONS.map((question, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {index + 1}. {question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {GDS15_ANSWER_OPTIONS.map((option) => (
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
                          className="text-indigo-600"
                        />
                        <span className="flex-1">{option.label}</span>
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
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Mengirim..." : "Selesaikan Penilaian"}
            </Button>
            {!isComplete && (
              <p className="text-sm text-gray-500 mt-2">
                Harap jawab semua pertanyaan untuk melanjutkan
              </p>
            )}
          </div>

          <Card className="mt-8 bg-indigo-50 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div className="text-sm text-indigo-800">
                  <p className="font-semibold mb-1">Tentang GDS-15</p>
                  <p>
                    Geriatric Depression Scale-15 (GDS-15) adalah alat skrining yang dirancang khusus untuk mendeteksi depresi pada lansia. 
                    Respons Anda bersifat rahasia dan akan membantu kami memberikan dukungan yang sesuai.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedCondition === "postnatal") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={resetToSelection}
              className="mb-4"
            >
              ← Kembali ke Pilihan Kondisi
            </Button>
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Skrining Postnatal Depression EPDS</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dalam 7 hari terakhir, seberapa sering Anda mengalami hal-hal berikut?
            </p>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pink-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(answers.filter(a => a !== -1).length / 10) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {answers.filter(a => a !== -1).length} dari 10 pertanyaan selesai
            </p>
          </div>

          <div className="space-y-6">
            {EPDS_QUESTIONS.map((question, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {index + 1}. {question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {EPDS_ANSWER_OPTIONS.map((option) => (
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
                          className="text-pink-600"
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
              className="px-8 py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
            >
              {isSubmitting ? "Mengirim..." : "Selesaikan Penilaian"}
            </Button>
            {!isComplete && (
              <p className="text-sm text-gray-500 mt-2">
                Harap jawab semua pertanyaan untuk melanjutkan
              </p>
            )}
          </div>

          <Card className="mt-8 bg-pink-50 border-pink-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-pink-600 mt-0.5" />
                <div className="text-sm text-pink-800">
                  <p className="font-semibold mb-1">Tentang EPDS</p>
                  <p>
                    Edinburgh Postnatal Depression Scale (EPDS) adalah alat skrining yang dirancang khusus untuk mendeteksi depresi postnatal pada ibu setelah melahirkan. 
                    Respons Anda bersifat rahasia dan akan membantu kami memberikan dukungan yang tepat.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main condition selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Skrining Kesehatan Mental</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih kondisi yang ingin Anda evaluasi. Semua skrining menggunakan alat yang tervalidasi secara klinis dan bersifat rahasia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {MENTAL_HEALTH_CONDITIONS.map((condition) => {
            const IconComponent = condition.icon;
            const isActive = condition.id === "depression" || condition.id === "anxiety" || condition.id === "stress" || condition.id === "panic" || condition.id === "geriatric" || condition.id === "postnatal";
            
            return (
              <Card 
                key={condition.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  isActive ? 'hover:border-blue-300 hover:bg-blue-50' : 'opacity-60 hover:opacity-80'
                }`}
                onClick={() => handleConditionSelect(condition.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 ${condition.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    {isActive && <Badge variant="secondary" className="bg-green-100 text-green-800">Tersedia</Badge>}
                    {!isActive && <Badge variant="secondary" className="bg-gray-100 text-gray-600">Segera</Badge>}
                  </div>
                  <CardTitle className="text-lg">{condition.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {condition.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{condition.duration}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <CheckCircle2 className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Informasi Penting</h3>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-medium mb-1">Saat Ini Tersedia:</p>
                    <p>• Depresi (PHQ-9) - Skrining tervalidasi penuh</p>
                    <p>• Kecemasan, Stres & Panik (GAD-7) - Skrining tervalidasi penuh</p>
                    <p>• Masalah Lansia (GDS-15) - Skrining tervalidasi penuh</p>
                    <p>• Postnatal Depression (EPDS) - Skrining tervalidasi penuh</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Segera Hadir:</p>
                    <p>• Kondisi lain dengan penilaian khusus</p>
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