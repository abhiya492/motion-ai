import { NextRequest, NextResponse } from "next/server";
import { generateSpeech } from "@/lib/voice-analysis-service";

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json();

    if (!text || !voiceId) {
      return NextResponse.json({ error: "Text and voice ID are required" }, { status: 400 });
    }

    const audioBuffer = await generateSpeech(text, voiceId);
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="generated-speech.mp3"'
      }
    });
  } catch (error) {
    console.error("Speech generation error:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}