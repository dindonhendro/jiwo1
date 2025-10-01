import Link from "next/link";
import { ArrowUpRight, Check, Heart, Shield, Users, Brain, Zap, Clock } from "lucide-react";

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
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="mb-8">
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#756657]/10 to-[#756657]/5 text-[#756657] rounded-full text-sm font-medium mb-6 border border-[#756657]/20">
                  <Brain className="w-4 h-4 mr-2" />
                  SELF Therapy Berbasis AI - Cepat, Mudah, Terjangkau & Privat
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#161413] dark:text-[#eeedec] mb-8 tracking-tight leading-tight">
                Terapi{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#756657] to-[#756657]/70">
                  AI Mandiri
                </span>{" "}
                Kapan Saja, Di Mana Saja
              </h1>

              <p className="text-xl sm:text-2xl text-[#7a736c] dark:text-[#a19991] mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Dapatkan dukungan kesehatan mental instan dengan AI terapis yang tersedia 24/7. 
                Privat, terjangkau, dan mudah diakses dari mana saja.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-[#161413] dark:text-[#eeedec]">Akses Instan</span>
                </div>
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-[#161413] dark:text-[#eeedec]">100% Privat</span>
                </div>
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-[#161413] dark:text-[#eeedec]">Terjangkau</span>
                </div>
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-[#161413] dark:text-[#eeedec]">24/7 Siap</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-[#756657] to-[#756657]/90 rounded-lg hover:from-[#756657]/90 hover:to-[#756657]/80 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Mulai Terapi AI Gratis
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>

                <Link
                  href="/sign-in"
                  className="inline-flex items-center px-8 py-4 text-[#161413] dark:text-[#eeedec] bg-white dark:bg-[#302d2a] border-2 border-[#756657]/20 rounded-lg hover:bg-[#f7f7f7] dark:hover:bg-[#302d2a]/80 hover:border-[#756657]/40 transition-colors text-lg font-semibold"
                >
                  Masuk
                </Link>
              </div>

              <p className="text-sm text-[#7a736c] dark:text-[#a19991]">
                ✓ Tanpa antrian ✓ Tanpa jadwal ✓ Tanpa biaya tersembunyi
              </p>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&q=80" 
                  alt="Kebahagiaan dan kesehatan mental - seorang wanita tersenyum bahagia di alam terbuka"
                  className="w-full h-[500px] object-cover"
                />
                {/* Overlay with AI indicator */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-800">AI Terapis Online</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Siap membantu Anda mencapai kebahagiaan</p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}