"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const shortcuts = [
  { key: "d", action: "dashboard", description: "Go to Dashboard" },
  { key: "p", action: "posts", description: "View Posts" },
  { key: "a", action: "analytics", description: "View Analytics" },
  { key: "u", action: "upload", description: "Upload File" },
  { key: "?", action: "help", description: "Show Shortcuts" },
];

export default function KeyboardShortcuts() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger on Cmd/Ctrl + key
      if (!(e.metaKey || e.ctrlKey)) return;
      
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case "d":
          e.preventDefault();
          router.push("/dashboard");
          break;
        case "p":
          e.preventDefault();
          router.push("/posts");
          break;
        case "a":
          e.preventDefault();
          router.push("/analytics");
          break;
        case "/":
        case "?":
          e.preventDefault();
          showShortcuts();
          break;
      }
    };

    const showShortcuts = () => {
      toast({
        title: "⌨️ Keyboard Shortcuts",
        description: (
          <div className="space-y-1 text-sm">
            {shortcuts.map(shortcut => (
              <div key={shortcut.key} className="flex justify-between">
                <span>{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                  ⌘{shortcut.key.toUpperCase()}
                </kbd>
              </div>
            ))}
          </div>
        ),
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, toast]);

  return null;
}