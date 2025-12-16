"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  posts: "Posts",
  analytics: "Analytics", 
  features: "Features",
  settings: "Settings",
  "sign-in": "Sign In",
  "sign-up": "Sign Up"
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="flex items-center hover:text-purple-600 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        
        return (
          <div key={segment} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">{name}</span>
            ) : (
              <Link href={href} className="hover:text-purple-600 transition-colors">
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}