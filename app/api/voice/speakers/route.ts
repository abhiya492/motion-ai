import { NextRequest, NextResponse } from "next/server";
import { analyzeSpeakers } from "@/lib/voice-analysis-service";

export async function POST(request: NextRequest) {
  try {
    const { audioUrl } = await request.json();

    if (!audioUrl) {
      return NextResponse.json({ error: "Audio URL is required" }, { status: 400 });
    }

    const response = await fetch(audioUrl);
    const audioBuffer = await response.arrayBuffer();
    
    const speakers = await analyzeSpeakers(audioBuffer);
    
    return NextResponse.json({ speakers });
  } catch (error) {
    console.error("Speaker analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze speakers" }, { status: 500 });
  }
}