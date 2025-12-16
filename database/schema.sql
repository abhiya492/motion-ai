-- Create database tables for Motion AI

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  customer_id VARCHAR(255),
  price_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  user_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title TEXT,
  content TEXT,
  language VARCHAR(10) DEFAULT 'en',
  source_language VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  amount INTEGER,
  status VARCHAR(50),
  stripe_payment_id VARCHAR(255),
  price_id VARCHAR(255),
  user_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_usage (
  user_id VARCHAR(255),
  usage_date DATE,
  usage_count INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, usage_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_daily_usage_date ON daily_usage(usage_date);

-- Advanced content generation tables
CREATE TABLE IF NOT EXISTS content_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'tutorial', 'review', 'news', 'personal'
  prompt_template TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS generated_content (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  content_type VARCHAR(50) NOT NULL, -- 'blog', 'social', 'email', 'podcast'
  content TEXT NOT NULL,
  metadata JSONB, -- SEO keywords, social platform, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default templates
INSERT INTO content_templates (name, type, prompt_template) VALUES
('Tutorial Blog', 'tutorial', 'Create a comprehensive tutorial blog post from this transcription. Include: 1) Clear step-by-step instructions, 2) Prerequisites section, 3) Troubleshooting tips, 4) Conclusion with next steps. Make it beginner-friendly and actionable.'),
('Product Review', 'review', 'Write a detailed product review blog post from this transcription. Include: 1) Product overview, 2) Pros and cons, 3) Personal experience, 4) Rating and recommendation, 5) Who should buy this product.'),
('News Article', 'news', 'Transform this transcription into a news article. Include: 1) Compelling headline, 2) Lead paragraph with key facts, 3) Supporting details, 4) Quotes if available, 5) Context and implications.'),
('Personal Story', 'personal', 'Create a personal blog post from this transcription. Include: 1) Personal introduction, 2) Story narrative, 3) Lessons learned, 4) Personal reflections, 5) Call to action for readers.');

CREATE INDEX IF NOT EXISTS idx_generated_content_post_id ON generated_content(post_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_type ON content_templates(type);