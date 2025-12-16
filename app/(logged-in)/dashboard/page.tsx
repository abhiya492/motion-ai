import BgGradient from "@/components/common/bg-gradient";
import { Badge } from "@/components/ui/badge";
import UpgradeYourPlan from "@/components/upload/upgrade-your-plan";
import EnhancedUploadFormV2 from "@/components/upload/enhanced-upload-form-v2";
import UsageMeter from "@/components/upload/usage-meter";
import QuickActionsPanel from "@/components/upload/quick-actions-panel";
import SmartRecommendations from "@/components/upload/smart-recommendations";
import getDbConnection from "@/lib/db";
import {
  doesUserExist,
  getPlanType,
  hasCancelledSubscription,
  updateUser,
} from "@/lib/user-helpers";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/upload/dashboard-client";

export default async function Dashboard() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return redirect("/sign-in");
  }

  const email = clerkUser?.emailAddresses?.[0].emailAddress ?? "";
  const sql = await getDbConnection();
  
  let userId = null;
  let priceId = null;
  
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

  const [posts, dailyUsage] = await Promise.all([
    sql`SELECT id, title, created_at FROM posts WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 10`,
    sql`SELECT usage_count FROM daily_usage WHERE user_id = ${userId} AND usage_date = CURRENT_DATE`
  ]);

  const currentUsage = dailyUsage[0]?.usage_count || 0;
  const canUpload = isProPlan || (isBasicPlan && currentUsage < 30) || (!isBasicPlan && !isProPlan && currentUsage < 3);
  const maxUsage = isProPlan ? 999 : isBasicPlan ? 30 : 3;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-700 text-white px-6 py-2 text-lg font-semibold capitalize shadow-lg transform transition duration-300 ease-in-out hover:scale-105 mb-4">
          {planTypeName} Plan
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
          Create Amazing Content
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Upload your audio or video file and let our AI transform it into engaging blog posts!
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Usage Meter */}
        <UsageMeter 
          currentUsage={currentUsage}
          maxUsage={maxUsage}
          planType={planTypeName}
          isProPlan={isProPlan}
        />
        
        {/* Quick Actions */}
        <QuickActionsPanel recentPosts={posts} />
        
        {/* Smart Recommendations - Placeholder */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Smart Recommendations</h3>
          <p className="text-gray-600 dark:text-gray-400">AI-suggested templates coming soon...</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="max-w-4xl mx-auto">
        {canUpload ? (
          <DashboardClient userId={userId || ''} canUpload={canUpload} />
        ) : (
          <div className="text-center">
            <UpgradeYourPlan />
          </div>
        )}
      </div>
    </div>
  );
}
