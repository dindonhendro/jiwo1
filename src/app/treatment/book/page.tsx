"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Apple, Target, Flower2, Palette } from "lucide-react";

const TREATMENT_METHODS = {
  "psychiatrist": { name: "Psikiater", icon: Brain, color: "bg-blue-600" },
  "psychologist": { name: "Psikolog", icon: Heart, color: "bg-purple-600" },
  "nutrition": { name: "Health Nutrisi", icon: Apple, color: "bg-green-600" },
  "life-coaching": { name: "Life Coaching", icon: Target, color: "bg-orange-600" },
  "holistic-yoga": { name: "Holistik Yoga", icon: Flower2, color: "bg-teal-600" },
  "art-therapy": { name: "Art Therapy", icon: Palette, color: "bg-pink-600" }
};

export default function TreatmentBookingPage() {
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