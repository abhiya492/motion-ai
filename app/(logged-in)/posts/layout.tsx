import BgGradient from "@/components/common/bg-gradient";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

export default function PostsLayout({ children }: { children: ReactNode }) {
  return (
    <BgGradient>
      <div className="container mx-auto py-24 sm:py-32">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge className="bg-gradient-to-r from-purple-700 to-pink-800 text-white px-4 py-1 text-lg font-semibold capitalize">
            Upload your Posts and see magic
          </Badge>
          {children}
        </div>
      </div>
    </BgGradient>
  );
}
