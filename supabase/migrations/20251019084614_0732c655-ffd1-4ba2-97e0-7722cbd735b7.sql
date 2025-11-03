-- ==================================================================================
-- CHAT SYSTEM FIX V2 - Foreign Keys & RLS Policies (Safe)
-- ==================================================================================

-- 1. Foreign Key für chat_messages (nur wenn noch nicht vorhanden)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_chat_messages_sender'
  ) THEN
    ALTER TABLE public.chat_messages
      ADD CONSTRAINT fk_chat_messages_sender 
      FOREIGN KEY (sender_id) 
      REFERENCES auth.users(id) 
      ON DELETE CASCADE;
  END IF;
END $$;

-- 2. RLS Policy für UPDATE auf chat_participants (nur wenn noch nicht vorhanden)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'chat_participants' 
    AND policyname = 'Users can update their own participant records'
  ) THEN
    CREATE POLICY "Users can update their own participant records"
      ON public.chat_participants
      FOR UPDATE
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- 3. Indexes für Performance (nur wenn noch nicht vorhanden)
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id 
  ON public.chat_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id 
  ON public.chat_messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_created 
  ON public.chat_messages(conversation_id, created_at DESC);

-- 4. Realtime aktivieren
DO $$
BEGIN
  -- Prüfen und hinzufügen für chat_messages
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
  
  -- Prüfen und hinzufügen für chat_conversations
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'chat_conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
  END IF;
END $$;