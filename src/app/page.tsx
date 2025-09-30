import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Heart,
  MessageCircle,
  Shield,
  Users,
  Brain,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Dukungan Kesehatan Mental Komprehensif
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Platform kami menyediakan alat berbasis bukti dan dukungan profesional 
              untuk membantu perjalanan kesehatan mental Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Skrining Kesehatan Mental",
                description:
                  "Penilaian komprehensif dengan wawasan dan rekomendasi yang dipersonalisasi",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Jurnal Harian",
                description:
                  "Lacak pikiran dan emosi Anda dengan analisis sentimen bertenaga AI",
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Chat Profesional",
                description:
                  "Komunikasi real-time dengan profesional kesehatan mental berlisensi",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Dukungan Krisis",
                description:
                  "Deteksi krisis 24/7 dan intervensi profesional segera",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="text-center">
                  <div className="text-blue-600 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Cara Kerja
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Langkah sederhana untuk memulai perjalanan kesehatan mental Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Daftar & Pilih Peran Anda",
                description:
                  "Buat akun Anda dan pilih apakah Anda mencari dukungan atau Anda adalah profesional kesehatan mental",
              },
              {
                step: "2",
                title: "Lengkapi Penilaian Anda",
                description:
                  "Ikuti skrining komprehensif kami untuk memahami status kesehatan mental Anda saat ini",
              },
              {
                step: "3",
                title: "Akses Dukungan Personal",
                description:
                  "Dapatkan pencocokan dengan profesional, lacak kemajuan, dan akses sumber daya yang disesuaikan",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Membuat Dampak Nyata</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Platform kami membantu orang di seluruh dunia meningkatkan 
              kesehatan mental mereka
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Pengguna Aktif</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Profesional Berlisensi</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Dukungan Krisis</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Kepuasan Pengguna</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Mengapa Memilih Platform Kami
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pendekatan berbasis bukti dengan teknologi mutakhir
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Kepatuhan HIPAA",
                description:
                  "Privasi dan keamanan data Anda adalah prioritas utama kami",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Dukungan Real-time",
                description:
                  "Akses instan ke profesional saat Anda paling membutuhkannya",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Profesional Berlisensi",
                description: "Terhubung dengan ahli kesehatan mental terverifikasi",
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: "Wawasan Bertenaga AI",
                description: "Analitik canggih untuk melacak kemajuan Anda",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Perawatan Personal",
                description: "Rencana perawatan yang disesuaikan berdasarkan kebutuhan Anda",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Berbasis Bukti",
                description: "Perawatan yang didukung oleh penelitian ilmiah",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="text-blue-600 mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Mulai Perjalanan Kesehatan Mental Anda Hari Ini
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Ambil langkah pertama menuju kesehatan mental yang lebih baik. 
            Bergabunglah dengan ribuan orang yang telah mengubah hidup mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={user ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center px-8 py-4 text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              {user ? "Ke Dashboard" : "Mulai Gratis"}
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center px-8 py-4 text-white border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
          <p className="text-blue-100 text-sm mt-6">
            ✓ Tidak perlu kartu kredit ✓ Kepatuhan HIPAA ✓ Dukungan 24/7
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}