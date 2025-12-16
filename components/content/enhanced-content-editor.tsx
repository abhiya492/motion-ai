"use client";

import { useState } from "react";
import { ContentEditor } from "./content-editor";
import { SEOOptimizer } from "./seo-optimizer";
import { ContentGenerator } from "./content-generator";
import { VoiceFeatures } from "../voice/voice-features";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOSuggestions } from "@/types";

interface EnhancedContentEditorProps {
  initialContent: string;
  postId: number;
  transcription?: string;
  audioUrl?: string;
  userId?: string;
}

export function EnhancedContentEditor({ 
  initialContent, 
  postId, 
  transcription,
  audioUrl,
  userId 
}: EnhancedContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [seoData, setSeoData] = useState<SEOSuggestions | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'seo' | 'generate' | 'voice'>('editor');

  const tabs = [
    { key: 'editor', label: 'Editor', icon: '✏️' },
    { key: 'seo', label: 'SEO', icon: '🔍' },
    { key: 'generate', label: 'Generate', icon: '🚀' },
    { key: 'voice', label: 'Voice', icon: '🎤' }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.key as any)}
            className="flex items-center space-x-2"
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>

      {/* SEO Status Badge */}
      {seoData && (
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            SEO: {seoData.keywords.length} keywords
          </Badge>
          <Badge variant="outline">
            Title: {seoData.title.length}/60
          </Badge>
          <Badge variant="outline">
            Description: {seoData.meta_description.length}/160
          </Badge>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'editor' && (
        <ContentEditor
          initialContent={content}
          postId={postId}
          onContentChange={setContent}
        />
      )}

      {activeTab === 'seo' && (
        <div className="space-y-6">
          <SEOOptimizer
            content={content}
            onSEOUpdate={setSeoData}
          />
          <ContentEditor
            initialContent={content}
            postId={postId}
            onContentChange={setContent}
          />
        </div>
      )}

      {activeTab === 'generate' && (
        <div className="space-y-6">
          <ContentGenerator
            blogContent={content}
            transcription={transcription}
          />
          <ContentEditor
            initialContent={content}
            postId={postId}
            onContentChange={setContent}
          />
        </div>
      )}

      {activeTab === 'voice' && transcription && userId && (
        <div className="space-y-6">
          <VoiceFeatures
            audioUrl={audioUrl}
            transcription={transcription}
            userId={userId}
          />
          <ContentEditor
            initialContent={content}
            postId={postId}
            onContentChange={setContent}
          />
        </div>
      )}
    </div>
  );
}