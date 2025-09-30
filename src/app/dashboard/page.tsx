import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Brain, 
  BookOpen, 
  MessageCircle, 
  TrendingUp, 
  Calendar, 
  Heart, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Target,
  Apple,
  Flower2,
  Palette,
  Video,
  MapPin
} from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const upcomingAppointments = [
    {
      id: 1,
      professional: "Dr. Sarah Johnson",
      type: "Sesi Terapi",
      date: "Hari ini, 15:00",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    {
      id: 2,
      professional: "Dr. Michael Chen",
      type: "Check-in",
      date: "Besok, 10:00", 
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael"
    }
  ];

  const recentActivity = [
    { type: "journal", text: "Menyelesaikan entri jurnal harian", time: "2 jam lalu" },
    { type: "assessment", text: "Menyelesaikan skrining kecemasan", time: "1 hari lalu" },
    { type: "chat", text: "Mengirim pesan ke Dr. Johnson", time: "2 hari lalu" }
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat datang kembali!</h1>
            <p className="text-gray-600">Berikut ringkasan perjalanan kesehatan mental Anda</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Suasana Hati Saat Ini</p>
                    <p className="text-2xl font-bold text-green-600">Baik</p>
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
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Skor Kemajuan</p>
                    <p className="text-2xl font-bold text-purple-600">78%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sesi Berikutnya</p>
                    <p className="text-2xl font-bold text-orange-600">Hari Ini</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                  <CardDescription>Akses fitur yang paling sering Anda gunakan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/screening">
                      <Button className="h-20 flex-col space-y-2 bg-blue-600 hover:bg-blue-700 w-full">
                        <Brain className="w-6 h-6" />
                        <span className="text-sm">Ambil Penilaian</span>
                      </Button>
                    </Link>
                    <Link href="/journal">
                      <Button className="h-20 flex-col space-y-2 bg-purple-600 hover:bg-purple-700 w-full">
                        <BookOpen className="w-6 h-6" />
                        <span className="text-sm">Tulis Jurnal</span>
                      </Button>
                    </Link>
                    <Link href="/chat">
                      <Button className="h-20 flex-col space-y-2 bg-green-600 hover:bg-green-700 w-full">
                        <MessageCircle className="w-6 h-6" />
                        <span className="text-sm">Chat Sekarang</span>
                      </Button>
                    </Link>
                    <Link href="/progress">
                      <Button className="h-20 flex-col space-y-2 bg-orange-600 hover:bg-orange-700 w-full">
                        <TrendingUp className="w-6 h-6" />
                        <span className="text-sm">Lihat Kemajuan</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Treatment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-pink-600" />
                    Metode Perawatan
                  </CardTitle>
                  <CardDescription>Pilih dari pendekatan perawatan komprehensif kami</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Psikiater */}
                    <Link href="/treatment/book?method=psychiatrist">
                      <div className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">Psikiater</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                <Video className="w-3 h-3 mr-1" />
                                Online
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                Tatap Muka
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">Perawatan medis & manajemen obat</p>
                      </div>
                    </Link>

                    {/* Psikolog */}
                    <Link href="/treatment/book?method=psychologist">
                      <div className="p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">Psikolog</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                <Video className="w-3 h-3 mr-1" />
                                Online
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                Tatap Muka
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">Terapi bicara & intervensi perilaku</p>
                      </div>
                    </Link>

                    {/* Health Nutrisi */}
                    <Link href="/treatment/book?method=nutrition">
                      <div className="p-4 border rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <Apple className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">Health Nutrisi</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                <Video className="w-3 h-3 mr-1" />
                                Online
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                Tatap Muka
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">Terapi nutrisi untuk kesehatan mental</p>
                      </div>
                    </Link>

                    {/* Life Coaching */}
                    <Link href="/treatment/book?method=life-coaching">
                      <div className="p-4 border rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">Life Coaching</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                <Video className="w-3 h-3 mr-1" />
                                Online
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                Tatap Muka
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">Coaching berorientasi tujuan & pertumbuhan pribadi</p>
                      </div>
                    </Link>

                    {/* Holistik Yoga */}
                    <Link href="/treatment/book?method=holistic-yoga">
                      <div className="p-4 border rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                            <Flower2 className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">Holistik Yoga</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                Tatap Muka Saja
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">Penyembuhan pikiran-tubuh melalui yoga terapeutik</p>
                      </div>
                    </Link>

                    {/* Art Therapy */}
                    <Link href="/treatment/book?method=art-therapy">
                      <div className="p-4 border rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                            <Palette className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">Art Therapy</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                Tatap Muka Saja
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">Terapi seni kreatif untuk ekspresi emosional</p>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Link href="/treatment">
                      <Button variant="outline" className="w-full">
                        Lihat Semua Opsi Perawatan
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Kemajuan Anda Minggu Ini
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Entri Jurnal Harian</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                        <span className="text-sm font-bold">7/7</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sesi Terapi</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '66%'}}></div>
                        </div>
                        <span className="text-sm font-bold">2/3</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Menit Mindfulness</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '80%'}}></div>
                        </div>
                        <span className="text-sm font-bold">120/150</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Sesi Mendatang
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={appointment.avatar} />
                        <AvatarFallback>{appointment.professional.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{appointment.professional}</p>
                        <p className="text-xs text-gray-500">{appointment.type}</p>
                        <p className="text-xs text-blue-600">{appointment.date}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Jadwalkan Sesi Baru
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    Aktivitas Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Crisis Support */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Dukungan Krisis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700 mb-3">
                    Jika Anda mengalami krisis kesehatan mental, bantuan tersedia 24/7.
                  </p>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Dapatkan Bantuan Segera
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}