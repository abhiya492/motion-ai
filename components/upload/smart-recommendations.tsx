"use client";

import { useState, useEffect } from "react";
import { Lightbulb, TrendingUp, Clock, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  usage_count?: number;
}

interface SmartRecommendationsProps {
  userId: string;
  onTemplateSelect: (template: Template) => void;
}

export default function SmartRecommendations({ userId, onTemplateSelect }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/content/templates?type=recommendations');
        const data = await response.json();
        setRecommendations(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommendations([
          { id: '1', name: 'Blog Post', description: 'Standard blog format', category: 'General' },
          { id: '2', name: 'Tutorial', description: 'Step-by-step guide', category: 'Educational' },
          { id: '3', name: 'Review', description: 'Product or service review', category: 'Review' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-800">Smart Recommendations</h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((template, index) => (
          <div
            key={template.id}
            onClick={() => onTemplateSelect(template)}
            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 cursor-pointer transition-all duration-200 border border-purple-100"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                {index === 0 && <TrendingUp className="w-4 h-4 text-green-600" />}
                {index === 1 && <Clock className="w-4 h-4 text-blue-600" />}
                {index === 2 && <Target className="w-4 h-4 text-purple-600" />}
              </div>
              <div>
                <p className="font-medium text-gray-800">{template.name}</p>
                <p className="text-xs text-gray-600">{template.description}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {template.category}
            </Badge>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Based on your upload history and trending templates
      </p>
    </div>
  );
}