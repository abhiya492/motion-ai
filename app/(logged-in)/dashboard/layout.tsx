import BgGradient from "@/components/common/bg-gradient";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <BgGradient>
      <div className="container mx-auto py-24 sm:py-32">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge className="bg-gradient-to-r from-purple-700 to-pink-800 text-white px-4 py-1 text-lg font-semibold capitalize">
            Dashboard
          </Badge>
          <h2 className="capitalize text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Welcome to your Dashboard!
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center">
            Here you can manage your content, view your posts, and much more.
          </p>
          {children}
        </div>
      </div>
    </BgGradient>
  );
}
