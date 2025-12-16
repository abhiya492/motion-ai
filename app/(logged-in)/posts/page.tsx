"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import PostsFilter from "@/components/content/posts-filter";
import PostsToolbar from "@/components/content/posts-toolbar";
import PostCard from "@/components/content/post-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PostsPage() {
  const { user, isLoaded } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("created_desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      redirect("/sign-in");
      return;
    }

    fetchPosts();
  }, [user, isLoaded]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [posts, searchTerm, filters, sortBy]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      console.log('Fetched posts data:', data);
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...(posts || [])];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(post => {
          switch (key) {
            case 'dateRange':
              const postDate = new Date(post.created_at);
              const now = new Date();
              switch (value) {
                case 'today':
                  return postDate.toDateString() === now.toDateString();
                case 'week':
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                  return postDate >= weekAgo;
                case 'month':
                  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                  return postDate >= monthAgo;
                default:
                  return true;
              }
            default:
              return post[key]?.toLowerCase().includes(value.toLowerCase());
          }
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredPosts(filtered);
  };

  const handlePostSelect = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleBulkAction = async (action: string) => {
    console.log(`Bulk ${action} for posts:`, selectedPosts);
    // Implement bulk actions
    setSelectedPosts([]);
  };

  const handlePostAction = async (action: string, postId: string) => {
    console.log(`${action} post:`, postId);
    // Implement individual post actions
  };

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Posts ✍️
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and organize your content
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            You have no posts yet. Upload a video or audio to get started.
          </p>
          <Link
            href="/dashboard"
            className="text-purple-700 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium flex gap-2 items-center justify-center"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <PostsFilter 
            onFilterChange={setFilters}
            onSearchChange={setSearchTerm}
          />
          
          <PostsToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedCount={selectedPosts.length}
            onBulkAction={handleBulkAction}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                viewMode={viewMode}
                isSelected={selectedPosts.includes(post.id)}
                onSelect={handlePostSelect}
                onAction={handlePostAction}
              />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No posts match your current filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
