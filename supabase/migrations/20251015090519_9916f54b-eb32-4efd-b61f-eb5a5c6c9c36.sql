-- ==================================================================================
-- INTERNAL COMMUNICATIONS SYSTEM (WhatsApp-ähnlich)
-- ==================================================================================
-- Für interne Team-Kommunikation: Chat, Telefonie, Video
-- Nur innerhalb des eigenen Unternehmens (company_id isolation)
-- ==================================================================================

-- 1. Chat-Rooms (Conversations zwischen Nutzern)
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT,  -- Optional: Gruppenname
  is_group BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  archived BOOLEAN DEFAULT false
);

-- 2. Teilnehmer der Conversations
CREATE TABLE IF NOT EXISTS public.chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(conversation_id, user_id)
);

-- 3. Chat-Nachrichten
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message_text TEXT,
  message_type TEXT DEFAULT 'text', -- 'text', 'image', 'file', 'voice'
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  edited_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT false
);

-- 4. Telefon-/Video-Anrufe
CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  caller_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  call_type TEXT NOT NULL, -- 'audio', 'video'
  status TEXT DEFAULT 'ringing', -- 'ringing', 'active', 'ended', 'missed'
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==================================================================================
-- ENABLE RLS
-- ==================================================================================

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- ==================================================================================
-- RLS POLICIES: CHAT CONVERSATIONS
-- ==================================================================================

DROP POLICY IF EXISTS "Users can view conversations in their company" ON public.chat_conversations;
CREATE POLICY "Users can view conversations in their company"
ON public.chat_conversations FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create conversations in their company" ON public.chat_conversations;
CREATE POLICY "Users can create conversations in their company"
ON public.chat_conversations FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update conversations in their company" ON public.chat_conversations;
CREATE POLICY "Users can update conversations in their company"
ON public.chat_conversations FOR UPDATE
USING (
  company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- ==================================================================================
-- RLS POLICIES: CHAT PARTICIPANTS
-- ==================================================================================

DROP POLICY IF EXISTS "Users can view participants in their conversations" ON public.chat_participants;
CREATE POLICY "Users can view participants in their conversations"
ON public.chat_participants FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM public.chat_conversations 
    WHERE company_id IN (
      SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "Users can add participants to conversations" ON public.chat_participants;
CREATE POLICY "Users can add participants to conversations"
ON public.chat_participants FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM public.chat_conversations 
    WHERE company_id IN (
      SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

-- ==================================================================================
-- RLS POLICIES: CHAT MESSAGES
-- ==================================================================================

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.chat_messages;
CREATE POLICY "Users can view messages in their conversations"
ON public.chat_messages FOR SELECT
USING (
  conversation_id IN (
    SELECT conversation_id FROM public.chat_participants 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.chat_messages;
CREATE POLICY "Users can send messages to their conversations"
ON public.chat_messages FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT conversation_id FROM public.chat_participants 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update their own messages" ON public.chat_messages;
CREATE POLICY "Users can update their own messages"
ON public.chat_messages FOR UPDATE
USING (sender_id = auth.uid());

-- ==================================================================================
-- RLS POLICIES: CALLS
-- ==================================================================================

DROP POLICY IF EXISTS "Users can view calls in their company" ON public.calls;
CREATE POLICY "Users can view calls in their company"
ON public.calls FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
  AND (caller_id = auth.uid() OR receiver_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can create calls in their company" ON public.calls;
CREATE POLICY "Users can create calls in their company"
ON public.calls FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  )
  AND caller_id = auth.uid()
);

DROP POLICY IF EXISTS "Users can update their own calls" ON public.calls;
CREATE POLICY "Users can update their own calls"
ON public.calls FOR UPDATE
USING (caller_id = auth.uid() OR receiver_id = auth.uid());

-- ==================================================================================
-- ENABLE REALTIME für Live-Updates
-- ==================================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calls;

-- ==================================================================================
-- TRIGGERS für Timestamp-Updates
-- ==================================================================================

DROP TRIGGER IF EXISTS update_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ==================================================================================
-- INDICES für Performance-Optimierung
-- ==================================================================================

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON public.chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_conversation_id ON public.chat_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_calls_company_id ON public.calls(company_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON public.calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_caller_receiver ON public.calls(caller_id, receiver_id);