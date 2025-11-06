-- Enable RLS on key tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for authenticated users" ON bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON bookings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Add Edge Function for monitoring
CREATE FUNCTION monitor_logs() RETURNS void AS $$
BEGIN
  -- Log logic here
END;
$$ LANGUAGE plpgsql;
