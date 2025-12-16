"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  BarChart3,
  PieChart,
  Download,
  Calendar,
  Award
} from "lucide-react";

interface ROIMetrics {
  total_revenue_attributed: number;
  cost_per_lead: number;
  content_roi_percentage: number;
  leads_generated: number;
  conversion_rate: number;
  avg_content_velocity: number;
}

interface ContentPerformance {
  content_type: string;
  pieces_created: number;
  total_views: number;
  leads_generated: number;
  revenue_attributed: number;
  roi_percentage: number;
}

interface CompetitorBenchmark {
  metric: string;
  your_value: number;
  industry_avg: number;
  top_performer: number;
  percentile: number;
}

export default function ROIDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    roi_metrics: {} as ROIMetrics,
    content_performance: [] as ContentPerformance[],
    competitor_benchmarks: [] as CompetitorBenchmark[],
    monthly_trends: []
  });

  useEffect(() => {
    fetchROIData();
  }, [timeRange]);

  const fetchROIData = async () => {
    try {
      // Mock data for demo
      setData({
        roi_metrics: {
          total_revenue_attributed: 245000,
          cost_per_lead: 45,
          content_roi_percentage: 340,
          leads_generated: 1250,
          conversion_rate: 12.5,
          avg_content_velocity: 5.2
        },
        content_performance: [
          {
            content_type: "Blog Posts",
            pieces_created: 24,
            total_views: 125000,
            leads_generated: 450,
            revenue_attributed: 89000,
            roi_percentage: 420
          },
          {
            content_type: "Video Content",
            pieces_created: 12,
            total_views: 89000,
            leads_generated: 320,
            revenue_attributed: 67000,
            roi_percentage: 380
          },
          {
            content_type: "Whitepapers",
            pieces_created: 6,
            total_views: 45000,
            leads_generated: 280,
            revenue_attributed: 89000,
            roi_percentage: 560
          }
        ],
        competitor_benchmarks: [
          {
            metric: "Content ROI",
            your_value: 340,
            industry_avg: 280,
            top_performer: 450,
            percentile: 75
          },
          {
            metric: "Cost per Lead",
            your_value: 45,
            industry_avg: 65,
            top_performer: 35,
            percentile: 80
          },
          {
            metric: "Content Velocity",
            your_value: 5.2,
            industry_avg: 7.8,
            top_performer: 4.1,
            percentile: 65
          }
        ],
        monthly_trends: []
      });
    } catch (error) {
      console.error('Failed to fetch ROI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "ROI Overview", icon: DollarSign },
    { id: "performance", label: "Content Performance", icon: BarChart3 },
    { id: "benchmarks", label: "Competitive Analysis", icon: Award },
    { id: "reports", label: "Executive Reports", icon: Download }
  ];

  const timeRanges = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" }
  ];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold">Content ROI Dashboard</h3>
          <Badge className="bg-green-100 text-green-700">Executive</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
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
                  ? 'bg-white dark:bg-gray-600 text-green-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ROI Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="font-semibold">Revenue Attributed</h4>
                  <div className="text-2xl font-bold text-green-600">
                    ${data.roi_metrics.total_revenue_attributed?.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600">+23% vs last period</span>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Content ROI</h4>
                  <div className="text-2xl font-bold text-blue-600">
                    {data.roi_metrics.content_roi_percentage}%
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-700">
                Industry avg: 280%
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <h4 className="font-semibold">Cost per Lead</h4>
                  <div className="text-2xl font-bold text-purple-600">
                    ${data.roi_metrics.cost_per_lead}
                  </div>
                </div>
              </div>
              <div className="text-sm text-purple-700">
                {data.roi_metrics.leads_generated} leads generated
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-3">Conversion Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Conversion Rate</span>
                  <span className="font-semibold">{data.roi_metrics.conversion_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Leads Generated</span>
                  <span className="font-semibold">{data.roi_metrics.leads_generated}</span>
                </div>
                <div className="flex justify-between">
                  <span>Content Velocity</span>
                  <span className="font-semibold">{data.roi_metrics.avg_content_velocity} days</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-3">Performance Trends</h4>
              <div className="h-32 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart placeholder</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Performance */}
      {activeTab === "performance" && (
        <div className="space-y-4">
          <h4 className="font-semibold">Performance by Content Type</h4>
          {data.content_performance.map((content, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-semibold text-lg">{content.content_type}</h5>
                <Badge variant={content.roi_percentage > 400 ? "default" : "secondary"}>
                  {content.roi_percentage}% ROI
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Pieces Created</div>
                  <div className="font-semibold text-lg">{content.pieces_created}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Total Views</div>
                  <div className="font-semibold text-lg">{content.total_views.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Leads</div>
                  <div className="font-semibold text-lg">{content.leads_generated}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Revenue</div>
                  <div className="font-semibold text-lg text-green-600">
                    ${content.revenue_attributed.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">ROI</div>
                  <div className="font-semibold text-lg text-blue-600">
                    {content.roi_percentage}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Competitive Benchmarks */}
      {activeTab === "benchmarks" && (
        <div className="space-y-4">
          <h4 className="font-semibold">Industry Benchmarks</h4>
          {data.competitor_benchmarks.map((benchmark, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold">{benchmark.metric}</h5>
                <Badge variant={benchmark.percentile > 70 ? "default" : benchmark.percentile > 50 ? "secondary" : "destructive"}>
                  {benchmark.percentile}th percentile
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-500">Your Performance</div>
                  <div className="font-semibold text-lg text-blue-600">
                    {benchmark.metric.includes('Cost') ? '$' : ''}{benchmark.your_value}
                    {benchmark.metric.includes('ROI') || benchmark.metric.includes('Rate') ? '%' : ''}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Industry Average</div>
                  <div className="font-semibold text-lg">
                    {benchmark.metric.includes('Cost') ? '$' : ''}{benchmark.industry_avg}
                    {benchmark.metric.includes('ROI') || benchmark.metric.includes('Rate') ? '%' : ''}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Top Performer</div>
                  <div className="font-semibold text-lg text-green-600">
                    {benchmark.metric.includes('Cost') ? '$' : ''}{benchmark.top_performer}
                    {benchmark.metric.includes('ROI') || benchmark.metric.includes('Rate') ? '%' : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Executive Reports */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <h4 className="font-semibold">Executive Reports</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Monthly ROI Summary",
                description: "Executive summary of content ROI and key metrics",
                format: "PDF",
                lastGenerated: "2024-01-15"
              },
              {
                title: "Content Performance Deep Dive",
                description: "Detailed analysis of content performance by type and channel",
                format: "Excel",
                lastGenerated: "2024-01-10"
              },
              {
                title: "Competitive Benchmark Report",
                description: "Industry comparison and competitive positioning",
                format: "PowerPoint",
                lastGenerated: "2024-01-08"
              },
              {
                title: "Content Strategy Recommendations",
                description: "AI-powered recommendations for content optimization",
                format: "PDF",
                lastGenerated: "2024-01-12"
              }
            ].map((report, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-semibold">{report.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                  <Badge variant="outline">{report.format}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Last generated: {report.lastGenerated}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Calendar className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}