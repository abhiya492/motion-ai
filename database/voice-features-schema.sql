-- Voice & Speaker Features Tables
CREATE TABLE IF NOT EXISTS audio_analysis (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  speakers JSONB, -- [{id: 1, name: "Speaker 1", segments: [...]}]
  emotions JSONB, -- [{timestamp: 0, emotion: "happy", confidence: 0.8}]
  noise_level FLOAT,
  processed_audio_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voice_clones (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  voice_id VARCHAR(255) NOT NULL, -- ElevenLabs voice ID
  sample_audio_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audio_analysis_post_id ON audio_analysis(post_id);
CREATE INDEX IF NOT EXISTS idx_voice_clones_user_id ON voice_clones(user_id);