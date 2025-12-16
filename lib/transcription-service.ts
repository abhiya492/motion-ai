import OpenAI from "openai";

// Groq client setup
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function transcribeWithHuggingFace(audioBuffer: ArrayBuffer): Promise<string> {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/octet-stream",
      },
      method: "POST",
      body: audioBuffer,
    }
  );
  
  const result = await response.json();
  return result.text || "";
}

export async function transcribeAudio(fileResponse: Response): Promise<string> {
  // Convert Response to File for API compatibility
  const arrayBuffer = await fileResponse.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
  const file = new File([blob], 'audio.mp3', { type: 'audio/mpeg' });

  const providers = [
    { name: "Groq", client: groq, model: "whisper-large-v3" },
    { name: "OpenAI", client: openai, model: "whisper-1" },
  ];

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name} for transcription...`);
      
      const transcription = await provider.client.audio.transcriptions.create({
        model: provider.model,
        file: file,
      });

      console.log(`${provider.name} transcription successful`);
      return transcription.text;
    } catch (error) {
      console.error(`${provider.name} failed:`, error);
      continue;
    }
  }

  // Try Hugging Face as final fallback
  try {
    console.log("Trying Hugging Face for transcription...");
    const result = await transcribeWithHuggingFace(arrayBuffer);
    console.log("Hugging Face transcription successful");
    return result;
  } catch (error) {
    console.error("Hugging Face failed:", error);
  }

  throw new Error("All transcription providers failed");
}

export async function generateBlogContent(transcription: string, userPosts: string): Promise<string> {
  const providers = [
    { 
      name: "Groq", 
      client: groq, 
      model: "llama-3.1-8b-instant",
      maxTokens: 2000 
    },
    { 
      name: "OpenAI", 
      client: openai, 
      model: "gpt-4o-mini",
      maxTokens: 1000 
    },
  ];

  const prompt = `You are a skilled content writer. Convert this transcription into a well-structured blog post in Markdown format.

Previous posts style reference:
${userPosts}

Create a blog post with:
1. SEO-friendly title on first line
2. Engaging introduction
3. Main content with headings (##, ###)
4. Conclusion

Transcription: ${transcription}`;

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name} for content generation...`);
      
      const completion = await provider.client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: provider.model,
        temperature: 0.7,
        max_tokens: provider.maxTokens,
      });

      const content = completion.choices[0].message.content;
      if (content) {
        console.log(`${provider.name} generation successful`);
        return content;
      }
    } catch (error) {
      console.error(`${provider.name} failed:`, error);
      continue;
    }
  }

  // Fallback: Create simple blog post from transcription
  console.log("Using fallback blog generation...");
  return createFallbackBlogPost(transcription);
}

function createFallbackBlogPost(transcription: string): string {
  const title = "AI Generated Blog Post";
  const words = transcription.split(' ');
  const wordCount = words.length;
  
  return `# ${title}

## Introduction

This blog post was generated from an audio transcription containing ${wordCount} words.

## Content

${transcription}

## Summary

The above content was automatically transcribed and formatted into this blog post structure. You can edit and enhance this content using the editor.

---

*Generated on ${new Date().toLocaleDateString()}*`;
}