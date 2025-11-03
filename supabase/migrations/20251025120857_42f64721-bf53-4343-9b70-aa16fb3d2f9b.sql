-- ==================================================================================
-- CLEANUP: Agent-Task-Queue Entfernung (V3.0 - Manual Control)
-- ==================================================================================
-- Entfernt die agent_tasks Tabelle und alle zugehörigen Strukturen
-- ==================================================================================

-- 1. Real-Time Publikation entfernen (ohne IF EXISTS)
ALTER PUBLICATION supabase_realtime DROP TABLE public.agent_tasks;

-- 2. Tabelle löschen (CASCADE entfernt automatisch alle RLS Policies)
DROP TABLE IF EXISTS public.agent_tasks CASCADE;

-- ==================================================================================
-- CLEANUP ABGESCHLOSSEN
-- ==================================================================================