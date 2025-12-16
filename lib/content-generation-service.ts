import OpenAI from "openai";
import { ContentTemplate, SEOSuggestions } from "@/types";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContentWithTemplate(
  transcription: string,
  template: ContentTemplate,
  targetLanguage: string = 'en'
): Promise<string> {
  const prompt = `${template.prompt_template}\n\nTranscription: ${transcription}\n\nWrite in ${targetLanguage} language. Use markdown formatting.`;

  const providers = [
    { client: groq, model: "llama-3.1-8b-instant" },
    { client: openai, model: "gpt-4o-mini" },
  ];

  for (const provider of providers) {
    try {
      const completion = await provider.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: provider.model,
        temperature: 0.7,
        max_tokens: 2000,
      });

      return completion.choices[0].message.content || "";
    } catch (error) {
      console.error(`Provider failed:`, error);
      continue;
    }
  }

  throw new Error("All content generation providers failed");
}

export async function generateSEOSuggestions(content: string): Promise<SEOSuggestions> {
  const prompt = `Analyze this blog content and provide SEO suggestions:

Content: ${content}

Provide:
1. SEO-optimized title (max 60 chars)
2. Meta description (max 160 chars)
3. 5-8 relevant keywords
4. Suggested H2/H3 headings

Format as JSON: {"title": "", "meta_description": "", "keywords": [], "headings": []}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
    });

    const result = completion.choices[0].message.content;
    return JSON.parse(result || "{}");
  } catch (error) {
    return {
      title: "Generated Blog Post",
      meta_description: "AI-generated blog post from video transcription",
      keywords: ["blog", "ai", "content"],
      headings: ["Introduction", "Main Content", "Conclusion"]
    };
  }
}

export async function generateSocialMediaPost(
  content: string,
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
): Promise<string> {
  const platformSpecs = {
    twitter: "280 characters, engaging, use hashtags",
    linkedin: "Professional tone, 1300 characters, include call-to-action",
    facebook: "Conversational, 500 characters, encourage engagement",
    instagram: "Visual-focused caption, 150 words, use emojis and hashtags"
  };

  const prompt = `Create a ${platform} post from this blog content:

${content}

Requirements: ${platformSpecs[platform]}

Make it engaging and platform-appropriate.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.8,
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    return `Check out this new blog post! ${content.substring(0, 100)}...`;
  }
}

export async function generateEmailNewsletter(content: string): Promise<string> {
  const prompt = `Transform this blog content into an email newsletter:

${content}

Include:
1. Catchy subject line
2. Personal greeting
3. Brief intro
4. Key highlights (3-4 points)
5. Call-to-action
6. Sign-off

Format as HTML email template.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    return `<h2>Newsletter</h2><p>${content.substring(0, 200)}...</p>`;
  }
}

export async function generatePodcastShowNotes(transcription: string): Promise<string> {
  const prompt = `Create podcast show notes from this transcription:

${transcription}

Include:
1. Episode summary (2-3 sentences)
2. Key topics discussed
3. Timestamps for major topics
4. Guest information (if mentioned)
5. Resources mentioned
6. Action items for listeners

Format in markdown.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.6,
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    return `# Podcast Show Notes\n\n## Summary\n${transcription.substring(0, 300)}...`;
  }
}