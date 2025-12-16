"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, File, Globe, Settings } from "lucide-react";

interface ExportDialogProps {
  postId: string;
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportDialog({ postId, title, content, isOpen, onClose }: ExportDialogProps) {
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    includeComments: false,
    format: 'standard'
  });

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Portable document format for sharing',
      icon: FileText,
      extension: 'pdf'
    },
    {
      id: 'docx',
      name: 'Word Document',
      description: 'Microsoft Word format for editing',
      icon: File,
      extension: 'docx'
    },
    {
      id: 'html',
      name: 'HTML File',
      description: 'Web page format with styling',
      icon: Globe,
      extension: 'html'
    },
    {
      id: 'md',
      name: 'Markdown',
      description: 'Plain text with markdown formatting',
      icon: FileText,
      extension: 'md'
    }
  ];

  const handleExport = async (format: string) => {
    try {
      setExporting(format);
      
      const response = await fetch(`/api/posts/${postId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          format, 
          title, 
          content,
          options: exportOptions
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'post'}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        onClose();
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Export Post
          </h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        {/* Export Options */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4" />
            <h3 className="font-medium">Export Options</h3>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={exportOptions.includeMetadata}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includeMetadata: e.target.checked
                }))}
                className="rounded"
              />
              <span className="text-sm">Include metadata (date, author, etc.)</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={exportOptions.includeComments}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includeComments: e.target.checked
                }))}
                className="rounded"
              />
              <span className="text-sm">Include comments and notes</span>
            </label>
          </div>
        </div>

        {/* Format Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportFormats.map((format) => {
            const Icon = format.icon;
            const isExporting = exporting === format.id;
            
            return (
              <button
                key={format.id}
                onClick={() => handleExport(format.id)}
                disabled={isExporting}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left disabled:opacity-50"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {format.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format.description}
                    </p>
                    
                    {isExporting && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-purple-600">Exporting...</span>
                      </div>
                    )}
                  </div>
                  
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}