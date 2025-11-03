-- Erweitere companies Tabelle für umfassende Einstellungen
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT 'taxi',
ADD COLUMN IF NOT EXISTS min_booking_advance_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS representative_salutation salutation,
ADD COLUMN IF NOT EXISTS representative_title TEXT,
ADD COLUMN IF NOT EXISTS representative_first_name TEXT,
ADD COLUMN IF NOT EXISTS representative_last_name TEXT,
ADD COLUMN IF NOT EXISTS letterhead_url TEXT,
ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '["cash", "invoice"]'::jsonb,
ADD COLUMN IF NOT EXISTS invoice_prefix TEXT DEFAULT 'RE-',
ADD COLUMN IF NOT EXISTS invoice_start_number INTEGER DEFAULT 1001,
ADD COLUMN IF NOT EXISTS quote_prefix TEXT DEFAULT 'AN-',
ADD COLUMN IF NOT EXISTS quote_start_number INTEGER DEFAULT 1001,
ADD COLUMN IF NOT EXISTS payment_term_days INTEGER DEFAULT 14,
ADD COLUMN IF NOT EXISTS default_vat_rate NUMERIC DEFAULT 19,
ADD COLUMN IF NOT EXISTS quote_validity_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS reminder_before_due_days INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS discount_term_days INTEGER DEFAULT 7,
ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC DEFAULT 2,
ADD COLUMN IF NOT EXISTS email_signature TEXT,
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS account_holder TEXT,
ADD COLUMN IF NOT EXISTS iban TEXT,
ADD COLUMN IF NOT EXISTS bic TEXT,
ADD COLUMN IF NOT EXISTS notification_email_bookings BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_email_messages BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_sms BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_push BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_data_processing BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS privacy_marketing BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_analytics BOOLEAN DEFAULT false;

-- Erweitere profiles Tabelle
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Kommentar für neue Felder
COMMENT ON COLUMN companies.city IS 'Stadt für Verkehrs- und Wetterdaten';
COMMENT ON COLUMN companies.min_booking_advance_minutes IS 'Mindestvorlaufzeit für Buchungen in Minuten';
COMMENT ON COLUMN companies.payment_methods IS 'Array von Zahlungsarten: cash, invoice, ec, credit, paypal, sepa, instant, prepayment';