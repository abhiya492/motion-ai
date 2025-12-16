import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EnhancedContentEditor } from "@/components/content/enhanced-content-editor";

export default async function PostPage({ params }: { params: { id: string } }) {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Validate post ID format
  if (!/^\d+$/.test(params.id)) {
    return redirect("/posts");
  }

  const sql = await getDbConnection();
  const post = await sql`SELECT * FROM posts WHERE id = ${params.id} AND user_id = ${user.id}`;

  if (!post.length) {
    return redirect("/posts");
  }

  const postData = post[0];
  return (
    <EnhancedContentEditor 
      initialContent={postData.content}
      postId={postData.id}
    />
  );
}
