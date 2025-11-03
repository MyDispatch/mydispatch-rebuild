-- Erweitere companies-Tabelle für Unternehmer-Landingpage (Tenant-spezifische Landing-Pages)

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#EADEBD',
ADD COLUMN IF NOT EXISTS landingpage_title TEXT,
ADD COLUMN IF NOT EXISTS landingpage_hero_text TEXT,
ADD COLUMN IF NOT EXISTS landingpage_description TEXT,
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{"Mo-Fr": "09:00 - 17:00", "Sa-So": "Geschlossen"}'::jsonb,
ADD COLUMN IF NOT EXISTS widget_button_text TEXT DEFAULT 'Jetzt buchen',
ADD COLUMN IF NOT EXISTS widget_size TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS widget_show_phone BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS landingpage_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS widget_enabled BOOLEAN DEFAULT false;

-- Kommentar für Dokumentation
COMMENT ON COLUMN public.companies.landingpage_enabled IS 'Aktiviert die öffentliche Landingpage für das Unternehmen (nur Business/Enterprise)';
COMMENT ON COLUMN public.companies.widget_enabled IS 'Aktiviert das Buchungswidget auf der Landingpage (nur Business/Enterprise)';
COMMENT ON COLUMN public.companies.primary_color IS 'Hauptfarbe für das Branding der Landingpage (HSL-Format bevorzugt)';