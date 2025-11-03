-- ==================================================================================
-- SUPABASE AUTOMATION PERFECTION V18.3.24 - KORRIGIERT
-- ==================================================================================
-- GPS-Delete 24h Cron, Realtime-Aktivierung (korrigiert), RLS-Vervollständigung
-- ==================================================================================

-- 1. GPS-DELETE CRON (24h) - Fallback zum Edge Function
SELECT cron.schedule(
  'gps-cleanup-fallback',
  '0 3 * * *', -- Täglich 03:00 Uhr (1h nach Edge Function)
  $$
  DELETE FROM vehicle_positions 
  WHERE timestamp < NOW() - INTERVAL '24 hours';
  $$
);

-- 2. REALTIME AKTIVIERUNG für Echtzeit-Updates (nur fehlende)
-- Bookings für Live-Status-Updates
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Drivers für Live-Position und Shift-Status
ALTER PUBLICATION supabase_realtime ADD TABLE drivers;

-- Vehicles für Verfügbarkeit
ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;

-- Vehicle-Positions für GPS-Tracking (nur 24h)
ALTER PUBLICATION supabase_realtime ADD TABLE vehicle_positions;

-- 3. DOCUMENT-EXPIRY REMINDER-AUTOMATION
CREATE OR REPLACE FUNCTION create_expiry_reminder()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiry_date IS NOT NULL THEN
    INSERT INTO document_expiry_reminders (
      document_id,
      entity_id,
      reminder_entity_type,
      expiry_date,
      reminder_document_type,
      reminder_days_before,
      company_id
    ) VALUES (
      NEW.id,
      NEW.entity_id,
      NEW.entity_type::TEXT,
      NEW.expiry_date,
      NEW.document_type::TEXT,
      30,
      NEW.company_id
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_create_expiry_reminder
  AFTER INSERT OR UPDATE OF expiry_date ON documents
  FOR EACH ROW
  EXECUTE FUNCTION create_expiry_reminder();

-- 4. RLS-POLICY VERVOLLSTÄNDIGUNG
ALTER TABLE vehicle_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company isolation for vehicle_positions" 
ON vehicle_positions FOR ALL 
USING (
  driver_id IN (
    SELECT id FROM drivers WHERE company_id IN (
      SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "System can manage gps_devices" 
ON gps_devices FOR ALL 
USING (true);

-- 5. CRON-JOBS für Maintenance
SELECT cron.schedule(
  'refresh-dashboard-stats',
  '0 1 * * *',
  $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
  $$
);

SELECT cron.schedule(
  'cleanup-old-audit-logs',
  '0 4 * * 0',
  $$
  DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days';
  $$
);

SELECT cron.schedule(
  'cleanup-error-logs',
  '0 5 * * 0',
  $$
  SELECT cleanup_old_error_logs();
  $$
);

SELECT cron.schedule(
  'cleanup-expired-chat-tokens',
  '0 6 * * *',
  $$
  SELECT cleanup_expired_chat_tokens();
  $$
);