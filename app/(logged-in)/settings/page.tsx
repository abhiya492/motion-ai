import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await currentUser();
  
  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Account Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and settings.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Preferences</h2>
          <p className="text-gray-600 dark:text-gray-400">Customize your experience and notifications.</p>
        </div>
      </div>
    </div>
  );
}