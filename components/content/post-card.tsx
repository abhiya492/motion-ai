"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Clock,
  FileText,
  Globe
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  status?: string;
  language?: string;
  template?: string;
  tags?: string[];
  word_count?: number;
}

interface PostCardProps {
  post: Post;
  viewMode: "grid" | "list";
  isSelected: boolean;
  onSelect: (id: string) => void;
  onAction: (action: string, id: string) => void;
}

export default function PostCard({ post, viewMode, isSelected, onSelect, onAction }: PostCardProps) {
  const [showActions, setShowActions] = useState(false);
  
  const wordCount = post.word_count || post.content?.length || 0;
  const readTime = Math.ceil(wordCount / 200);
  const excerpt = post.content?.split('\n').slice(1, 3).join(' ').substring(0, 150) + '...';

  if (viewMode === "list") {
    return (
      <div className={`flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow ${
        isSelected ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700'
      }`}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(post.id)}
          className="w-4 h-4 text-purple-600"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {post.title}
            </h3>
            {post.status && (
              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                {post.status}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {excerpt}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {wordCount} words
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {readTime} min
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Link href={`/posts/${post.id}`}>
            <Button size="sm" variant="ghost">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onAction('edit', post.id)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onAction('delete', post.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group border rounded-xl p-6 hover:shadow-lg transition-all duration-200 ${
      isSelected ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    }`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(post.id)}
        className="absolute top-4 right-4 w-4 h-4 text-purple-600"
      />

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
              {post.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            {post.status && (
              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                {post.status}
              </Badge>
            )}
            {post.language && (
              <Badge variant="outline" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                {post.language.toUpperCase()}
              </Badge>
            )}
            {post.template && (
              <Badge variant="outline" className="text-xs">
                {post.template}
              </Badge>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
            {excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {wordCount} words
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime} min read
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <Link href={`/posts/${post.id}`}>
              <Button size="sm" variant="outline" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            </Link>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onAction('edit', post.id)}
              className="text-xs"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onAction('delete', post.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}