"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Save, Download, History, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SplitScreenEditorProps {
  postId: string;
  initialTitle?: string;
  initialContent?: string;
  onSave?: (title: string, content: string) => void;
}

export default function SplitScreenEditor({ 
  postId, 
  initialTitle = "", 
  initialContent = "", 
  onSave 
}: SplitScreenEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (title || content) {
        handleAutoSave();
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [title, content]);

  const handleAutoSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await fetch(`/api/posts/${postId}/autosave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [postId, title, content]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave?.(title, content);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'html') => {
    try {
      const response = await fetch(`/api/posts/${postId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, title, content })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'post'}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="text-2xl font-bold border-none p-0 focus:ring-0"
          />
          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="text-sm text-gray-500">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {isSaving && (
              <span className="text-sm text-blue-600">Saving...</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={isPreviewMode ? "outline" : "default"}
              size="sm"
              onClick={() => setIsPreviewMode(false)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreviewMode(true)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVersions(!showVersions)}
            >
              <History className="w-4 h-4 mr-1" />
              Versions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Comments
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor/Preview */}
        <div className={`${isPreviewMode ? 'w-full' : 'w-1/2'} border-r border-gray-200 dark:border-gray-700`}>
          {isPreviewMode ? (
            <div className="h-full overflow-auto p-6">
              <div className="max-w-4xl mx-auto prose dark:prose-invert">
                <h1>{title}</h1>
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your content..."
              className="w-full h-full p-6 border-none resize-none focus:ring-0 bg-transparent text-gray-900 dark:text-gray-100"
            />
          )}
        </div>

        {/* Live Preview (only in split mode) */}
        {!isPreviewMode && (
          <div className="w-1/2 h-full overflow-auto p-6 bg-gray-50 dark:bg-gray-800">
            <div className="prose dark:prose-invert max-w-none">
              <h1>{title || "Untitled"}</h1>
              <ReactMarkdown>{content || "*Start typing to see preview...*"}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Version History Sidebar */}
        {showVersions && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
            <h3 className="font-semibold mb-4">Version History</h3>
            <div className="space-y-2">
              <div className="p-3 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="font-medium">Current Version</div>
                <div className="text-sm text-gray-500">Just now</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="font-medium">Auto-saved</div>
                <div className="text-sm text-gray-500">2 minutes ago</div>
              </div>
            </div>
          </div>
        )}

        {/* Comments Sidebar */}
        {showComments && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
            <h3 className="font-semibold mb-4">Comments</h3>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                <div className="font-medium text-sm">You</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Need to add more examples here
                </div>
                <div className="text-xs text-gray-500 mt-2">5 min ago</div>
              </div>
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Add a comment..."
                className="w-full p-2 border rounded-md text-sm"
                rows={3}
              />
              <Button size="sm" className="mt-2">Add Comment</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}