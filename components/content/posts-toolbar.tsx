"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid3X3, List, MoreHorizontal, Trash2, Archive, Edit, Eye } from "lucide-react";

interface PostsToolbarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  selectedCount: number;
  onBulkAction: (action: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function PostsToolbar({ 
  viewMode, 
  onViewModeChange, 
  selectedCount, 
  onBulkAction,
  sortBy,
  onSortChange 
}: PostsToolbarProps) {
  return (
    <div className="flex items-center justify-between py-4">
      {/* Left side - Bulk actions */}
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {selectedCount} selected
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onBulkAction("delete")}
              className="h-6 px-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onBulkAction("archive")}
              className="h-6 px-2"
            >
              <Archive className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Right side - View controls */}
      <div className="flex items-center gap-2">
        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="created_desc">Newest First</option>
          <option value="created_asc">Oldest First</option>
          <option value="title_asc">Title A-Z</option>
          <option value="title_desc">Title Z-A</option>
          <option value="updated_desc">Recently Updated</option>
        </select>

        {/* View mode toggle */}
        <div className="flex border rounded-md overflow-hidden">
          <Button
            size="sm"
            variant={viewMode === "grid" ? "default" : "ghost"}
            onClick={() => onViewModeChange("grid")}
            className="rounded-none px-3"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "ghost"}
            onClick={() => onViewModeChange("list")}
            className="rounded-none px-3"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}