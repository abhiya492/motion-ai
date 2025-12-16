"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar, Tag, Globe, FileText } from "lucide-react";

interface PostsFilterProps {
  onFilterChange: (filters: any) => void;
  onSearchChange: (search: string) => void;
}

export default function PostsFilter({ onFilterChange, onSearchChange }: PostsFilterProps) {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "",
    template: "",
    language: "",
    status: "",
    tags: ""
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Template</label>
            <select
              value={filters.template}
              onChange={(e) => handleFilterChange("template", e.target.value)}
              className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Templates</option>
              <option value="blog">Blog Post</option>
              <option value="tutorial">Tutorial</option>
              <option value="review">Review</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Language</label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
              className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full p-2 border rounded-md text-sm dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Tags</label>
            <Input
              placeholder="Enter tags..."
              value={filters.tags}
              onChange={(e) => handleFilterChange("tags", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}