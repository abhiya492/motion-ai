import BgGradient from "@/components/common/bg-gradient";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

export default function PostsLayout({ children }: { children: ReactNode }) {
  return (
    <BgGradient>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge className="bg-gradient-to-r from-purple-700 to-pink-800 text-white px-4 py-1 text-lg font-semibold capitalize">
            Posts
          </Badge>
          {children}
        </div>
      </div>
    </BgGradient>
  );
}
