"use client";

import { FileText, Settings, BarChart3, Clock } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  created_at: string;
}

interface QuickActionsPanelProps {
  recentPosts: Post[];
}

export default function QuickActionsPanel({ recentPosts }: QuickActionsPanelProps) {
  return (
    <div className="bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-border">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link href="/posts" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">All Posts</span>
        </Link>
        
        <Link href="/analytics" className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">Analytics</span>
        </Link>
      </div>

      {recentPosts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Posts
          </h4>
          <div className="space-y-2">
            {recentPosts.slice(0, 3).map((post) => (
              <Link 
                key={post.id} 
                href={`/posts/${post.id}`}
                className="block p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-foreground truncate">{post.title}</p>
                <p className="text-xs text-gray-500 dark:text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}