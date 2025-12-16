"use client";

import { useState, useEffect } from "react";
import { SEOSuggestions } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SEOOptimizerProps {
  content: string;
  onSEOUpdate: (seo: SEOSuggestions) => void;
}

export function SEOOptimizer({ content, onSEOUpdate }: SEOOptimizerProps) {
  const [seoSuggestions, setSeoSuggestions] = useState<SEOSuggestions | null>(null);
  const [loading, setLoading] = useState(false);

  const generateSEO = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const seo = await response.json();
      setSeoSuggestions(seo);
      onSEOUpdate(seo);
    } catch (error) {
      console.error('SEO generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">SEO Optimization</h3>
        <Button onClick={generateSEO} disabled={loading} size="sm">
          {loading ? "Generating..." : "Generate SEO"}
        </Button>
      </div>

      {seoSuggestions && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">SEO Title</label>
            <Input 
              value={seoSuggestions.title} 
              onChange={(e) => setSeoSuggestions({...seoSuggestions, title: e.target.value})}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {seoSuggestions.title.length}/60 characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Meta Description</label>
            <Input 
              value={seoSuggestions.meta_description}
              onChange={(e) => setSeoSuggestions({...seoSuggestions, meta_description: e.target.value})}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {seoSuggestions.meta_description.length}/160 characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Keywords</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {seoSuggestions.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">{keyword}</Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Suggested Headings</label>
            <ul className="mt-2 space-y-1">
              {seoSuggestions.headings.map((heading, index) => (
                <li key={index} className="text-sm text-muted-foreground">• {heading}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}