"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Users, 
  TrendingUp, 
  Shield, 
  Globe, 
  Zap,
  BarChart3,
  CheckCircle
} from "lucide-react";

interface ContentAnalysis {
  sentiment: { score: number; label: string };
  topics: string[];
  speakers: { name: string; duration: number; sentiment: number }[];
  compliance: { score: number; issues: string[] };
  accessibility: { score: number; suggestions: string[] };
  engagement_prediction: number;
}

interface ContentIntelligenceProps {
  analysis: ContentAnalysis;
  isProcessing: boolean;
}

export default function ContentIntelligence({ analysis, isProcessing }: ContentIntelligenceProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (isProcessing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
          <h3 className="text-lg font-semibold">AI Content Analysis</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "speakers", label: "Speakers", icon: Users },
    { id: "compliance", label: "Compliance", icon: Shield },
    { id: "accessibility", label: "Accessibility", icon: Globe }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold">AI Content Intelligence</h3>
        </div>
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Analysis Complete
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 text-purple-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Engagement Prediction</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {analysis.engagement_prediction}%
              </div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Sentiment Score</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {analysis.sentiment.score}/10
              </div>
              <div className="text-sm text-green-700">{analysis.sentiment.label}</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Key Topics</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.topics.map((topic, index) => (
                <Badge key={index} variant="outline">{topic}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "speakers" && (
        <div className="space-y-3">
          {analysis.speakers.map((speaker, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{speaker.name}</span>
                <Badge variant={speaker.sentiment > 0.5 ? "default" : "secondary"}>
                  {speaker.sentiment > 0.5 ? "Positive" : "Neutral"}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                Speaking time: {Math.round(speaker.duration / 60)}m {speaker.duration % 60}s
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "compliance" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Compliance Score</span>
            <Badge variant={analysis.compliance.score > 80 ? "default" : "destructive"}>
              {analysis.compliance.score}/100
            </Badge>
          </div>
          
          {analysis.compliance.issues.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-red-600">Issues Found</h4>
              <ul className="space-y-1">
                {analysis.compliance.issues.map((issue, index) => (
                  <li key={index} className="text-sm text-red-600">• {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === "accessibility" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Accessibility Score</span>
            <Badge variant={analysis.accessibility.score > 80 ? "default" : "secondary"}>
              {analysis.accessibility.score}/100
            </Badge>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Suggestions</h4>
            <ul className="space-y-1">
              {analysis.accessibility.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-600">• {suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}