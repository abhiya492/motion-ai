/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updatePostAction(data: {
  postId: string;
  content: string;
}) {
  const { postId, content } = data;

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  try {
    const sql = await getDbConnection();

    const [title, ...contentParts] = content?.split("\n\n") || [];
    const updatedTitle = title?.split("#")[1]?.trim();

    if (!updatedTitle) {
      console.error("Error: updatedTitle is undefined for postId", postId);
      return {
        success: false,
        message: "Title is missing or invalid",
      };
    }

    await sql`UPDATE posts SET content = ${content}, title = ${updatedTitle} where id = ${postId}`;
  } catch (error) {
    console.error("Error occurred in updating the post", postId, error);
    return {
      success: false,
    };
  }

  revalidatePath(`/posts/${postId}`);
  return {
    success: true,
  };
}
