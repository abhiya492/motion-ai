"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ElevenLabsPricing } from "./elevenlabs-pricing";

interface VoiceClone {
  id: string;
  name: string;
  voice_id: string;
}

interface VoiceClonerProps {
  audioUrl?: string;
  userId: string;
}

export function VoiceCloner({ audioUrl, userId }: VoiceClonerProps) {
  const [voiceClones, setVoiceClones] = useState<VoiceClone[]>([]);
  const [loading, setLoading] = useState(false);
  const [voiceName, setVoiceName] = useState("");
  const [generatedAudio, setGeneratedAudio] = useState<string>("");
  const [textToSpeak, setTextToSpeak] = useState("");

  const cloneVoice = async () => {
    if (!audioUrl || !voiceName) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/voice/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl, voiceName, userId })
      });

      const result = await response.json();
      if (result.success) {
        setVoiceClones(prev => [...prev, result.voiceClone]);
        setVoiceName("");
      }
    } catch (error) {
      console.error('Voice cloning failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSpeech = async (voiceId: string) => {
    if (!textToSpeak) return;
    
    try {
      const response = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak, voiceId })
      });

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setGeneratedAudio(audioUrl);
    } catch (error) {
      console.error('Speech generation failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <ElevenLabsPricing />
      
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">🎭 Voice Cloning (Demo Mode)</h3>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Voice clone name"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
            />
            <Button onClick={cloneVoice} disabled={loading || !audioUrl || !voiceName}>
              {loading ? "Cloning..." : "Clone Voice"}
            </Button>
          </div>

          {voiceClones.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Your Voice Clones:</span>
              {voiceClones.map((clone) => (
                <div key={clone.id} className="flex items-center justify-between p-2 border rounded">
                  <Badge variant="outline">{clone.name}</Badge>
                  <Button 
                    size="sm" 
                    onClick={() => generateSpeech(clone.voice_id)}
                    disabled={!textToSpeak}
                  >
                    Generate Speech
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Input
              placeholder="Enter text to convert to speech"
              value={textToSpeak}
              onChange={(e) => setTextToSpeak(e.target.value)}
            />
            
            {generatedAudio && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Generated Audio:</span>
                <audio controls className="w-full">
                  <source src={generatedAudio} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}