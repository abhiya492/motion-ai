import { NextRequest, NextResponse } from "next/server";
import { generateSocialMediaPost } from "@/lib/content-generation-service";

export async function POST(request: NextRequest) {
  try {
    const { content, platform } = await request.json();

    if (!content || !platform) {
      return NextResponse.json({ error: "Content and platform are required" }, { status: 400 });
    }

    const socialPost = await generateSocialMediaPost(content, platform);
    
    return NextResponse.json({ content: socialPost });
  } catch (error) {
    console.error("Social media generation error:", error);
    return NextResponse.json({ error: "Failed to generate social media post" }, { status: 500 });
  }
}