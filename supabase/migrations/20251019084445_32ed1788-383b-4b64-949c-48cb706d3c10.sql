-- ==================================================================================
-- CHAT SYSTEM FIX - Data Cleanup & Foreign Keys (ohne Realtime)
-- ==================================================================================
-- Step 1: Bereinige verwaiste Einträge
-- Step 2: Foreign Keys hinzufügen
-- Step 3: RLS Policies erweitern
-- ==================================================================================

-- 1. CLEANUP: Lösche chat_participants ohne existierende profiles
DELETE FROM public.chat_participants
WHERE user_id NOT IN (SELECT user_id FROM public.profiles);

-- 2. CLEANUP: Lösche chat_messages von nicht-existierenden Sendern
DELETE FROM public.chat_messages
WHERE sender_id NOT IN (SELECT id FROM auth.users);

-- 3. Foreign Keys hinzufügen
ALTER TABLE public.chat_participants
  ADD CONSTRAINT fk_chat_participants_user 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(user_id) 
  ON DELETE CASCADE;

ALTER TABLE public.chat_messages
  ADD CONSTRAINT fk_chat_messages_sender 
  FOREIGN KEY (sender_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- 4. RLS Policy für UPDATE auf chat_participants (für last_read_at)
CREATE POLICY "Users can update their own participant records"
  ON public.chat_participants
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 5. Index für Performance
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id 
  ON public.chat_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id 
  ON public.chat_messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_created 
  ON public.chat_messages(conversation_id, created_at DESC);