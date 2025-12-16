import { Button } from "../ui/button";
import Link from "next/link";

export default function UpgradeYourPlan() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center border-2 border-red-200 bg-red-100 p-4 rounded-lg border-dashed">
        You've reached your daily limit. Upgrade to Pro for unlimited access or try again tomorrow.
      </p>
      <Button className="bg-purple-600 hover:bg-purple-700">
        <Link href="/#pricing">Upgrade to Pro</Link>
      </Button>
    </div>
  );
}
