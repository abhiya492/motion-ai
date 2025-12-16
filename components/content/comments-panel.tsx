"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Trash2, Edit, MoreHorizontal } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  author: string;
  created_at: string;
  line_number?: number;
  resolved: boolean;
}

interface CommentsPanelProps {
  postId: string;
  currentUser: string;
}

export default function CommentsPanel({ postId, currentUser }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          author: currentUser
        })
      });

      if (response.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      });

      if (response.ok) {
        setEditingId(null);
        setEditContent("");
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleResolveComment = async (commentId: string, resolved: boolean) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved })
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Comment */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment or note..."
          className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-md text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <Button
            size="sm"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Send className="w-3 h-3 mr-1" />
            Add Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`p-4 rounded-lg border transition-colors ${
              comment.resolved
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                    {comment.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-sm text-gray-900 dark:text-white">
                  {comment.author}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
                {comment.line_number && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                    Line {comment.line_number}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {comment.author === currentUser && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleResolveComment(comment.id, !comment.resolved)}
                  className={comment.resolved ? 'text-green-600' : 'text-gray-600'}
                >
                  {comment.resolved ? '✓' : '○'}
                </Button>
              </div>
            </div>

            {editingId === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-md text-sm resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setEditContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            )}
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No comments yet</p>
            <p className="text-sm">Add the first comment to start collaborating</p>
          </div>
        )}
      </div>
    </div>
  );
}