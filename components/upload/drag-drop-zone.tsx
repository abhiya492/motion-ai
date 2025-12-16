"use client";

import { useState, useCallback } from "react";
import { Upload, FileAudio, FileVideo } from "lucide-react";

interface DragDropZoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export default function DragDropZone({ onFileSelect, isUploading }: DragDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
        isDragOver 
          ? 'border-purple-500 bg-purple-50' 
          : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
      } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <Upload className="w-8 h-8 text-purple-500" />
          <FileAudio className="w-8 h-8 text-blue-500" />
          <FileVideo className="w-8 h-8 text-green-500" />
        </div>
        
        <div>
          <p className="text-lg font-medium text-gray-700">
            {isDragOver ? 'Drop your file here' : 'Drag & drop your audio or video file'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse (max 50MB)
          </p>
        </div>
      </div>
    </div>
  );
}