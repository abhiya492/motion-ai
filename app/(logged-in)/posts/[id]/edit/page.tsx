import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import getDbConnection from "@/lib/db";
import SplitScreenEditor from "@/components/content/split-screen-editor";

interface EditPostPageProps {
  params: { id: string };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const user = await currentUser();
  
  if (!user) {
    return redirect("/sign-in");
  }

  const sql = await getDbConnection();
  const posts = await sql`
    SELECT * FROM posts 
    WHERE id = ${params.id} AND user_id = ${user.id}
  `;

  if (posts.length === 0) {
    return redirect("/posts");
  }

  const post = posts[0];

  return (
    <div className="h-screen">
      <SplitScreenEditor
        postId={post.id}
        initialTitle={post.title}
        initialContent={post.content}
      />
    </div>
  );
}