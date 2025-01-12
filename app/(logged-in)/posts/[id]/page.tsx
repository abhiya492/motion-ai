import { incrementDailyUsage } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function PostPage({ params }) {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const postId = params.id;

  // Call incrementDailyUsage when a new post is created
  await incrementDailyUsage(user.id);

  return (
    <div>
      <h1>Post {postId}</h1>
      {/* Render post content */}
    </div>
  );
}
