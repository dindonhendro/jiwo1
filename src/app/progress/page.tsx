"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Calendar, Target, BookOpen, Brain, Heart, Award, BarChart3, LineChart } from "lucide-react";
import Link from "next/link";

export default function ProgressPage() {
  // Mock data for progress tracking
  const progressData = {
    screenings: {
      total: 12,
      thisMonth: 3,
      trend: "+15%"
    },
    journalEntries: {
      total: 45,
      thisMonth: 8,
      trend: "+22%"
    },
    moodScore: {
      current: 7.2,
      previous: 6.8,
      trend: "+5.9%"
    },
    streakDays: 14
  };

  const recentActivities = [
    { type: "screening", name: "PHQ-9 Depression Screening", date: "2024-01-15", score: "Mild" },
    { type: "journal", name: "Daily Reflection", date: "2024-01-14", mood: "Good" },
    { type: "screening", name: "GAD-7 Anxiety Screening", date: "2024-01-12", score: "Minimal" },
    { type: "journal", name: "Gratitude Journal", date: "2024-01-11", mood: "Excellent" }
  ];

  const monthlyData = [
    { month: "Jul", screenings: 2, journals: 8, mood: 6.5 },
    { month: "Aug", screenings: 3, journals: 12, mood: 6.8 },
    { month: "Sep", screenings: 4, journals: 15, mood: 7.0 },
    { month: "Oct", screenings: 3, journals: 10, mood: 6.9 },
    { month: "Nov", screenings: 2, journals: 8, mood: 7.1 },
    { month: "Dec", screenings: 3, journals: 8, mood: 7.2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Progress Tracking</h1>
                  <p className="text-sm text-gray-600">Monitor your mental health journey</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {progressData.streakDays} day streak
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Screenings</CardTitle>
              <Brain className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.screenings.total}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{progressData.screenings.trend}</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.journalEntries.total}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{progressData.journalEntries.trend}</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.moodScore.current}/10</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{progressData.moodScore.trend}</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Award className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.streakDays}</div>
              <p className="text-xs text-muted-foreground">consecutive days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Monthly Progress
              </CardTitle>
              <CardDescription>Your activity over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 text-sm font-medium">{data.month}</div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {data.screenings} screenings
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {data.journals} journals
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Mood:</span>
                      <span className="font-medium">{data.mood}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest screenings and journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'screening' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'screening' ? 
                          <Brain className="w-4 h-4 text-blue-600" /> : 
                          <BookOpen className="w-4 h-4 text-purple-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-sm">{activity.name}</p>
                        <p className="text-xs text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                    <div>
                      {activity.score && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.score}
                        </Badge>
                      )}
                      {activity.mood && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.mood}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Goals & Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm">Complete weekly screening</span>
                </div>
                <Badge className="bg-green-600">Achieved</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm">Journal 5 times this week</span>
                </div>
                <Badge variant="outline">3/5</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <span className="text-sm">Maintain 30-day streak</span>
                </div>
                <Badge variant="outline">14/30</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="w-5 h-5 mr-2 text-orange-600" />
                Insights & Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Mood Improvement</p>
                <p className="text-xs text-blue-600 mt-1">
                  Your average mood has improved by 5.9% this month. Keep up the great work!
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-800">Consistent Journaling</p>
                <p className="text-xs text-purple-600 mt-1">
                  You've been more consistent with journaling. This correlates with better mood scores.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Screening Results</p>
                <p className="text-xs text-green-600 mt-1">
                  Your recent screenings show positive trends. Consider discussing with a professional.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Continue your mental health journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/screening">
                <Button className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                  <Brain className="w-6 h-6" />
                  <span>Take Screening</span>
                </Button>
              </Link>
              <Link href="/journal">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                  <BookOpen className="w-6 h-6" />
                  <span>Write Journal</span>
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-2">
                  <Heart className="w-6 h-6" />
                  <span>Get Support</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}