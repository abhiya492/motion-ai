import { NextRequest, NextResponse } from "next/server";
import { cloneVoice } from "@/lib/voice-analysis-service";
import getDbConnection from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { audioUrl, voiceName, userId } = await request.json();

    if (!audioUrl || !voiceName || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const response = await fetch(audioUrl);
    const audioBuffer = await response.arrayBuffer();
    
    const voiceId = await cloneVoice(audioBuffer, voiceName);
    
    if (voiceId) {
      const sql = await getDbConnection();
      await sql`
        INSERT INTO voice_clones (user_id, name, voice_id, sample_audio_url)
        VALUES (${userId}, ${voiceName}, ${voiceId}, ${audioUrl})
      `;
      
      return NextResponse.json({ 
        success: true, 
        voiceClone: { id: voiceId, name: voiceName, voice_id: voiceId }
      });
    }
    
    return NextResponse.json({ error: "Voice cloning failed" }, { status: 500 });
  } catch (error) {
    console.error("Voice cloning error:", error);
    return NextResponse.json({ error: "Failed to clone voice" }, { status: 500 });
  }
}