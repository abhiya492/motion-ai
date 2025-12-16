import { NextRequest, NextResponse } from "next/server";
import { generatePodcastShowNotes } from "@/lib/content-generation-service";

export async function POST(request: NextRequest) {
  try {
    const { transcription } = await request.json();

    if (!transcription) {
      return NextResponse.json({ error: "Transcription is required" }, { status: 400 });
    }

    const podcastNotes = await generatePodcastShowNotes(transcription);
    
    return NextResponse.json({ content: podcastNotes });
  } catch (error) {
    console.error("Podcast notes generation error:", error);
    return NextResponse.json({ error: "Failed to generate podcast show notes" }, { status: 500 });
  }
}