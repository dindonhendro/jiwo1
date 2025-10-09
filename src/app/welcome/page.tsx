"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Brain, MessageCircle, BookOpen, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#756657] to-[#756657]/80 opacity-10"></div>
        <div className="max-w-6xl mx-auto px-6 py-20 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Selamat Datang di Jiwo.AI! 🎉
            </h1>
            
            <p className="text-xl text-gray-600 mb-2">
              Halo, <span className="font-semibold text-[#756657]">{user.user_metadata?.nickname || user.email}</span>!
            </p>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Akun Anda telah berhasil diverifikasi. Mari mulai perjalanan kesehatan mental Anda dengan AI terapis kami yang siap membantu 24/7.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-[#756657] hover:bg-[#756657]/90 text-white px-8 py-6 text-lg">
                  <Brain className="w-5 h-5 mr-2" />
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Langkah Pertama Anda
          </h2>
          <p className="text-lg text-gray-600">
            Ikuti panduan singkat ini untuk memaksimalkan pengalaman Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-[#756657]/20 hover:border-[#756657]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-[#756657] to-[#756657]/80 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-[#756657]">1. Screening</CardTitle>
              <CardDescription>
                Mulai dengan asesmen kesehatan mental untuk memahami kondisi Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/screening">
                <Button variant="outline" className="w-full border-[#756657]/20 hover:bg-[#756657]/10">
                  Mulai Screening
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-[#756657]/20 hover:border-[#756657]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-purple-600">2. SFBT Chat</CardTitle>
              <CardDescription>
                Berbicara dengan AI terapis menggunakan Solution-Focused Brief Therapy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sfbt-chat">
                <Button variant="outline" className="w-full border-purple-600/20 hover:bg-purple-600/10">
                  Mulai Chat
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-[#756657]/20 hover:border-[#756657]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-blue-600">3. Journaling</CardTitle>
              <CardDescription>
                Tulis jurnal harian dan dapatkan analisis sentimen otomatis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/journal">
                <Button variant="outline" className="w-full border-blue-600/20 hover:bg-blue-600/10">
                  Tulis Jurnal
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-[#756657]/20 hover:border-[#756657]/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-green-600">4. Progress</CardTitle>
              <CardDescription>
                Pantau perkembangan kesehatan mental Anda dari waktu ke waktu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/progress">
                <Button variant="outline" className="w-full border-green-600/20 hover:bg-green-600/10">
                  Lihat Progress
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Highlight */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan Kami
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#756657] to-[#756657]/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Terapis 24/7</h3>
              <p className="text-gray-600">
                Akses terapi kapan saja tanpa antrian dengan AI yang empati dan memahami
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#756657] to-[#756657]/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Screening Lengkap</h3>
              <p className="text-gray-600">
                PHQ-9, GAD-7, dan berbagai asesmen kesehatan mental lainnya
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#756657] to-[#756657]/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tracking Progress</h3>
              <p className="text-gray-600">
                Visualisasi perkembangan kesehatan mental dengan grafik dan laporan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#756657] to-[#756657]/90 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Memulai Perjalanan Anda?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Jangan tunda lagi. Kesehatan mental Anda adalah prioritas.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-[#756657] hover:bg-gray-100 px-8 py-6 text-lg">
              <Brain className="w-5 h-5 mr-2" />
              Ke Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-600">
          Butuh bantuan? Hubungi kami di{" "}
          <a href="mailto:support@jiwo.ai" className="text-[#756657] hover:underline">
            support@jiwo.ai
          </a>
        </p>
      </div>
    </div>
  );
}
