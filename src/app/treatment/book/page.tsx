"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Heart, 
  Apple, 
  Target, 
  Flower2, 
  Palette,
  CheckCircle2,
  Clock,
  Star,
  ArrowLeft,
  ArrowRight,
  Video,
  MapPin,
  Calendar,
  DollarSign,
  Languages,
  Award
} from "lucide-react";
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

export default function TreatmentBookingPage() {
  const [step, setStep] = useState<'method' | 'professional' | 'schedule'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    sessionType: '',
    notes: ''
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const method = searchParams.get('method');
    if (method && TREATMENT_METHODS[method as keyof typeof TREATMENT_METHODS]) {
      setSelectedMethod(method);
      setStep('professional');
      loadProfessionals(method);
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

  const handleProfessionalSelect = (professional: Professional) => {
    setSelectedProfessional(professional);
    setStep('schedule');
  };

  const handleBookingSubmit = async () => {
    if (!selectedProfessional || !bookingData.date || !bookingData.time || !bookingData.sessionType) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          professional_id: selectedProfessional.id,
          treatment_type: selectedMethod,
          appointment_date: bookingData.date,
          appointment_time: bookingData.time,
          session_type: bookingData.sessionType,
          notes: bookingData.notes
        });

      if (error) {
        console.error('Error booking appointment:', error);
        throw new Error('Failed to book appointment');
      }

      // Call webhook for appointment notification
      try {
        await fetch('/webhook/appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            professional_id: selectedProfessional.id,
            treatment_type: selectedMethod,
            appointment_date: bookingData.date,
            appointment_time: bookingData.time,
            session_type: bookingData.sessionType
          })
        });
      } catch (webhookError) {
        console.warn('Webhook call failed:', webhookError);
      }

      alert(`Appointment booked successfully with ${selectedProfessional.name}!`);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Method Selection Step
  if (step === 'method') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
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
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300"
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
    const method = TREATMENT_METHODS[selectedMethod as keyof typeof TREATMENT_METHODS];
    const IconComponent = method.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setStep('method')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Methods
            </Button>
            <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose {method.name}</h1>
            <p className="text-gray-600">Select a professional for your treatment</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading professionals...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {professionals.map((professional) => (
                <Card 
                  key={professional.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleProfessionalSelect(professional)}
                >
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={professional.avatar} />
                        <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{professional.name}</CardTitle>
                        <CardDescription className="text-sm">{professional.specialty}</CardDescription>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm ml-1">{professional.rating}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            {professional.experience_years} years
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{professional.bio}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-sm">{formatPrice(professional.price_per_session)}</span>
                        <span className="text-xs text-gray-500">per session</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {professional.available_online && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          <Video className="w-3 h-3 mr-1" />
                          Online
                        </Badge>
                      )}
                      {professional.available_offline && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          In-person
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Languages className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {professional.languages.join(', ')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Schedule Step
  if (step === 'schedule' && selectedProfessional) {
    const method = TREATMENT_METHODS[selectedMethod as keyof typeof TREATMENT_METHODS];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => setStep('professional')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Professionals
            </Button>
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Appointment</h1>
            <p className="text-gray-600">Book your session with {selectedProfessional.name}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Professional Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Professional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedProfessional.avatar} />
                    <AvatarFallback>{selectedProfessional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedProfessional.name}</h3>
                    <p className="text-sm text-gray-600">{selectedProfessional.specialty}</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm ml-1">{selectedProfessional.rating}</span>
                      <span className="text-sm text-gray-500 ml-2">• {selectedProfessional.experience_years} years exp</span>
                    </div>
                    <p className="text-sm font-medium text-green-600 mt-2">
                      {formatPrice(selectedProfessional.price_per_session)} per session
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select onValueChange={(value) => setBookingData({...bookingData, time: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="13:00">01:00 PM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="15:00">03:00 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sessionType">Session Type</Label>
                  <Select onValueChange={(value) => setBookingData({...bookingData, sessionType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProfessional.available_online && (
                        <SelectItem value="online">Online Session</SelectItem>
                      )}
                      {selectedProfessional.available_offline && (
                        <SelectItem value="offline">In-Person Session</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific concerns or requests..."
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={handleBookingSubmit}
                  disabled={isLoading || !bookingData.date || !bookingData.time || !bookingData.sessionType}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? 'Booking...' : 'Confirm Appointment'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          {bookingData.date && bookingData.time && bookingData.sessionType && (
            <Card className="mt-8 bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Treatment:</strong> {method.name}</p>
                    <p><strong>Professional:</strong> {selectedProfessional.name}</p>
                    <p><strong>Date:</strong> {new Date(bookingData.date).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <p><strong>Time:</strong> {bookingData.time}</p>
                    <p><strong>Type:</strong> {bookingData.sessionType === 'online' ? 'Online Session' : 'In-Person Session'}</p>
                    <p><strong>Cost:</strong> {formatPrice(selectedProfessional.price_per_session)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return null;
}