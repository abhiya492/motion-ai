import BgGradient from "@/components/common/bg-gradient";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <BgGradient>
      <div className="container mx-auto py-24 sm:py-32">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-700 text-white px-6 py-2 text-lg font-semibold capitalize shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
            Dashboard
          </Badge>
          <h2 className="capitalize text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Welcome to your Dashboard!
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-700 max-w-2xl text-center">
            Here you can manage your content, view your posts, and much more.
          </p>
          {children}
        </div>
      </div>
    </BgGradient>
  );
}
