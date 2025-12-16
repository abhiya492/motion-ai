import { NextRequest, NextResponse } from "next/server";
import { generateSEOSuggestions } from "@/lib/content-generation-service";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const seoSuggestions = await generateSEOSuggestions(content);
    
    return NextResponse.json(seoSuggestions);
  } catch (error) {
    console.error("SEO generation error:", error);
    return NextResponse.json({ error: "Failed to generate SEO suggestions" }, { status: 500 });
  }
}