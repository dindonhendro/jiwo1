"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Heart, Brain, Apple, Target, Flower2, Palette, ArrowLeft, Star, MapPin, DollarSign, FileText, Award, Clock, CalendarDays } from "lucide-react";
import { createClient } from "../../../../supabase/client";
import { useRouter } from "next/navigation";

const TREATMENT_METHODS = {
  "psychiatrist": { name: "Psikiater", icon: Brain, color: "bg-blue-600" },
  "psychologist": { name: "Psikolog", icon: Heart, color: "bg-purple-600" },
  "nutrition": { name: "Health Nutrisi", icon: Apple, color: "bg-green-600" },
  "life-coaching": { name: "Life Coaching", icon: Target, color: "bg-orange-600" },
  "holistic-yoga": { name: "Holistik Yoga", icon: Flower2, color: "bg-teal-600" },
  "art-therapy": { name: "Art Therapy", icon: Palette, color: "bg-pink-600" }
};

interface Professional {
  id: string;
  name: string;
  specialty: string;
  treatment_type: string;
  avatar: string;
  bio: string;
  experience_years: number;
  rating: number;
  price_per_session: number;
  available_online: boolean;
  available_offline: boolean;
  languages: string[];
}

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

export default function TreatmentBookingPage() {
  const [step, setStep] = useState<'method' | 'professional' | 'booking' | 'payment'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionType, setSessionType] = useState<'online' | 'offline'>('online');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const loadProfessionals = async (treatmentType: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('treatment_type', treatmentType)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error loading professionals:', error);
        // Add some mock data if database fails
        setProfessionals([
          {
            id: '1',
            name: 'Dr. Sarah Johnson',
            specialty: 'Clinical Psychology',
            treatment_type: treatmentType,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
            bio: 'Experienced clinical psychologist specializing in anxiety and depression treatment.',
            experience_years: 8,
            rating: 4.8,
            price_per_session: 500000,
            available_online: true,
            available_offline: true,
            languages: ['Indonesian', 'English']
          },
          {
            id: '2',
            name: 'Dr. Ahmad Rahman',
            specialty: 'Psychiatrist',
            treatment_type: treatmentType,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad',
            bio: 'Board-certified psychiatrist with expertise in mood disorders and therapy.',
            experience_years: 12,
            rating: 4.9,
            price_per_session: 750000,
            available_online: true,
            available_offline: false,
            languages: ['Indonesian']
          }
        ]);
      } else {
        setProfessionals(data || []);
      }
    } catch (error) {
      console.error('Error loading professionals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setStep('professional');
    loadProfessionals(method);
  };

  const handleBackToMethods = () => {
    setStep('method');
    setSelectedMethod('');
    setProfessionals([]);
  };

  const handleBackToProfessionals = () => {
    setStep('professional');
    setSelectedProfessional(null);
    setSelectedDate(undefined);
    setSelectedTime('');
  };

  const handleBackToBooking = () => {
    setStep('booking');
  };

  const handleBookProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setStep('booking');
  };

  const handleProceedToPayment = () => {
    if (selectedDate && selectedTime) {
      setStep('payment');
    }
  };

  const handleViewCV = (professional: Professional) => {
    alert(`Viewing CV for ${professional.name}\n\nSpecialty: ${professional.specialty}\nExperience: ${professional.experience_years} years\nRating: ${professional.rating}/5`);
  };

  const handleViewSpecialty = (professional: Professional) => {
    alert(`Specialty Details for ${professional.name}\n\n${professional.specialty}\n\n${professional.bio}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Method Selection Step
  if (step === 'method') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Treatment Session</h1>
            <p className="text-gray-600">Choose your preferred treatment method</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(TREATMENT_METHODS).map(([key, method]) => {
              const IconComponent = method.icon;
              return (
                <Card 
                  key={key}
                  className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-300"
                  onClick={() => handleMethodSelect(key)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{method.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Select This Method</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Professional Selection Step
  if (step === 'professional') {
    const selectedMethodData = TREATMENT_METHODS[selectedMethod as keyof typeof TREATMENT_METHODS];
    const IconComponent = selectedMethodData?.icon || Heart;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToMethods}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Methods
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${selectedMethodData?.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Select {selectedMethodData?.name} Professional
            </h1>
            <p className="text-gray-600">Choose from our qualified professionals</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading professionals...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionals.map((professional) => (
                <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={professional.avatar} alt={professional.name} />
                        <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{professional.name}</CardTitle>
                        <p className="text-sm text-gray-600">{professional.specialty}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{professional.rating}</span>
                          <span className="text-sm text-gray-400 ml-2">{professional.experience_years} years exp</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{professional.bio}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                        <span>{formatPrice(professional.price_per_session)}/session</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                        <span>
                          {professional.available_online && professional.available_offline ? 'Online & Offline' :
                           professional.available_online ? 'Online Only' : 'Offline Only'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {professional.languages.map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    {/* CV and Specialty Buttons */}
                    <div className="flex gap-2 mb-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewCV(professional)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        CV
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewSpecialty(professional)}
                      >
                        <Award className="w-4 h-4 mr-1" />
                        Specialty
                      </Button>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleBookProfessional(professional)}
                    >
                      Book with {professional.name.split(' ')[0]}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {professionals.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600">No professionals available for this treatment method.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Booking Step with Calendar and Time Selection
  if (step === 'booking' && selectedProfessional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToProfessionals}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Professionals
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Your Session</h1>
            <p className="text-gray-600">Choose date, time, and session type</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Professional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedProfessional.avatar} alt={selectedProfessional.name} />
                    <AvatarFallback>{selectedProfessional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedProfessional.name}</h3>
                    <p className="text-gray-600">{selectedProfessional.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{selectedProfessional.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Session Type Selection */}
                <div className="space-y-3">
                  <h4 className="font-medium">Session Type</h4>
                  <div className="space-y-2">
                    {selectedProfessional.available_online && (
                      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                        <input
                          type="radio"
                          name="sessionType"
                          value="online"
                          checked={sessionType === 'online'}
                          onChange={(e) => setSessionType(e.target.value as 'online' | 'offline')}
                          className="text-blue-600"
                        />
                        <div>
                          <div className="font-medium">Online Session</div>
                          <div className="text-sm text-gray-600">Video call via secure platform</div>
                        </div>
                      </label>
                    )}
                    {selectedProfessional.available_offline && (
                      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                        <input
                          type="radio"
                          name="sessionType"
                          value="offline"
                          checked={sessionType === 'offline'}
                          onChange={(e) => setSessionType(e.target.value as 'online' | 'offline')}
                          className="text-blue-600"
                        />
                        <div>
                          <div className="font-medium">In-Person Session</div>
                          <div className="text-sm text-gray-600">Face-to-face at clinic</div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span>Session Fee:</span>
                    <span className="font-medium">{formatPrice(selectedProfessional.price_per_session)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date and Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calendar */}
                <div>
                  <h4 className="font-medium mb-3">Choose Date</h4>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                    className="rounded-md border"
                  />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <h4 className="font-medium mb-3">Available Times</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="text-sm"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {selectedDate && selectedTime && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Booking Summary</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Date:</strong> {formatDate(selectedDate)}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Time:</strong> {selectedTime}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Type:</strong> {sessionType === 'online' ? 'Online Session' : 'In-Person Session'}
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={handleProceedToPayment}
                  disabled={!selectedDate || !selectedTime}
                >
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step with QRIS
  if (step === 'payment' && selectedProfessional && selectedDate && selectedTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToBooking}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Booking
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment</h1>
            <p className="text-gray-600">Complete your booking payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedProfessional.avatar} alt={selectedProfessional.name} />
                    <AvatarFallback>{selectedProfessional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedProfessional.name}</h3>
                    <p className="text-gray-600">{selectedProfessional.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{selectedProfessional.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Treatment Method:</span>
                    <span className="font-medium">{TREATMENT_METHODS[selectedMethod as keyof typeof TREATMENT_METHODS]?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Date:</span>
                    <span className="font-medium">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Session Type:</span>
                    <span className="font-medium">{sessionType === 'online' ? 'Online' : 'In-Person'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Session Fee:</span>
                    <span className="font-medium">{formatPrice(selectedProfessional.price_per_session)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Platform Fee:</span>
                    <span className="font-medium">Rp 25.000</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(selectedProfessional.price_per_session + 25000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QRIS Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Pay with QRIS</CardTitle>
                <p className="text-sm text-gray-600">Scan QR code with your mobile banking app</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 mb-6">
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    {/* QR Code placeholder - in real app, this would be generated */}
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">QRIS Code</p>
                  <p className="text-xs text-gray-500 mt-1">Valid for 15 minutes</p>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <p>1. Open your mobile banking or e-wallet app</p>
                  <p>2. Select "Scan QR" or "QRIS"</p>
                  <p>3. Scan the QR code above</p>
                  <p>4. Confirm payment of {formatPrice(selectedProfessional.price_per_session + 25000)}</p>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Payment Status:</strong> Waiting for payment...
                  </p>
                  <div className="flex items-center justify-center mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm text-blue-600">Monitoring payment</span>
                  </div>
                </div>

                <Button className="w-full mt-6" variant="outline">
                  I've Made the Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}