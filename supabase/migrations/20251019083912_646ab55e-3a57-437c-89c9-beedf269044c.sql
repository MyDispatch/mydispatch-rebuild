-- ==================================================================================
-- TEAM-KOMMUNIKATION V18.3 - Storage RLS Policy Fix
-- ==================================================================================
-- Fix: Storage Policy für Chat-Datei-Uploads im documents Bucket
-- ==================================================================================

-- V18.3: P0.1 - Storage RLS Policy für Chat-Datei-Uploads
DROP POLICY IF EXISTS "Users can upload chat files" ON storage.objects;

CREATE POLICY "Users can upload chat files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  -- Erlaube Uploads in Conversation-Ordnern
  (storage.foldername(name))[1] IN (
    SELECT chat_conversations.id::text
    FROM chat_conversations
    JOIN chat_participants ON chat_participants.conversation_id = chat_conversations.id
    WHERE chat_participants.user_id = auth.uid()
  )
);

-- V18.3: P0.2 - Users können ihre eigenen Chat-Dateien lesen
DROP POLICY IF EXISTS "Users can view their chat files" ON storage.objects;

CREATE POLICY "Users can view their chat files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT chat_conversations.id::text
    FROM chat_conversations
    JOIN chat_participants ON chat_participants.conversation_id = chat_conversations.id
    WHERE chat_participants.user_id = auth.uid()
  )
);

-- V18.3: P0.3 - Users können ihre eigenen Chat-Dateien löschen
DROP POLICY IF EXISTS "Users can delete their chat files" ON storage.objects;

CREATE POLICY "Users can delete their chat files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT chat_conversations.id::text
    FROM chat_conversations
    JOIN chat_participants ON chat_participants.conversation_id = chat_conversations.id
    WHERE chat_participants.user_id = auth.uid()
  )
);