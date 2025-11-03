-- ==================================================================================
-- STORAGE BUCKET FÜR DOKUMENTE
-- ==================================================================================
-- Bucket für Dokumente (Führerschein, P-Schein, Fahrzeugschein, etc.)
-- ==================================================================================

-- 1. Storage Bucket erstellen (falls nicht vorhanden)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS Policies für Storage
-- Policy: Dokumente hochladen (nur eigene Company)
CREATE POLICY "Users can upload documents for their company"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT company_id::text FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Dokumente ansehen (nur eigene Company)
CREATE POLICY "Users can view documents from their company"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT company_id::text FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Dokumente löschen (nur eigene Company)
CREATE POLICY "Users can delete documents from their company"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT company_id::text FROM profiles WHERE user_id = auth.uid()
  )
);

-- 3. Index für schnelle Dokumenten-Abfragen
CREATE INDEX IF NOT EXISTS idx_documents_expiry_date 
ON documents (company_id, expiry_date) 
WHERE expiry_date IS NOT NULL AND reminder_sent = FALSE;