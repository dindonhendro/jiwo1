"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, Brain, Heart, BarChart3, LineChart } from "lucide-react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface ScreeningData {
  id: string;
  score: number;
  severity: string;
  created_at: string;
}

interface JournalData {
  id: string;
  mood: string | null;
  created_at: string;
}

interface ChartDataPoint {
  date: string;
  score?: number;
  severity?: string;
  mood?: string;
  moodScore?: number;
}

const getMoodScore = (mood: string | null): number => {
  switch (mood?.toLowerCase()) {
    case 'positive':
    case 'happy':
    case 'joy':
      return 4;
    case 'neutral':
    case 'calm':
      return 3;
    case 'negative':
    case 'sad':
      return 2;
    case 'angry':
      return 1;
    default:
      return 3; // neutral default
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Minimal": return "#10b981"; // green
    case "Mild": return "#f59e0b"; // yellow
    case "Moderate": return "#f97316"; // orange
    case "Severe": return "#ef4444"; // red
    default: return "#6b7280"; // gray
  }
};

const getMoodColor = (mood: string | null) => {
  switch (mood?.toLowerCase()) {
    case 'positive':
    case 'happy':
    case 'joy':
      return "#10b981"; // green
    case 'neutral':
    case 'calm':
      return "#f59e0b"; // yellow
    case 'negative':
    case 'sad':
      return "#f97316"; // orange
    case 'angry':
      return "#ef4444"; // red
    default:
      return "#6b7280"; // gray
  }
};

export default function ProgressPage() {
  const [screeningData, setScreeningData] = useState<ScreeningData[]>([]);
  const [journalData, setJournalData] = useState<JournalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Load screening data
      const { data: screenings, error: screeningError } = await supabase
        .from('screenings')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (screeningError) {
        console.error('Error loading screenings:', screeningError);
      } else {
        setScreeningData(screenings || []);
      }

      // Load journal data
      const { data: journals, error: journalError } = await supabase
        .from('journals')
        .select('id, mood, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .not('mood', 'is', null)
        .order('created_at', { ascending: true });

      if (journalError) {
        console.error('Error loading journals:', journalError);
      } else {
        setJournalData(journals || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const prepareScreeningChartData = (): ChartDataPoint[] => {
    return screeningData.map(screening => ({
      date: new Date(screening.created_at).toLocaleDateString(),
      score: screening.score,
      severity: screening.severity
    }));
  };

  const prepareMoodChartData = (): ChartDataPoint[] => {
    // Group journals by date and calculate average mood score
    const moodByDate: { [key: string]: { moods: string[], count: number } } = {};
    
    journalData.forEach(journal => {
      const date = new Date(journal.created_at).toLocaleDateString();
      if (!moodByDate[date]) {
        moodByDate[date] = { moods: [], count: 0 };
      }
      if (journal.mood) {
        moodByDate[date].moods.push(journal.mood);
        moodByDate[date].count++;
      }
    });

    return Object.entries(moodByDate).map(([date, data]) => {
      const avgMoodScore = data.moods.reduce((sum, mood) => sum + getMoodScore(mood), 0) / data.count;
      const dominantMood = data.moods.sort((a, b) => 
        data.moods.filter(m => m === b).length - data.moods.filter(m => m === a).length
      )[0];
      
      return {
        date,
        moodScore: Math.round(avgMoodScore * 10) / 10,
        mood: dominantMood
      };
    });
  };

  const screeningChartData = prepareScreeningChartData();
  const moodChartData = prepareMoodChartData();

  const getLatestTrend = (data: ChartDataPoint[], key: 'score' | 'moodScore') => {
    if (data.length < 2) return null;
    const latest = data[data.length - 1][key] || 0;
    const previous = data[data.length - 2][key] || 0;
    return latest > previous ? 'up' : latest < previous ? 'down' : 'stable';
  };

  const screeningTrend = getLatestTrend(screeningChartData, 'score');
  const moodTrend = getLatestTrend(moodChartData, 'moodScore');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
          <p className="text-gray-600">Visualize your mental health journey over time</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? "bg-blue-600 text-white" : ""}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading your progress data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Screenings</p>
                      <p className="text-2xl font-bold text-blue-600">{screeningData.length}</p>
                    </div>
                    <Brain className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Journal Entries</p>
                      <p className="text-2xl font-bold text-purple-600">{journalData.length}</p>
                    </div>
                    <Heart className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Screening Trend</p>
                      <div className="flex items-center space-x-2">
                        {screeningTrend === 'up' && <TrendingUp className="w-5 h-5 text-red-500" />}
                        {screeningTrend === 'down' && <TrendingDown className="w-5 h-5 text-green-500" />}
                        <span className="text-lg font-bold text-gray-900">
                          {screeningTrend === 'up' ? 'Increasing' : screeningTrend === 'down' ? 'Improving' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mood Trend</p>
                      <div className="flex items-center space-x-2">
                        {moodTrend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                        {moodTrend === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
                        <span className="text-lg font-bold text-gray-900">
                          {moodTrend === 'up' ? 'Improving' : moodTrend === 'down' ? 'Declining' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Screening Scores Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="w-5 h-5 mr-2 text-blue-600" />
                    Screening Scores Over Time
                  </CardTitle>
                  <CardDescription>
                    PHQ-9 depression screening scores (lower is better)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {screeningChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={screeningChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 27]} />
                        <Tooltip 
                          formatter={(value: any, name: string) => [
                            `${value} (${screeningChartData.find(d => d.score === value)?.severity})`,
                            'Score'
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#2563eb"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No screening data available</p>
                      <p className="text-sm text-gray-400">Take a screening assessment to see your progress</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mood Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                    Mood Trends
                  </CardTitle>
                  <CardDescription>
                    Daily mood patterns from journal entries (higher is better)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {moodChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsBarChart data={moodChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[1, 4]} />
                        <Tooltip 
                          formatter={(value: any, name: string) => [
                            `${value} (${moodChartData.find(d => d.moodScore === value)?.mood})`,
                            'Mood Score'
                          ]}
                        />
                        <Bar 
                          dataKey="moodScore" 
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No mood data available</p>
                      <p className="text-sm text-gray-400">Write journal entries to track your mood patterns</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Data Tables */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Screenings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Screenings</CardTitle>
                  <CardDescription>Your latest assessment results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {screeningData.slice(-5).reverse().map((screening) => (
                      <div key={screening.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">PHQ-9 Assessment</p>
                          <p className="text-sm text-gray-500">
                            {new Date(screening.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{screening.score}/27</p>
                          <Badge 
                            variant="secondary" 
                            style={{ 
                              backgroundColor: getSeverityColor(screening.severity) + '20',
                              color: getSeverityColor(screening.severity)
                            }}
                          >
                            {screening.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {screeningData.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No screenings completed yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Moods */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Mood Patterns</CardTitle>
                  <CardDescription>Mood analysis from journal entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {journalData.slice(-5).reverse().map((journal) => (
                      <div key={journal.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Journal Entry</p>
                          <p className="text-sm text-gray-500">
                            {new Date(journal.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="secondary"
                            style={{ 
                              backgroundColor: getMoodColor(journal.mood) + '20',
                              color: getMoodColor(journal.mood)
                            }}
                          >
                            {journal.mood || 'Processing...'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {journalData.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No mood data available yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Understanding Your Progress</p>
                <p>
                  Track your mental health journey through screening scores and mood patterns. 
                  Lower screening scores indicate improvement, while higher mood scores show positive emotional states.
                  Regular tracking helps identify patterns and measure the effectiveness of your treatment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}