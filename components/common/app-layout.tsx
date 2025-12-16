"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Breadcrumb from "./breadcrumb";
import ThemeToggle from "./theme-toggle";
import KeyboardShortcuts from "./keyboard-shortcuts";
import { UserButton } from "@clerk/nextjs";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const hideLayoutRoutes = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  if (hideLayoutRoutes) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Sidebar />
      <KeyboardShortcuts />
      
      {/* Main content */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Top bar */}
        {pathname !== '/' && (
          <div className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-b border-gray-200 dark:border-border px-4 py-3">
            <Breadcrumb />
          </div>
        )}

        {/* Page content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}