-- ============================================================================
-- MASTER-CHAT FILE UPLOADS - STORAGE BUCKET & RLS POLICIES
-- ============================================================================
-- Erstellt: 2025-10-27 (Phase 3)
-- Zweck: Sichere Datei-Uploads für Master-Chat (auth users only)
-- ============================================================================

-- 1. CREATE BUCKET 'chat-uploads' (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-uploads',
  'chat-uploads',
  false,
  5242880, -- 5MB Limit
  ARRAY[
    'application/pdf',
    'text/markdown',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'text/markdown',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ];

-- 2. RLS POLICY: Users can upload their own files
CREATE POLICY "Users can upload to chat-uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-uploads'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. RLS POLICY: Users can view their own files
CREATE POLICY "Users can view their own chat-uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-uploads'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. RLS POLICY: Users can delete their own files
CREATE POLICY "Users can delete their own chat-uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-uploads'
  AND auth.uid()::text = (storage.foldername(name))[1]
);