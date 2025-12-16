"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ContentGeneratorProps {
  blogContent: string;
  transcription?: string;
}

export function ContentGenerator({ blogContent, transcription }: ContentGeneratorProps) {
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const contentTypes = [
    { key: 'twitter', label: 'Twitter Post', icon: '🐦' },
    { key: 'linkedin', label: 'LinkedIn Post', icon: '💼' },
    { key: 'facebook', label: 'Facebook Post', icon: '📘' },
    { key: 'instagram', label: 'Instagram Caption', icon: '📸' },
    { key: 'email', label: 'Email Newsletter', icon: '📧' },
    { key: 'podcast', label: 'Podcast Notes', icon: '🎙️' }
  ];

  const generateContent = async (type: string) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    
    try {
      const endpoint = type === 'podcast' ? '/api/content/podcast' : 
                     type === 'email' ? '/api/content/email' : 
                     '/api/content/social';
      
      const body = type === 'podcast' 
        ? { transcription }
        : type === 'email'
        ? { content: blogContent }
        : { content: blogContent, platform: type };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      setGeneratedContent(prev => ({ ...prev, [type]: result.content }));
    } catch (error) {
      console.error(`Failed to generate ${type} content:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Generate Additional Content</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {contentTypes.map((type) => (
          <div key={type.key} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>{type.icon}</span>
                <span className="font-medium">{type.label}</span>
              </div>
              <Button
                size="sm"
                onClick={() => generateContent(type.key)}
                disabled={loading[type.key] || (type.key === 'podcast' && !transcription)}
              >
                {loading[type.key] ? "..." : "Generate"}
              </Button>
            </div>

            {generatedContent[type.key] && (
              <div className="space-y-2">
                <div className="bg-muted p-3 rounded text-sm max-h-32 overflow-y-auto">
                  {generatedContent[type.key]}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedContent[type.key])}
                  className="w-full"
                >
                  Copy to Clipboard
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}