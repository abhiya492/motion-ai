"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Emotion {
  timestamp: number;
  emotion: string;
  confidence: number;
}

interface EmotionDetectorProps {
  transcription: string;
  onEmotionsDetected: (emotions: Emotion[]) => void;
}

export function EmotionDetector({ transcription, onEmotionsDetected }: EmotionDetectorProps) {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(false);

  const detectEmotions = async () => {
    if (!transcription) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/voice/emotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcription })
      });

      const result = await response.json();
      setEmotions(result.emotions);
      onEmotionsDetected(result.emotions);
    } catch (error) {
      console.error('Emotion detection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: "bg-yellow-100 text-yellow-800",
      sad: "bg-blue-100 text-blue-800",
      angry: "bg-red-100 text-red-800",
      neutral: "bg-gray-100 text-gray-800",
      excited: "bg-orange-100 text-orange-800",
      calm: "bg-green-100 text-green-800"
    };
    return colors[emotion] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">😊 Emotion Analysis</h3>
        <Button onClick={detectEmotions} disabled={loading || !transcription} size="sm">
          {loading ? "Analyzing..." : "Detect Emotions"}
        </Button>
      </div>

      {emotions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Detected Emotions:</span>
            <Badge variant="secondary">{emotions.length} emotions</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {emotions.slice(0, 6).map((emotion, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <Badge className={getEmotionColor(emotion.emotion)}>
                  {emotion.emotion}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {Math.round(emotion.confidence * 100)}%
                </span>
              </div>
            ))}
          </div>

          {emotions.length > 6 && (
            <div className="text-xs text-muted-foreground text-center">
              +{emotions.length - 6} more emotions detected
            </div>
          )}
        </div>
      )}
    </div>
  );
}