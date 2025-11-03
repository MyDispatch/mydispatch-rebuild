-- ==================================================================================
-- TEAM-KOMMUNIKATION V18.3 - Storage RLS Policy für Chat-Dateien
-- ==================================================================================
-- Behebe RLS-Fehler beim Datei-Upload im Chat-System
-- ==================================================================================

-- Zuerst alte Policies löschen (falls vorhanden)
DROP POLICY IF EXISTS "Users can upload chat files in their company conversations" ON storage.objects;
DROP POLICY IF EXISTS "Users can view chat files in their conversations" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own chat files" ON storage.objects;

-- Storage Policy für Chat-Datei-Uploads (INSERT)
CREATE POLICY "Users can upload chat files in their company conversations"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = 'chat'
  AND auth.uid() IN (
    SELECT user_id 
    FROM chat_participants 
    WHERE conversation_id::text = (storage.foldername(name))[2]
  )
);

-- Storage Policy für Chat-Datei-Downloads (SELECT)
CREATE POLICY "Users can view chat files in their conversations"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = 'chat'
  AND auth.uid() IN (
    SELECT user_id 
    FROM chat_participants 
    WHERE conversation_id::text = (storage.foldername(name))[2]
  )
);

-- Storage Policy für Chat-Datei-Löschung (DELETE)
CREATE POLICY "Users can delete their own chat files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = 'chat'
  AND auth.uid() IN (
    SELECT sender_id 
    FROM chat_messages 
    WHERE file_url LIKE '%' || name || '%'
  )
);