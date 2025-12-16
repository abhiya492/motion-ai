import BgGradient from "@/components/common/bg-gradient";
import { Badge } from "@/components/ui/badge";
import UpgradeYourPlan from "@/components/upload/upgrade-your-plan";
import UploadForm from "@/components/upload/upload-form";
import getDbConnection, { resetDailyUsage, incrementDailyUsage } from "@/lib/db";
import {
  doesUserExist,
  getPlanType,
  hasCancelledSubscription,
  updateUser,
} from "@/lib/user-helpers";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return redirect("/sign-in");
  }

  const email = clerkUser?.emailAddresses?.[0].emailAddress ?? "";

  const sql = await getDbConnection();
  
  let userId = null;
  let priceId = null;
  
  // Parallel database queries for better performance
  const [hasUserCancelled, user] = await Promise.all([
    hasCancelledSubscription(sql, email),
    doesUserExist(sql, email)
  ]);

  if (user) {
    userId = clerkUser?.id;
    if (userId) {
      await updateUser(sql, userId, email);
    }
    priceId = user[0].price_id;
  }

  const { id: planTypeId = "starter", name: planTypeName } = getPlanType(priceId);
  const isBasicPlan = planTypeId === "basic";
  const isProPlan = planTypeId === "pro";

  // Parallel queries for posts and usage
  const [posts, dailyUsage] = await Promise.all([
    sql`SELECT id, title, created_at FROM posts WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 10`,
    sql`SELECT usage_count FROM daily_usage WHERE user_id = ${userId} AND usage_date = CURRENT_DATE`
  ]);

  const currentUsage = dailyUsage[0]?.usage_count || 0;
  const canUpload = isProPlan || (isBasicPlan && currentUsage < 30) || (!isBasicPlan && !isProPlan && currentUsage < 3);

  return (
    <BgGradient>
      <div className="container mx-auto py-24 sm:py-32">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-700 text-white px-6 py-2 text-lg font-semibold capitalize shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
            {planTypeName} Plan
          </Badge>

          <h2 className="capitalize text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Start creating amazing content
          </h2>

          <p className="mt-2 text-lg leading-8 text-gray-700 max-w-2xl text-center">
            Upload your audio or video file and let our AI do the magic!
          </p>

          <p className="mt-2 text-lg leading-8 text-gray-700 max-w-2xl text-center">
            You get{" "}
            <span className="font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">
              {isProPlan ? "Unlimited" : isBasicPlan ? "30" : "3"} blog posts
            </span>{" "}
            as part of the{" "}
            <span className="font-bold capitalize">{planTypeName}</span> Plan.
            {!isProPlan && (
              <span className="block mt-2 text-sm text-gray-600">
                Used today: {currentUsage}
              </span>
            )}
          </p>

          {canUpload ? (
            <BgGradient>
              <UploadForm />
            </BgGradient>
          ) : (
            <UpgradeYourPlan />
          )}
        </div>
      </div>
    </BgGradient>
  );
}
