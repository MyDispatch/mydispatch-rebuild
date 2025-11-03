
-- Create code_validation_logs table for AI validation tracking
CREATE TABLE IF NOT EXISTS code_validation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL,
  change_type TEXT NOT NULL,
  validation_result JSONB NOT NULL DEFAULT '{}'::jsonb,
  validated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  violations_count INTEGER GENERATED ALWAYS AS (jsonb_array_length(validation_result->'violations')) STORED,
  is_valid BOOLEAN GENERATED ALWAYS AS ((validation_result->>'valid')::boolean) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE code_validation_logs ENABLE ROW LEVEL SECURITY;

-- AI can insert validation logs
CREATE POLICY "AI can insert validation logs"
  ON code_validation_logs
  FOR INSERT
  WITH CHECK (true);

-- AI can read validation logs
CREATE POLICY "AI can read validation logs"
  ON code_validation_logs
  FOR SELECT
  USING (true);

-- Index for performance
CREATE INDEX idx_code_validation_logs_file_path ON code_validation_logs(file_path);
CREATE INDEX idx_code_validation_logs_validated_at ON code_validation_logs(validated_at DESC);
CREATE INDEX idx_code_validation_logs_is_valid ON code_validation_logs(is_valid);
