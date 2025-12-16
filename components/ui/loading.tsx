import { Loader2 } from "lucide-react";

export function Loading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}