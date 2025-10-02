"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Brain, 
  Heart, 
  Apple, 
  Target, 
  Flower2, 
  Palette,
  CheckCircle2,
  Clock,
  Users,
  Star,
  ArrowRight
} from "lucide-react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TREATMENT_METHODS = [
  {
    id: "psychiatrist",
    name: "Psikiater",
    title: "Psychiatric Treatment",
    description: "Medical treatment with licensed psychiatrists for medication management and clinical therapy",
    icon: Brain,
    color: "bg-blue-600",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-50",
    duration: "45-60 minutes",
    frequency: "Weekly/Bi-weekly",
    bestFor: ["Depression", "Anxiety", "Bipolar Disorder", "Schizophrenia", "ADHD"],
    approach: "Medical and pharmaceutical intervention with psychotherapy",
    benefits: [
      "Medication prescription and management",
      "Clinical diagnosis and treatment",
      "Evidence-based psychiatric care",
      "Crisis intervention support"
    ]
  },
  {
    id: "psychologist", 
    name: "Psikolog",
    title: "Psychological Therapy",
    description: "Talk therapy and behavioral interventions with licensed clinical psychologists",
    icon: Heart,
    color: "bg-purple-600",
    borderColor: "border-purple-200", 
    bgColor: "bg-purple-50",
    duration: "50 minutes",
    frequency: "Weekly",
    bestFor: ["Anxiety", "Depression", "Trauma", "Relationship Issues", "Stress"],
    approach: "Cognitive Behavioral Therapy (CBT), psychodynamic therapy, and other evidence-based approaches",
    benefits: [
      "Individual and group therapy sessions",
      "Coping strategies development",
      "Behavioral modification techniques",
      "Emotional processing and healing"
    ]
  },
  {
    id: "nutrition",
    name: "Health Nutrisi", 
    title: "Nutritional Therapy",
    description: "Specialized nutrition counseling to support mental health through dietary interventions",
    icon: Apple,
    color: "bg-green-600",
    borderColor: "border-green-200",
    bgColor: "bg-green-50", 
    duration: "30-45 minutes",
    frequency: "Bi-weekly/Monthly",
    bestFor: ["Depression", "Anxiety", "ADHD", "Eating Disorders", "Mood Disorders"],
    approach: "Nutritional psychiatry and functional medicine approach to mental wellness",
    benefits: [
      "Personalized nutrition plans",
      "Supplement recommendations", 
      "Gut-brain health optimization",
      "Mood-supporting dietary strategies"
    ]
  },
  {
    id: "life-coaching",
    name: "Life Coaching",
    title: "Life & Wellness Coaching", 
    description: "Goal-oriented coaching to develop life skills, resilience, and personal growth",
    icon: Target,
    color: "bg-orange-600",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-50",
    duration: "60 minutes", 
    frequency: "Weekly/Bi-weekly",
    bestFor: ["Stress", "Burnout", "Life Transitions", "Goal Setting", "Self-Esteem"],
    approach: "Solution-focused coaching with mindfulness and positive psychology techniques",
    benefits: [
      "Goal setting and achievement",
      "Stress management techniques", 
      "Work-life balance strategies",
      "Personal development planning"
    ]
  },
  {
    id: "holistic-yoga",
    name: "Holistik Yoga",
    title: "Holistic Yoga Therapy",
    description: "Mind-body healing through therapeutic yoga, meditation, and breathwork practices", 
    icon: Flower2,
    color: "bg-teal-600",
    borderColor: "border-teal-200",
    bgColor: "bg-teal-50",
    duration: "60-90 minutes",
    frequency: "2-3 times/week", 
    bestFor: ["Anxiety", "Stress", "PTSD", "Sleep Problems", "Chronic Pain"],
    approach: "Integrative yoga therapy combining asanas, pranayama, and meditation",
    benefits: [
      "Stress reduction and relaxation",
      "Improved sleep quality",
      "Enhanced emotional regulation", 
      "Physical and mental flexibility"
    ]
  },
  {
    id: "art-therapy",
    name: "Art Therapy",
    title: "Creative Arts Therapy",
    description: "Expressive therapy using creative arts to process emotions and promote healing",
    icon: Palette,
    color: "bg-pink-600", 
    borderColor: "border-pink-200",
    bgColor: "bg-pink-50",
    duration: "60 minutes",
    frequency: "Weekly",
    bestFor: ["Trauma", "Depression", "Anxiety", "Grief", "Communication Issues"],
    approach: "Creative expression through art, music, drama, and movement therapy",
    benefits: [
      "Non-verbal emotional expression",
      "Trauma processing and healing",
      "Enhanced self-awareness",
      "Stress relief through creativity"
    ]
  }
];

interface UserProfile {
  conditions: string[];
  severity: string;
  preferences: string[];
}

export default function TreatmentPage() {
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      // Load user's recent screening results to provide AI recommendations
      const { data: screenings } = await supabase
        .from('screenings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Mock user profile based on screening data
      const mockProfile: UserProfile = {
        conditions: screenings && screenings.length > 0 
          ? ['Depression', 'Anxiety'] 
          : ['General Wellness'],
        severity: screenings && screenings.length > 0 
          ? screenings[0].severity 
          : 'Mild',
        preferences: ['Individual Therapy', 'Holistic Approach']
      };

      setUserProfile(mockProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAIRecommendations = (profile: UserProfile): string[] => {
    const recommendations: string[] = [];
    
    // AI logic based on conditions and severity
    if (profile.conditions.includes('Depression')) {
      if (profile.severity === 'Severe') {
        recommendations.push('psychiatrist', 'psychologist');
      } else {
        recommendations.push('psychologist', 'nutrition');
      }
    }
    
    if (profile.conditions.includes('Anxiety')) {
      recommendations.push('psychologist', 'holistic-yoga');
    }
    
    if (profile.conditions.includes('Stress') || profile.conditions.includes('Burnout')) {
      recommendations.push('life-coaching', 'holistic-yoga');
    }
    
    // Always recommend complementary therapies
    if (!recommendations.includes('art-therapy')) {
      recommendations.push('art-therapy');
    }
    
    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  };

  const toggleMethodSelection = (methodId: string) => {
    setSelectedMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleProceedWithTreatment = async () => {
    if (selectedMethods.length === 0) {
      alert('Please select at least one treatment method');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save treatment plan selection
      const selectedMethodsData = selectedMethods.map(methodId => 
        TREATMENT_METHODS.find(m => m.id === methodId)
      );

      // Call n8n webhook for treatment plan
      await fetch('/webhook/treatment-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          selected_methods: selectedMethods,
          treatment_details: selectedMethodsData,
          timestamp: new Date().toISOString()
        })
      });

      alert(`Treatment plan created! You've selected ${selectedMethods.length} treatment method(s). A professional will contact you to schedule your sessions.`);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating treatment plan:', error);
      alert('Failed to create treatment plan. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading treatment recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  const aiRecommendations = userProfile ? getAIRecommendations(userProfile) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Treatment Methods</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive range of evidence-based treatment approaches. 
            Our AI analysis recommends the best methods based on your mental health assessment.
          </p>
        </div>

        {/* AI Recommendations Section */}
        {userProfile && aiRecommendations.length > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                AI Recommended for You
              </CardTitle>
              <CardDescription>
                Based on your mental health assessment, these treatment methods are most suitable for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Conditions: {userProfile.conditions.join(', ')}</Badge>
                <Badge variant="secondary">Severity: {userProfile.severity}</Badge>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {aiRecommendations.map(methodId => {
                  const method = TREATMENT_METHODS.find(m => m.id === methodId);
                  if (!method) return null;
                  const IconComponent = method.icon;
                  return (
                    <div key={methodId} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                      <div className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{method.name}</p>
                        <p className="text-xs text-gray-500">Recommended</p>
                      </div>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Treatment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {TREATMENT_METHODS.map((method) => {
            const IconComponent = method.icon;
            const isSelected = selectedMethods.includes(method.id);
            const isRecommended = aiRecommendations.includes(method.id);
            
            return (
              <Card 
                key={method.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected 
                    ? `border-2 ${method.borderColor} ${method.bgColor}` 
                    : 'border hover:border-gray-300'
                } ${isRecommended ? 'ring-2 ring-blue-200' : ''}`}
                onClick={() => toggleMethodSelection(method.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{method.name}</CardTitle>
                        <p className="text-sm text-gray-500">{method.title}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {isRecommended && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          AI Recommended
                        </Badge>
                      )}
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm">
                    {method.description}
                  </CardDescription>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{method.duration} • {method.frequency}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Best for:</p>
                    <div className="flex flex-wrap gap-1">
                      {method.bestFor.slice(0, 3).map((condition) => (
                        <Badge key={condition} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                      {method.bestFor.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{method.bestFor.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Benefits:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {method.benefits.slice(0, 2).map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 italic">
                      {method.approach}
                    </p>
                  </div>

                  {/* Book Now Button - Navigate to professional selection */}
                  <div className="pt-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/treatment/book?method=${method.id}`);
                      }}
                    >
                      Book Professional
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Methods Summary */}
        {selectedMethods.length > 0 && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Your Selected Treatment Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedMethods.map(methodId => {
                  const method = TREATMENT_METHODS.find(m => m.id === methodId);
                  if (!method) return null;
                  const IconComponent = method.icon;
                  return (
                    <div key={methodId} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                      <div className={`w-8 h-8 ${method.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{method.name}</p>
                        <p className="text-xs text-gray-500">{method.duration} • {method.frequency}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMethodSelection(methodId);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex gap-4">
                <Button 
                  onClick={handleProceedWithTreatment}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Proceed with Treatment Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedMethods([])}
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">Comprehensive Mental Health Care</p>
                <p className="mb-3">
                  Our integrated approach combines multiple evidence-based treatment methods to provide 
                  personalized care tailored to your specific needs and preferences.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-medium mb-1">Professional Standards:</p>
                    <p>• Licensed and certified practitioners</p>
                    <p>• Evidence-based treatment protocols</p>
                    <p>• Regular progress monitoring</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Flexible Options:</p>
                    <p>• Individual and group sessions</p>
                    <p>• In-person and virtual appointments</p>
                    <p>• Customizable treatment schedules</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View All Treatment Options Button */}
        <div className="mt-4 pt-4 border-t">
          <Link href="/treatment">
            <Button variant="outline" className="w-full">
              View All Treatment Options
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}