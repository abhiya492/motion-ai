"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FileText, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Upload,
  Sparkles
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Features", href: "/features", icon: Sparkles },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${isCollapsed ? 'hidden' : 'block'}`} 
           onClick={() => setIsCollapsed(true)} />
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white/95 dark:bg-card/95 backdrop-blur-sm border-r border-gray-200 dark:border-border z-50 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } lg:translate-x-0 ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-border">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Upload className="w-8 h-8 text-purple-600" />
              <span className="font-bold text-lg">Motion AI</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-accent transition-colors"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-medium' 
                    : 'text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-lg lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}