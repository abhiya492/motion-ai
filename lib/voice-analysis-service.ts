import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Speaker {
  id: number;
  name: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

interface Emotion {
  timestamp: number;
  emotion: string;
  confidence: number;
}

export async function analyzeSpeakers(audioBuffer: ArrayBuffer): Promise<Speaker[]> {
  try {
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const file = new File([blob], 'audio.mp3', { type: 'audio/mpeg' });

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: file,
      response_format: "verbose_json",
      timestamp_granularities: ["segment"]
    });

    // Simple speaker detection based on pauses and voice changes
    const speakers: Speaker[] = [];
    let currentSpeaker = 1;
    let currentSegments: any[] = [];

    transcription.segments?.forEach((segment: any, index: number) => {
      const pauseDuration = index > 0 ? 
        segment.start - transcription.segments![index - 1].end : 0;
      
      // New speaker if pause > 2 seconds
      if (pauseDuration > 2 && currentSegments.length > 0) {
        speakers.push({
          id: currentSpeaker,
          name: `Speaker ${currentSpeaker}`,
          segments: currentSegments
        });
        currentSpeaker++;
        currentSegments = [];
      }

      currentSegments.push({
        start: segment.start,
        end: segment.end,
        text: segment.text
      });
    });

    if (currentSegments.length > 0) {
      speakers.push({
        id: currentSpeaker,
        name: `Speaker ${currentSpeaker}`,
        segments: currentSegments
      });
    }

    return speakers;
  } catch (error) {
    console.error('Speaker analysis failed:', error);
    return [];
  }
}

export async function detectEmotions(text: string): Promise<Emotion[]> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{
        role: "user",
        content: `Analyze the emotional tone of this text and return emotions with timestamps. Text: "${text}". Return JSON array: [{"timestamp": 0, "emotion": "happy", "confidence": 0.8}]`
      }],
      model: "gpt-4o-mini",
      temperature: 0.3,
    });

    const result = completion.choices[0].message.content;
    return JSON.parse(result || "[]");
  } catch (error) {
    console.error('Emotion detection failed:', error);
    return [];
  }
}

export async function removeBackgroundNoise(audioUrl: string): Promise<string> {
  // Placeholder for noise removal - would integrate with services like Krisp or Adobe
  // For now, return original URL
  return audioUrl;
}

export async function cloneVoice(audioBuffer: ArrayBuffer, voiceName: string): Promise<string> {
  if (!process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
    // Return mock voice ID for demo
    return `mock_voice_${Date.now()}`;
  }

  try {
    const formData = new FormData();
    formData.append('name', voiceName);
    formData.append('files', new Blob([audioBuffer], { type: 'audio/mpeg' }));

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ELEVENLABS_API_KEY}`,
      },
      body: formData
    });

    const result = await response.json();
    return result.voice_id || '';
  } catch (error) {
    console.error('Voice cloning failed:', error);
    return `mock_voice_${Date.now()}`;
  }
}

export async function generateSpeech(text: string, voiceId: string): Promise<ArrayBuffer> {
  if (!process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
    // Return empty audio buffer for demo
    return new ArrayBuffer(0);
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ELEVENLABS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Speech generation failed:', error);
    return new ArrayBuffer(0);
  }
}