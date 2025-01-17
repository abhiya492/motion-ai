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

  // Reset daily usage at the start of the Dashboard function
  await resetDailyUsage();

  //updatethe user id
  let userId = null;
  let priceId = null;

   
  const hasUserCancelled = await hasCancelledSubscription(sql, email);
  const user = await doesUserExist(sql, email);

  if (user) {
    //update the user_id in users table
    userId = clerkUser?.id;
    if (userId) {
      await updateUser(sql, userId, email);
    }

    priceId = user[0].price_id;
  }

  const { id: planTypeId = "starter", name: planTypeName } =
    getPlanType(priceId);

  const isBasicPlan = planTypeId === "basic";
  const isProPlan = planTypeId === "pro";

  // check number of posts per plan
  const posts = await sql`SELECT * FROM posts WHERE user_id = ${userId}`;

  // Check daily usage from the daily_usage table
  const dailyUsage = await sql`
    SELECT usage_count FROM daily_usage 
    WHERE user_id = ${userId} AND usage_date = CURRENT_DATE
  `;

  const isValidBasicPlan = isBasicPlan && dailyUsage[0]?.usage_count < 30;

  console.log("isValidBasicPlan:", isValidBasicPlan);

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

          {(isBasicPlan || isProPlan) && (
            <p className="mt-2 text-lg leading-8 text-gray-700 max-w-2xl text-center">
              You get{" "}
              <span className="font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">
                {isBasicPlan ? "30" : "Unlimited"} blog posts
              </span>{" "}
              as part of the{" "}
              <span className="font-bold capitalize">{planTypeName}</span> Plan.
            </p>
          )}

          {isValidBasicPlan ? (
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
