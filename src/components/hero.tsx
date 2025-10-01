import Link from "next/link";
import { ArrowUpRight, Check, Heart, Shield, Users } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#f7f7f7] via-white to-[#f7f7f7] dark:from-[#1b1918] dark:via-[#302d2a] dark:to-[#1b1918]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#756657] rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-[#756657]/60 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-[#756657]/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-[#756657]/10 text-[#756657] rounded-full text-sm font-medium mb-6">
                <Heart className="w-4 h-4 mr-2" />
                Platform Dukungan Kesehatan Mental Jiwo.AI
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#161413] dark:text-[#eeedec] mb-8 tracking-tight leading-tight">
              Perjalanan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#756657] to-[#756657]/70">
                Kesehatan Mental
              </span>{" "}
              Anda Dimulai Di Sini
            </h1>

            <p className="text-xl sm:text-2xl text-[#7a736c] dark:text-[#a19991] mb-12 max-w-3xl mx-auto leading-relaxed">
              Terhubung dengan profesional berlisensi, lacak kemajuan Anda, dan
              akses dukungan kesehatan mental yang dipersonalisasi kapan pun Anda membutuhkannya.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-white bg-[#756657] rounded-lg hover:bg-[#756657]/90 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Mulai Perjalanan Anda
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/sign-in"
                className="inline-flex items-center px-8 py-4 text-[#161413] dark:text-[#eeedec] bg-white dark:bg-[#302d2a] border-2 border-[#756657]/20 rounded-lg hover:bg-[#f7f7f7] dark:hover:bg-[#302d2a]/80 hover:border-[#756657]/40 transition-colors text-lg font-semibold"
              >
                Masuk
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#756657]/10 rounded-full flex items-center justify-center mb-3">
                  <Check className="w-6 h-6 text-[#756657]" />
                </div>
                <span className="text-[#7a736c] dark:text-[#a19991] font-medium">
                  Kepatuhan HIPAA & Aman
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#756657]/10 rounded-full flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-[#756657]" />
                </div>
                <span className="text-[#7a736c] dark:text-[#a19991] font-medium">
                  Profesional Berlisensi
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#756657]/10 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-[#756657]" />
                </div>
                <span className="text-[#7a736c] dark:text-[#a19991] font-medium">
                  Dukungan Krisis 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}