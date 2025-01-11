import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UpgradeYourPlan() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center border-2 border-red-200 bg-red-100 p-4 rounded-lg border-dashed">
        The Basic Plan is free and accessible after 3 usages. Upgrade to the Pro Plan for unlimited access.
      </p>
    </div>
  );
}
