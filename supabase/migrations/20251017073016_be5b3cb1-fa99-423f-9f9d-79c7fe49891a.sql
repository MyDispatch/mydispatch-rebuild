-- ==================================================================================
-- MIGRATION: LOGO-UPLOAD-SYSTEM V18.2.8 (FIXED)
-- ==================================================================================
-- Erstellt Storage Bucket für Unternehmenslogos
-- RLS Policies für sicheren Upload
-- ==================================================================================

-- 1. Storage Bucket erstellen (PUBLIC - Logos müssen öffentlich sein)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  true,
  2097152, -- 2MB Limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS Policies für Logo-Upload
-- Policy: Users können ihre Company-Logos hochladen
CREATE POLICY "Users can upload their company logo"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos' AND
  auth.uid() IN (
    SELECT user_id 
    FROM profiles 
    WHERE company_id::text = (storage.foldername(name))[1]
  )
);

-- Policy: Users können ihre Company-Logos aktualisieren
CREATE POLICY "Users can update their company logo"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  auth.uid() IN (
    SELECT user_id 
    FROM profiles 
    WHERE company_id::text = (storage.foldername(name))[1]
  )
);

-- Policy: Users können ihre Company-Logos löschen
CREATE POLICY "Users can delete their company logo"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  auth.uid() IN (
    SELECT user_id 
    FROM profiles 
    WHERE company_id::text = (storage.foldername(name))[1]
  )
);

-- Policy: Jeder kann Company-Logos sehen (PUBLIC)
CREATE POLICY "Anyone can view company logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'company-logos');

-- 3. Index für schnelle Slug-Lookups (falls noch nicht vorhanden)
CREATE INDEX IF NOT EXISTS idx_companies_company_slug 
ON companies(company_slug)
WHERE company_slug IS NOT NULL;

-- 4. Kommentar für Dokumentation
COMMENT ON COLUMN companies.company_slug IS 'Eindeutiger URL-Slug für Landingpage (my-dispatch.de/[slug]). Format: ^[a-z0-9-]{3,50}$. UNIQUE constraint aktiv.';