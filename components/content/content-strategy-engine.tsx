"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  TrendingUp, 
  Search, 
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Users,
  Globe
} from "lucide-react";

interface ContentGap {
  topic: string;
  opportunity_score: number;
  search_volume: number;
  competition: 'low' | 'medium' | 'high';
  suggested_angle: string;
}

interface CompetitorInsight {
  competitor: string;
  top_topics: string[];
  content_frequency: number;
  engagement_rate: number;
  gap_opportunities: string[];
}

interface SEOOpportunity {
  keyword: string;
  search_volume: number;
  difficulty: number;
  current_rank: number | null;
  potential_traffic: number;
}

export default function ContentStrategyEngine() {
  const [activeTab, setActiveTab] = useState("gaps");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    content_gaps: [] as ContentGap[],
    competitor_insights: [] as CompetitorInsight[],
    seo_opportunities: [] as SEOOpportunity[],
    performance_predictions: {
      next_month_traffic: 0,
      content_score: 0,
      optimization_potential: 0
    }
  });

  useEffect(() => {
    fetchStrategyData();
  }, []);

  const fetchStrategyData = async () => {
    try {
      const response = await fetch('/api/content/strategy-analysis');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch strategy data:', error);
      // Mock data for demo
      setData({
        content_gaps: [
          {
            topic: "AI Content Marketing Trends 2024",
            opportunity_score: 85,
            search_volume: 12000,
            competition: 'medium',
            suggested_angle: "Focus on enterprise adoption and ROI metrics"
          },
          {
            topic: "Video Content Accessibility",
            opportunity_score: 92,
            search_volume: 8500,
            competition: 'low',
            suggested_angle: "Create comprehensive guide with tools and best practices"
          }
        ],
        competitor_insights: [
          {
            competitor: "ContentKing",
            top_topics: ["SEO Tools", "Content Optimization", "Analytics"],
            content_frequency: 12,
            engagement_rate: 4.2,
            gap_opportunities: ["AI-powered content creation", "Multi-language support"]
          }
        ],
        seo_opportunities: [
          {
            keyword: "ai content generator",
            search_volume: 45000,
            difficulty: 65,
            current_rank: null,
            potential_traffic: 2250
          }
        ],
        performance_predictions: {
          next_month_traffic: 15000,
          content_score: 78,
          optimization_potential: 34
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "gaps", label: "Content Gaps", icon: Target },
    { id: "competitors", label: "Competitors", icon: Users },
    { id: "seo", label: "SEO Opportunities", icon: Search },
    { id: "predictions", label: "Predictions", icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold">Content Strategy Engine</h3>
        <Badge className="bg-purple-100 text-purple-700">AI-Powered</Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 text-purple-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Gaps */}
      {activeTab === "gaps" && (
        <div className="space-y-4">
          {data.content_gaps.map((gap, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-lg">{gap.topic}</h4>
                <Badge variant={gap.opportunity_score > 80 ? "default" : "secondary"}>
                  {gap.opportunity_score}/100
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Search Volume</div>
                  <div className="font-semibold">{gap.search_volume.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Competition</div>
                  <Badge variant={gap.competition === 'low' ? 'default' : gap.competition === 'medium' ? 'secondary' : 'destructive'}>
                    {gap.competition}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Opportunity</div>
                  <div className="font-semibold text-green-600">High</div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-300">Suggested Angle</div>
                    <div className="text-sm text-blue-700 dark:text-blue-400">{gap.suggested_angle}</div>
                  </div>
                </div>
              </div>
              
              <Button size="sm" className="mt-3">Create Content</Button>
            </div>
          ))}
        </div>
      )}

      {/* Competitor Analysis */}
      {activeTab === "competitors" && (
        <div className="space-y-4">
          {data.competitor_insights.map((competitor, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-lg">{competitor.competitor}</h4>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Engagement Rate</div>
                  <div className="font-semibold">{competitor.engagement_rate}%</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-2">Top Topics</div>
                  <div className="flex flex-wrap gap-1">
                    {competitor.top_topics.map((topic, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Gap Opportunities</div>
                  <div className="space-y-1">
                    {competitor.gap_opportunities.map((gap, i) => (
                      <div key={i} className="text-sm text-green-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {gap}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SEO Opportunities */}
      {activeTab === "seo" && (
        <div className="space-y-4">
          {data.seo_opportunities.map((seo, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{seo.keyword}</h4>
                <Badge variant={seo.difficulty < 50 ? "default" : seo.difficulty < 70 ? "secondary" : "destructive"}>
                  Difficulty: {seo.difficulty}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Search Volume</div>
                  <div className="font-semibold">{seo.search_volume.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Current Rank</div>
                  <div className="font-semibold">{seo.current_rank || 'Not Ranking'}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Potential Traffic</div>
                  <div className="font-semibold text-green-600">{seo.potential_traffic}</div>
                </div>
              </div>
              
              <Button size="sm" className="mt-3">Target Keyword</Button>
            </div>
          ))}
        </div>
      )}

      {/* Performance Predictions */}
      {activeTab === "predictions" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h4 className="font-semibold">Traffic Forecast</h4>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {data.performance_predictions.next_month_traffic.toLocaleString()}
            </div>
            <div className="text-sm text-blue-700">Expected monthly visitors</div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold">Content Score</h4>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {data.performance_predictions.content_score}/100
            </div>
            <div className="text-sm text-green-700">Overall content quality</div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold">Growth Potential</h4>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              +{data.performance_predictions.optimization_potential}%
            </div>
            <div className="text-sm text-purple-700">Optimization upside</div>
          </div>
        </div>
      )}
    </div>
  );
}