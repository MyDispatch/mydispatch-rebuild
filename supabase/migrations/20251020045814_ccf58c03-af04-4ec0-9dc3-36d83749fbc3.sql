-- GPS-Geräte-Mapping für externe Tracker
CREATE TABLE IF NOT EXISTS public.gps_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE NOT NULL,
  device_id TEXT UNIQUE NOT NULL,
  device_type TEXT,
  imei TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.gps_devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company isolation" ON gps_devices
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX idx_gps_devices_device_id ON gps_devices(device_id);
CREATE INDEX idx_gps_devices_driver ON gps_devices(driver_id);