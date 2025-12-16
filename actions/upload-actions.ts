/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import getDbConnection from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { transcribeAudio, generateBlogContent } from "@/lib/transcription-service";

async function retryWithExponentialBackoff(fn, retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      const backoffDelay = delay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${retries} after ${backoffDelay}ms`);
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }
}

export async function transcribeUploadedFile(
  resp: {
    serverData: { userId: string; file: any };
  }[]
) {
  if (!resp) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: fileUrl, name: fileName },
    },
  } = resp[0];

  if (!fileUrl || !fileName) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  const response = await fetch(fileUrl);
  const clonedResponse = response.clone(); 

  try {
    const transcriptionResult = await retryWithExponentialBackoff(() =>
      transcribeAudio(clonedResponse)
    );
    
    const transcriptions = { 
      text: transcriptionResult.text, 
      language: transcriptionResult.language 
    };

    console.log({ transcriptions });
    return {
      success: true,
      message: "File uploaded successfully!",
      data: { transcriptions, userId },
    };
  } catch (error) {
    console.error("Error processing file", error);

    if (error instanceof OpenAI.APIError && error.status === 413) {
      return {
        success: false,
        message: "File size exceeds the max limit of 20MB",
        data: null,
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Error processing file",
      data: null,
    };
  }
}

async function saveBlogPost(userId: string, title: string, content: string) {
  try {
    const sql = await getDbConnection();
    const [insertedPost] = await sql`
    INSERT INTO posts (user_id, title, content)
    VALUES (${userId}, ${title}, ${content})
    RETURNING id
    `;
    return insertedPost.id;
  } catch (error) {
    console.error("Error saving blog post", error);
    throw error;
  }
}

async function getUserBlogPosts(userId: string) {
  try {
    const sql = await getDbConnection();
    const posts = await sql`
    SELECT content FROM posts 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC 
    LIMIT 30
  `;
    return posts.map((post) => post.content).join("\n\n");
  } catch (error) {
    console.error("Error getting user blog posts", error);
    throw error;
  }
}

async function generateBlogPost({
  transcriptions,
  userPosts,
  targetLanguage,
  sourceLanguage,
  template,
}: {
  transcriptions: string;
  userPosts: string;
  targetLanguage?: string;
  sourceLanguage?: string;
  template?: string;
}) {
  return await generateBlogContent(transcriptions, userPosts, targetLanguage as any, sourceLanguage as any, template);
}
export async function generateBlogPostAction({
  transcriptions,
  userId,
  targetLanguage = 'en',
  template,
}: {
  transcriptions: { text: string; language?: string };
  userId: string;
  targetLanguage?: string;
  template?: string;
}) {
  const userPosts = await getUserBlogPosts(userId);

  let postId = null;

  if (transcriptions) {
    const blogPost = await generateBlogPost({
      transcriptions: transcriptions.text,
      userPosts,
      targetLanguage,
      sourceLanguage: transcriptions.language,
      template,
    });

    if (!blogPost) {
      return {
        success: false,
        message: "Blog post generation failed, please try again...",
      };
    }

    const [title, ...contentParts] = blogPost?.split("\n\n") || [];

    //database connection
    if (blogPost) {
      postId = await saveBlogPost(userId, title, blogPost);
      // Increment daily usage after successful blog post creation
      const sql = await getDbConnection();
      await sql`
        INSERT INTO daily_usage (user_id, usage_date, usage_count)
        VALUES (${userId}, CURRENT_DATE, 1)
        ON CONFLICT (user_id, usage_date)
        DO UPDATE SET usage_count = daily_usage.usage_count + 1
      `;
    }
  }

  //navigate
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}
