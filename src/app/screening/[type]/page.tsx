"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, Brain, Heart, Smile } from "lucide-react";
import Link from "next/link";

const screeningData = {
  phq9: {
    name: "Depression Screening",
    title: "Skrining Depresi",
    description: "Evaluasi gejala depresi dan suasana hati yang rendah",
    icon: Brain,
    color: "bg-blue-600",
    questions: [
      "Sedikit minat atau kesenangan dalam melakukan sesuatu",
      "Merasa sedih, tertekan, atau putus asa",
      "Kesulitan tidur atau tidur terlalu banyak",
      "Merasa lelah atau kurang energi",
      "Nafsu makan buruk atau makan berlebihan",
      "Merasa buruk tentang diri sendiri atau merasa gagal",
      "Kesulitan berkonsentrasi",
      "Bergerak atau berbicara sangat lambat atau sebaliknya gelisah",
      "Pikiran bahwa Anda lebih baik mati atau menyakiti diri sendiri"
    ]
  },
  gad7: {
    name: "Anxiety Screening", 
    title: "Skrining Kecemasan",
    description: "Penilaian tingkat kecemasan dan kekhawatiran berlebihan",
    icon: Heart,
    color: "bg-purple-600",
    questions: [
      "Merasa gugup, cemas, atau tegang",
      "Tidak dapat menghentikan atau mengontrol kekhawatiran",
      "Terlalu khawatir tentang berbagai hal",
      "Kesulitan untuk rileks",
      "Sangat gelisah sehingga sulit untuk duduk diam",
      "Mudah terganggu atau mudah marah",
      "Merasa takut seolah-olah sesuatu yang mengerikan akan terjadi"
    ]
  },
  gds15: {
    name: "Geriatric Depression Screening",
    title: "Skrining Depresi Lansia", 
    description: "Evaluasi khusus depresi untuk usia lanjut (65+ tahun)",
    icon: Smile,
    color: "bg-green-600",
    questions: [
      "Apakah Anda puas dengan hidup Anda?",
      "Apakah Anda telah mengurangi banyak aktivitas dan minat Anda?",
      "Apakah Anda merasa hidup Anda kosong?",
      "Apakah Anda sering merasa bosan?",
      "Apakah Anda memiliki semangat yang baik sebagian besar waktu?",
      "Apakah Anda takut bahwa sesuatu yang buruk akan terjadi pada Anda?",
      "Apakah Anda merasa bahagia sebagian besar waktu?",
      "Apakah Anda sering merasa tidak berdaya?",
      "Apakah Anda lebih suka tinggal di rumah daripada keluar dan melakukan hal-hal baru?",
      "Apakah Anda merasa memiliki lebih banyak masalah dengan ingatan dibandingkan kebanyakan orang?",
      "Apakah Anda pikir hidup ini indah?",
      "Apakah Anda merasa tidak berharga seperti sekarang ini?",
      "Apakah Anda merasa penuh energi?",
      "Apakah Anda merasa situasi Anda tidak ada harapan?",
      "Apakah Anda pikir kebanyakan orang lebih baik daripada Anda?"
    ]
  },
  epds: {
    name: "Postnatal Problem Screening",
    title: "Skrining Masalah Pasca Melahirkan",
    description: "Evaluasi kondisi mental ibu setelah melahirkan",
    icon: Heart,
    color: "bg-pink-600",
    questions: [
      "Saya dapat tertawa dan melihat sisi lucu dari sesuatu",
      "Saya menantikan sesuatu dengan senang hati",
      "Saya menyalahkan diri sendiri tanpa perlu ketika ada yang salah",
      "Saya cemas atau khawatir tanpa alasan yang jelas",
      "Saya merasa takut atau panik tanpa alasan yang jelas",
      "Hal-hal telah menumpuk pada saya",
      "Saya sangat tidak bahagia sehingga sulit tidur",
      "Saya merasa sedih atau sengsara",
      "Saya sangat tidak bahagia sehingga saya menangis",
      "Pikiran untuk menyakiti diri sendiri telah terjadi pada saya"
    ]
  }
};

const answerOptions = [
  { value: "0", label: "Tidak sama sekali" },
  { value: "1", label: "Beberapa hari" },
  { value: "2", label: "Lebih dari setengah hari" },
  { value: "3", label: "Hampir setiap hari" }
];

export default function ScreeningTypePage() {
  const params = useParams();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const screeningType = params.type as string;
  const screening = screeningData[screeningType as keyof typeof screeningData];
  
  if (!screening) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-semibold mb-2">Screening tidak ditemukan</h2>
            <p className="text-gray-600 mb-4">Jenis screening yang Anda cari tidak tersedia.</p>
            <Link href="/screening">
              <Button>Kembali ke Screening</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const IconComponent = screening.icon;
  const progress = ((currentQuestion + 1) / screening.questions.length) * 100;

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < screening.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/sign-in');
        return;
      }

      // Calculate total score
      const totalScore = Object.values(answers).reduce((sum, answer) => sum + parseInt(answer), 0);
      
      // Map screening types to database format
      const typeMapping = {
        'phq9': 'PHQ-9',
        'gad7': 'GAD-7',
        'gds15': 'GDS-15',
        'epds': 'EPDS'
      };
      
      // Determine severity based on score and screening type (Indonesian labels)
      let severity = 'Minimal';
      if (screeningType === 'phq9') {
        if (totalScore >= 20) severity = 'Berat';
        else if (totalScore >= 15) severity = 'Sedang';
        else if (totalScore >= 10) severity = 'Sedang';
        else if (totalScore >= 5) severity = 'Ringan';
        else severity = 'Minimal';
      } else if (screeningType === 'gad7') {
        if (totalScore >= 15) severity = 'Berat';
        else if (totalScore >= 10) severity = 'Sedang';
        else if (totalScore >= 5) severity = 'Ringan';
        else severity = 'Minimal';
      }
      
      // Save to database with correct format
      const { error } = await supabase
        .from('screenings')
        .insert({
          user_id: user.id,
          type: typeMapping[screeningType as keyof typeof typeMapping] || screeningType.toUpperCase(),
          answers: answers,
          score: totalScore,
          severity: severity,
          condition: screeningType === 'phq9' ? 'Depresi' : screeningType === 'gad7' ? 'Kecemasan' : 'Lainnya'
        });

      if (error) {
        console.error('Error saving screening:', error);
        alert('Terjadi kesalahan saat menyimpan hasil screening: ' + error.message);
        return;
      }

      // Redirect to results page instead of dashboard
      router.push('/screening/results');
      
    } catch (error) {
      console.error('Error submitting screening:', error);
      alert('Terjadi kesalahan saat mengirim screening');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastQuestion = currentQuestion === screening.questions.length - 1;
  const canProceed = answers[currentQuestion] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/screening">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${screening.color} rounded-full flex items-center justify-center`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{screening.name}</h1>
              <p className="text-sm text-gray-600">{screening.title}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">
                {currentQuestion + 1} dari {screening.questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Pertanyaan {currentQuestion + 1}
            </CardTitle>
            <CardDescription>
              Dalam 2 minggu terakhir, seberapa sering Anda terganggu oleh masalah berikut:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-6">
              {screening.questions[currentQuestion]}
            </h3>
            
            <RadioGroup
              value={answers[currentQuestion] || ""}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {answerOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sebelumnya
          </Button>
          
          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                "Menyimpan..."
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Selesai
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
            >
              Selanjutnya
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Help Text */}
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800">
              <strong>Catatan:</strong> Jawablah dengan jujur berdasarkan perasaan Anda dalam 2 minggu terakhir. 
              Tidak ada jawaban yang benar atau salah.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}