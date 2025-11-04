-- ==================================================================================
-- STORAGE BUCKET: company-letterheads
-- ==================================================================================
-- Erstellt: 2025-01-31
-- Zweck: Briefpapier-Upload für Kunden
-- Autor: NeXify AI MASTER
-- ==================================================================================

-- Storage Bucket erstellen
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-letterheads',
  'company-letterheads',
  true,
  5242880, -- 5 MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies für Storage
CREATE POLICY "Users can upload their own letterheads"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'company-letterheads' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own letterheads"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'company-letterheads'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public = true
    )
  );

CREATE POLICY "Users can delete their own letterheads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'company-letterheads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Kommentar
COMMENT ON POLICY "Users can upload their own letterheads" ON storage.objects IS 
  'Ermöglicht Kunden, ihr eigenes Briefpapier hochzuladen';

