"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getIcon = () => {
    switch (theme) {
      case "light": return <Sun className="w-5 h-5" />;
      case "dark": return <Moon className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={`Current theme: ${theme}`}
    >
      {getIcon()}
    </button>
  );
}