"use client";

import { useState } from "react";
import { SpeakerAnalysis } from "./speaker-analysis";
import { EmotionDetector } from "./emotion-detector";
import { VoiceCloner } from "./voice-cloner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Speaker, Emotion } from "@/types";

interface VoiceFeaturesProps {
  audioUrl?: string;
  transcription: string;
  userId: string;
}

export function VoiceFeatures({ audioUrl, transcription, userId }: VoiceFeaturesProps) {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [activeTab, setActiveTab] = useState<'speakers' | 'emotions' | 'clone'>('speakers');

  const tabs = [
    { key: 'speakers', label: 'Speakers', icon: '🎤' },
    { key: 'emotions', label: 'Emotions', icon: '😊' },
    { key: 'clone', label: 'Voice Clone', icon: '🎭' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Voice & Speaker Analysis</h2>
        <div className="flex gap-2">
          {speakers.length > 0 && (
            <Badge variant="secondary">{speakers.length} speakers</Badge>
          )}
          {emotions.length > 0 && (
            <Badge variant="secondary">{emotions.length} emotions</Badge>
          )}
        </div>
      </div>

      <div className="flex space-x-2 border-b">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.key as any)}
            className="flex items-center space-x-2"
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>

      {activeTab === 'speakers' && (
        <SpeakerAnalysis
          audioUrl={audioUrl}
          onAnalysisComplete={setSpeakers}
        />
      )}

      {activeTab === 'emotions' && (
        <EmotionDetector
          transcription={transcription}
          onEmotionsDetected={setEmotions}
        />
      )}

      {activeTab === 'clone' && (
        <VoiceCloner
          audioUrl={audioUrl}
          userId={userId}
        />
      )}
    </div>
  );
}