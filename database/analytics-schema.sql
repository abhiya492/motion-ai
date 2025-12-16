-- Content Analytics Schema Extensions

-- Content Analytics Table
CREATE TABLE IF NOT EXISTS content_analytics (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  readability_score DECIMAL(5,2),
  seo_score DECIMAL(5,2),
  word_count INTEGER,
  reading_time INTEGER, -- in minutes
  keywords JSONB,
  sentiment_score DECIMAL(3,2),
  engagement_prediction DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEO Analysis Table
CREATE TABLE IF NOT EXISTS seo_analysis (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  title_score DECIMAL(3,2),
  meta_description TEXT,
  meta_score DECIMAL(3,2),
  keyword_density JSONB,
  recommendations TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Performance Tracking
CREATE TABLE IF NOT EXISTS content_performance (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  time_on_page INTEGER DEFAULT 0, -- in seconds
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trending Topics
CREATE TABLE IF NOT EXISTS trending_topics (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  trend_score DECIMAL(5,2),
  search_volume INTEGER,
  competition_level VARCHAR(20), -- low, medium, high
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Calendar
CREATE TABLE IF NOT EXISTS content_calendar (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  post_id INTEGER REFERENCES posts(id) ON DELETE SET NULL,
  title VARCHAR(500),
  scheduled_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, published
  platform VARCHAR(100), -- wordpress, medium, blog
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Export History
CREATE TABLE IF NOT EXISTS export_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  platform VARCHAR(100) NOT NULL, -- wordpress, medium
  export_status VARCHAR(50) DEFAULT 'pending', -- pending, success, failed
  export_url TEXT,
  exported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Collaboration
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  team_owner_id VARCHAR(255) NOT NULL,
  member_email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'editor', -- viewer, editor, admin
  status VARCHAR(50) DEFAULT 'pending', -- pending, active, inactive
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_owner_id, member_email)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_analytics_post_id ON content_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_seo_analysis_post_id ON seo_analysis(post_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_post_id ON content_performance(post_id);
CREATE INDEX IF NOT EXISTS idx_trending_topics_category ON trending_topics(category);
CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON content_calendar(user_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_scheduled_date ON content_calendar(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_export_history_user_id ON export_history(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_owner_id ON team_members(team_owner_id);

-- Insert sample trending topics
INSERT INTO trending_topics (topic, category, trend_score, search_volume, competition_level) VALUES
('AI Content Creation', 'Technology', 95.5, 50000, 'high'),
('Remote Work Tips', 'Business', 87.2, 35000, 'medium'),
('Sustainable Living', 'Lifestyle', 82.1, 28000, 'medium'),
('Digital Marketing Trends', 'Marketing', 91.3, 42000, 'high'),
('Mental Health Awareness', 'Health', 89.7, 38000, 'low');