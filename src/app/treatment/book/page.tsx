"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Heart, Brain, Apple, Target, Flower2, Palette, ArrowLeft, Star, MapPin, DollarSign, FileText, Award, Clock, CalendarDays } from "lucide-react";
import { createClient } from "../../../../supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

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

function TreatmentBookingContent() {
  const [step, setStep] = useState<'method' | 'professional' | 'booking' | 'payment'>('professional');
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionType, setSessionType] = useState<'online' | 'offline'>('online');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const method = searchParams.get('method');
    if (method && TREATMENT_METHODS[method as keyof typeof TREATMENT_METHODS]) {
      setSelectedMethod(method);
      loadProfessionals(method);
    } else {
      setStep('method');
    }
  }, [searchParams]);

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
        // Enhanced mock data with CV/Bio and specialties
        setProfessionals([
          {
            id: '1',
            name: 'Dr. Sarah Johnson',
            specialty: 'Clinical Psychology - Anxiety & Depression Specialist',
            treatment_type: treatmentType,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
            bio: 'Dr. Sarah Johnson is a licensed clinical psychologist with 8 years of experience specializing in anxiety and depression treatment. She holds a Ph.D. in Clinical Psychology from University of Indonesia and is certified in Cognitive Behavioral Therapy (CBT) and Dialectical Behavior Therapy (DBT). Dr. Johnson has published research on mindfulness-based interventions and has helped over 500 patients achieve better mental health outcomes.',
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
            specialty: 'Psychiatrist - Mood Disorders & Medication Management',
            treatment_type: treatmentType,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad',
            bio: 'Dr. Ahmad Rahman is a board-certified psychiatrist with 12 years of experience in treating mood disorders, anxiety, and psychotic disorders. He completed his residency at RSUPN Dr. Cipto Mangunkusumo and holds certifications in psychopharmacology. Dr. Rahman specializes in medication management and has extensive experience in treating treatment-resistant depression and bipolar disorder.',
            experience_years: 12,
            rating: 4.9,
            price_per_session: 750000,
            available_online: true,
            available_offline: false,
            languages: ['Indonesian']
          },
          {
            id: '3',
            name: 'Dr. Maya Sari',
            specialty: 'Nutritional Therapist - Mental Health Nutrition',
            treatment_type: treatmentType,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
            bio: 'Dr. Maya Sari is a certified nutritional therapist with 6 years of experience focusing on the connection between nutrition and mental health. She holds a Master\'s degree in Nutritional Science and is certified in Functional Medicine. Dr. Sari specializes in creating personalized nutrition plans to support mental wellness and has helped clients manage depression, anxiety, and ADHD through dietary interventions.',
            experience_years: 6,
            rating: 4.7,
            price_per_session: 400000,
            available_online: true,
            available_offline: true,
            languages: ['Indonesian', 'English']
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

  const handleSelectProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setStep('booking');
  };

  if (step === 'booking' && selectedProfessional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-4"
                  onClick={() => setStep('professional')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Professionals
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">Book Session</h1>
                    <p className="text-sm text-gray-600">Schedule with {selectedProfessional.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Professional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Professional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedProfessional.avatar} alt={selectedProfessional.name} />
                    <AvatarFallback>{selectedProfessional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedProfessional.name}</h3>
                    <p className="text-sm text-gray-600">{selectedProfessional.specialty}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{selectedProfessional.rating}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{selectedProfessional.experience_years} years</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">
                    Rp {selectedProfessional.price_per_session.toLocaleString('id-ID')} / session
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProfessional.available_online && (
                    <Badge variant="secondary" className="text-xs">Online</Badge>
                  )}
                  {selectedProfessional.available_offline && (
                    <Badge variant="secondary" className="text-xs">In-Person</Badge>
                  )}
                  {selectedProfessional.languages.map(lang => (
                    <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Session Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={sessionType === 'online' ? 'default' : 'outline'}
                      onClick={() => setSessionType('online')}
                      disabled={!selectedProfessional.available_online}
                    >
                      Online
                    </Button>
                    <Button
                      variant={sessionType === 'offline' ? 'default' : 'outline'}
                      onClick={() => setSessionType('offline')}
                      disabled={!selectedProfessional.available_offline}
                    >
                      In-Person
                    </Button>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Available Times</label>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button 
                  className="w-full" 
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => {
                    alert(`Session booked with ${selectedProfessional.name} on ${selectedDate?.toDateString()} at ${selectedTime}`);
                    router.push('/dashboard');
                  }}
                >
                  Book Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-4"
                onClick={() => router.push('/treatment')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Treatment
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Select Professional</h1>
                  <p className="text-sm text-gray-600">Choose your mental health professional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p>Loading professionals...</p>
            </div>
          ) : (
            professionals.map((professional) => (
              <Card 
                key={professional.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedProfessional?.id === professional.id 
                    ? 'border-2 border-purple-500 bg-purple-50' 
                    : 'border hover:border-gray-300'
                }`}
                onClick={() => setSelectedProfessional(professional)}
              >
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={professional.avatar} alt={professional.name} />
                      <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{professional.name}</CardTitle>
                      <p className="text-sm text-gray-600 font-medium">{professional.specialty}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium ml-1">{professional.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{professional.experience_years} years exp</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Professional Bio/CV */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      Professional Background
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-3">{professional.bio}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs mt-2 p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Full CV/Bio for ${professional.name}:\n\n${professional.bio}`);
                      }}
                    >
                      View Full CV/Bio →
                    </Button>
                  </div>

                  {/* Specialty Details */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Specialty & Expertise
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">{professional.specialty}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        const specialtyDetails = `Specialty Details for ${professional.name}:\n\n${professional.specialty}\n\nExperience: ${professional.experience_years} years\nRating: ${professional.rating}/5.0\n\nTreatment Approaches:\n• Evidence-based therapy\n• Personalized treatment plans\n• Holistic mental health care\n\nLanguages: ${professional.languages.join(', ')}`;
                        alert(specialtyDetails);
                      }}
                    >
                      View Specialty Details →
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">
                      Rp {professional.price_per_session.toLocaleString('id-ID')} / session
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {professional.available_online && (
                      <Badge variant="secondary" className="text-xs">Online</Badge>
                    )}
                    {professional.available_offline && (
                      <Badge variant="secondary" className="text-xs">In-Person</Badge>
                    )}
                    {professional.languages.map(lang => (
                      <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectProfessional(professional);
                    }}
                  >
                    Select Professional
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookTreatmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <TreatmentBookingContent />
    </Suspense>
  );
}