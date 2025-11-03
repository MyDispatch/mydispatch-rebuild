-- Add landingpage configuration fields to companies table
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS custom_impressum_text TEXT,
ADD COLUMN IF NOT EXISTS custom_datenschutz_text TEXT,
ADD COLUMN IF NOT EXISTS custom_agb_text TEXT,
ADD COLUMN IF NOT EXISTS company_slug TEXT;

-- Generate unique slugs for existing companies
UPDATE companies 
SET company_slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || SUBSTRING(id::text, 1, 8)
WHERE company_slug IS NULL;

-- Add unique constraint
ALTER TABLE companies
ADD CONSTRAINT companies_company_slug_unique UNIQUE (company_slug);

-- Make company_slug required for future entries
ALTER TABLE companies
ALTER COLUMN company_slug SET NOT NULL;