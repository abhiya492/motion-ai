"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Speaker {
  id: number;
  name: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

interface SpeakerAnalysisProps {
  audioUrl?: string;
  onAnalysisComplete: (speakers: Speaker[]) => void;
}

export function SpeakerAnalysis({ audioUrl, onAnalysisComplete }: SpeakerAnalysisProps) {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(false);

  const analyzeSpeakers = async () => {
    if (!audioUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/voice/speakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl })
      });

      const result = await response.json();
      setSpeakers(result.speakers);
      onAnalysisComplete(result.speakers);
    } catch (error) {
      console.error('Speaker analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">🎤 Speaker Analysis</h3>
        <Button onClick={analyzeSpeakers} disabled={loading || !audioUrl} size="sm">
          {loading ? "Analyzing..." : "Analyze Speakers"}
        </Button>
      </div>

      {speakers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Detected Speakers:</span>
            <Badge variant="secondary">{speakers.length} speakers</Badge>
          </div>

          {speakers.map((speaker) => (
            <div key={speaker.id} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{speaker.name}</h4>
                <Badge variant="outline">{speaker.segments.length} segments</Badge>
              </div>
              
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {speaker.segments.slice(0, 3).map((segment, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-muted-foreground">
                      {formatTime(segment.start)} - {formatTime(segment.end)}:
                    </span>
                    <span className="ml-2">{segment.text.substring(0, 100)}...</span>
                  </div>
                ))}
                {speaker.segments.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{speaker.segments.length - 3} more segments
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}