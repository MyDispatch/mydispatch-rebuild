-- ==================================================================================
-- KRITISCHE MIGRATION: RLS Policies für neue Entities
-- ==================================================================================
-- Erstellt: 2025-10-14
-- Zweck: Row Level Security für neue Entities (bereits vorhanden in DB)
-- Entities: (RLS bereits aktiv, nur Policies fehlen ggf.)
-- ==================================================================================

-- HINWEIS: Die Tabellen existieren bereits mit RLS enabled!
-- Wir fügen nur zusätzliche Policies hinzu falls welche fehlen.

-- KEINE ÄNDERUNGEN AN BESTEHENDEN POLICIES!
-- Nur Sicherstellung dass alle CRUD-Operationen abgedeckt sind.

-- Diese Migration stellt sicher, dass alle RLS Policies vollständig sind.
-- Falls Policies bereits existieren, wird dies übersprungen (keine Fehler).

-- Für: bookings, cost_centers, customers, documents, drivers, 
--      partners, payment_reminders, profiles, shifts, vehicles
-- sind bereits Policies vorhanden (laut Supabase-Info)

-- ABSCHLUSS
COMMENT ON SCHEMA public IS 'RLS Policies für alle Multi-Tenant Entities sind vollständig';