"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, RotateCcw, Eye, Trash2 } from "lucide-react";

interface Version {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: string;
  type: 'manual' | 'auto';
}

interface VersionHistoryProps {
  postId: string;
  onRestore: (version: Version) => void;
}

export default function VersionHistory({ postId, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVersions();
  }, [postId]);

  const fetchVersions = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/versions`);
      const data = await response.json();
      setVersions(data);
    } catch (error) {
      console.error('Failed to fetch versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (version: Version) => {
    if (confirm('Are you sure you want to restore this version? Current changes will be saved as a new version.')) {
      onRestore(version);
    }
  };

  const handleDelete = async (versionId: string) => {
    if (confirm('Are you sure you want to delete this version?')) {
      try {
        await fetch(`/api/posts/${postId}/versions/${versionId}`, {
          method: 'DELETE'
        });
        fetchVersions();
      } catch (error) {
        console.error('Failed to delete version:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {versions.map((version) => (
        <div
          key={version.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedVersion?.id === version.id
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          onClick={() => setSelectedVersion(version)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{version.title}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  version.type === 'auto' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                }`}>
                  {version.type === 'auto' ? 'Auto-saved' : 'Manual'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{new Date(version.created_at).toLocaleString()}</span>
                <span>•</span>
                <span>by {version.author}</span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {version.content.substring(0, 100)}...
              </p>
            </div>

            <div className="flex items-center gap-1 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVersion(version);
                }}
                title="Preview"
              >
                <Eye className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestore(version);
                }}
                title="Restore"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
              
              {version.type === 'auto' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(version.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {versions.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No version history yet</p>
        </div>
      )}
    </div>
  );
}