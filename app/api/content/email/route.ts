import { NextRequest, NextResponse } from "next/server";
import { generateEmailNewsletter } from "@/lib/content-generation-service";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const emailContent = await generateEmailNewsletter(content);
    
    return NextResponse.json({ content: emailContent });
  } catch (error) {
    console.error("Email generation error:", error);
    return NextResponse.json({ error: "Failed to generate email newsletter" }, { status: 500 });
  }
}