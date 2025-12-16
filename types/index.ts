export interface Post {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  customer_id?: string;
  price_id?: string;
  status: string;
  user_id?: string;
  created_at: string;
}

export interface DailyUsage {
  user_id: string;
  usage_date: string;
  usage_count: number;
}

export interface PlanType {
  id: string;
  name: string;
  description?: string;
  price?: string;
  items?: string[];
  priceId?: string;
  paymentLink?: string;
}

export interface ContentTemplate {
  id: number;
  name: string;
  type: 'tutorial' | 'review' | 'news' | 'personal';
  prompt_template: string;
  created_at: string;
}

export interface GeneratedContent {
  id: number;
  post_id: number;
  content_type: 'blog' | 'social' | 'email' | 'podcast';
  content: string;
  metadata?: {
    keywords?: string[];
    platform?: string;
    seo_title?: string;
    meta_description?: string;
  };
  created_at: string;
}

export interface SEOSuggestions {
  title: string;
  meta_description: string;
  keywords: string[];
  headings: string[];
}

export interface Speaker {
  id: number;
  name: string;
  segments: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

export interface Emotion {
  timestamp: number;
  emotion: string;
  confidence: number;
}

export interface AudioAnalysis {
  id: number;
  post_id: number;
  speakers: Speaker[];
  emotions: Emotion[];
  noise_level: number;
  processed_audio_url?: string;
  created_at: string;
}

export interface VoiceClone {
  id: number;
  user_id: string;
  name: string;
  voice_id: string;
  sample_audio_url?: string;
  created_at: string;
}