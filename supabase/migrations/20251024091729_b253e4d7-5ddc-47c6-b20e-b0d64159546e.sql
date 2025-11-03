-- ==================================================================================
-- FIX: monitoring_logs Spalten-Konsistenz V18.5.1
-- ==================================================================================
-- Problem: ERROR "column monitoring_logs.metadata does not exist"
-- Lösung: Benenne 'details' zu 'metadata' um (konsistent mit alert_logs)
-- ==================================================================================

-- Benenne 'details' Spalte zu 'metadata' um
ALTER TABLE public.monitoring_logs 
  RENAME COLUMN details TO metadata;

-- Update bestehende Daten (JSONB-Struktur bleibt gleich)
-- Keine Daten-Migration nötig, da nur Spalten-Name geändert

-- Kommentar für Dokumentation
COMMENT ON COLUMN public.monitoring_logs.metadata IS 
  'Additional context data as JSONB (previously named details)';
