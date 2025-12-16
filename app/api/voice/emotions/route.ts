import { NextRequest, NextResponse } from "next/server";
import { detectEmotions } from "@/lib/voice-analysis-service";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const emotions = await detectEmotions(text);
    
    return NextResponse.json({ emotions });
  } catch (error) {
    console.error("Emotion detection error:", error);
    return NextResponse.json({ error: "Failed to detect emotions" }, { status: 500 });
  }
}