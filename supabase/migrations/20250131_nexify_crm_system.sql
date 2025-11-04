-- NeXify AI MASTER - CRM System
-- Migration: 20250131_nexify_crm_system.sql
-- Zweck: Vollständiges CRM für Unternehmen, Kontakte, Adressen

-- Schema erstellen (falls nicht vorhanden)
CREATE SCHEMA IF NOT EXISTS nexify_crm;

-- Tabelle: companies (Unternehmen)
CREATE TABLE IF NOT EXISTS nexify_crm.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  company_code TEXT UNIQUE, -- 'nexify', 'mydispatch', etc.
  legal_name TEXT, -- Offizieller Rechtsname
  company_type TEXT CHECK (company_type IN ('client', 'vendor', 'partner', 'internal', 'prospect', 'other')),
  industry TEXT,
  website_url TEXT,
  
  -- Steuerliche Informationen
  tax_id TEXT, -- Steuernummer / USt-IdNr
  registration_number TEXT, -- Handelsregisternummer
  vat_number TEXT, -- USt-IdNr
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived', 'prospect')),
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  
  -- Metadaten
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  source TEXT, -- 'website', 'referral', 'cold_call', etc.
  
  -- Kennzahlen
  total_projects INTEGER DEFAULT 0,
  total_revenue NUMERIC(12,2) DEFAULT 0,
  total_contacts INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_contact_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT company_code_format CHECK (company_code IS NULL OR company_code ~ '^[a-z0-9-]+$')
);

-- Tabelle: addresses (Adressen)
CREATE TABLE IF NOT EXISTS nexify_crm.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES nexify_crm.companies(id) ON DELETE CASCADE,
  contact_id UUID, -- Wird später verknüpft wenn contacts Tabelle existiert
  
  -- Adress-Typ
  address_type TEXT NOT NULL CHECK (address_type IN ('headquarters', 'branch', 'billing', 'shipping', 'other')),
  is_primary BOOLEAN DEFAULT FALSE,
  
  -- Adress-Daten
  street TEXT NOT NULL,
  street_number TEXT,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'Deutschland',
  
  -- Zusätzliche Infos
  address_line_2 TEXT,
  po_box TEXT,
  
  -- Geolocation (optional)
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabelle: contacts (Kontakte)
CREATE TABLE IF NOT EXISTS nexify_crm.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES nexify_crm.companies(id) ON DELETE SET NULL,
  
  -- Personendaten
  salutation TEXT CHECK (salutation IN ('Herr', 'Frau', 'Divers', 'Firma')),
  title TEXT, -- 'Dr.', 'Prof.', etc.
  first_name TEXT,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN salutation IS NOT NULL AND first_name IS NOT NULL AND last_name IS NOT NULL 
        THEN salutation || ' ' || first_name || ' ' || last_name
      WHEN first_name IS NOT NULL AND last_name IS NOT NULL 
        THEN first_name || ' ' || last_name
      ELSE last_name
    END
  ) STORED,
  
  -- Kontaktdaten
  email TEXT,
  phone TEXT,
  mobile TEXT,
  fax TEXT,
  
  -- Berufliche Daten
  job_title TEXT,
  department TEXT,
  role TEXT, -- 'owner', 'manager', 'developer', 'contact', etc.
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  is_primary BOOLEAN DEFAULT FALSE,
  
  -- Kommunikation
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'mobile', 'whatsapp')),
  language TEXT DEFAULT 'de',
  
  -- Metadaten
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  source TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_contact_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT contacts_email_format CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Tabelle: company_projects (Verknüpfung: Unternehmen <-> Projekte)
CREATE TABLE IF NOT EXISTS nexify_crm.company_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES nexify_crm.companies(id) ON DELETE CASCADE,
  project_id UUID NOT NULL,
  
  -- Beziehungs-Typ
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('client', 'vendor', 'partner', 'owner', 'contractor')),
  role TEXT, -- 'main_contact', 'billing_contact', 'technical_contact', etc.
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'on_hold')),
  
  -- Metadaten
  start_date DATE,
  end_date DATE,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(company_id, project_id),
  
  -- Foreign Key zu nexify_projects (ohne Schema in FK, da Cross-Schema)
  CONSTRAINT fk_company_projects_project 
    FOREIGN KEY (project_id) 
    REFERENCES nexify_ai_master_knowledge_base.nexify_projects(id) 
    ON DELETE CASCADE
);

-- Tabelle: interactions (Interaktionen / Kommunikation)
CREATE TABLE IF NOT EXISTS nexify_crm.interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES nexify_crm.companies(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES nexify_crm.contacts(id) ON DELETE SET NULL,
  project_id UUID,
  
  -- Interaktions-Daten
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('email', 'phone', 'meeting', 'note', 'task', 'quote', 'invoice', 'payment', 'other')),
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  content TEXT,
  
  -- Metadaten
  duration_minutes INTEGER,
  outcome TEXT,
  next_action TEXT,
  next_action_date DATE,
  
  -- Status
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  
  -- Timestamps
  interaction_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Zugeordnet zu
  assigned_to TEXT, -- 'pascal', 'nexify-ai-master', etc.
  created_by TEXT DEFAULT 'nexify-ai-master',
  
  -- Foreign Key zu nexify_projects (ohne Schema in FK, da Cross-Schema)
  CONSTRAINT fk_interactions_project 
    FOREIGN KEY (project_id) 
    REFERENCES nexify_ai_master_knowledge_base.nexify_projects(id) 
    ON DELETE SET NULL
);

-- Indizes erstellen
CREATE INDEX IF NOT EXISTS idx_companies_code ON nexify_crm.companies(company_code);
CREATE INDEX IF NOT EXISTS idx_companies_status ON nexify_crm.companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_type ON nexify_crm.companies(company_type);
CREATE INDEX IF NOT EXISTS idx_addresses_company ON nexify_crm.addresses(company_id);
CREATE INDEX IF NOT EXISTS idx_addresses_type ON nexify_crm.addresses(address_type);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON nexify_crm.contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON nexify_crm.contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON nexify_crm.contacts(status);
CREATE INDEX IF NOT EXISTS idx_company_projects_company ON nexify_crm.company_projects(company_id);
CREATE INDEX IF NOT EXISTS idx_company_projects_project ON nexify_crm.company_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_interactions_company ON nexify_crm.interactions(company_id);
CREATE INDEX IF NOT EXISTS idx_interactions_contact ON nexify_crm.interactions(contact_id);
CREATE INDEX IF NOT EXISTS idx_interactions_date ON nexify_crm.interactions(interaction_date DESC);

-- RLS Policies
ALTER TABLE nexify_crm.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_crm.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_crm.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_crm.company_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_crm.interactions ENABLE ROW LEVEL SECURITY;

-- Policy: Service Role hat Vollzugriff
CREATE POLICY "Service role full access" ON nexify_crm.companies
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON nexify_crm.addresses
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON nexify_crm.contacts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON nexify_crm.company_projects
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access" ON nexify_crm.interactions
  FOR ALL USING (auth.role() = 'service_role');

-- Initiale Daten: NeXify (Unternehmen)
INSERT INTO nexify_crm.companies (
  company_name,
  company_code,
  legal_name,
  company_type,
  website_url,
  status,
  priority,
  tags,
  notes
) VALUES (
  'NeXify',
  'nexify',
  'NeXify',
  'internal',
  'https://nexify-automate.com',
  'active',
  10,
  ARRAY['internal', 'own_company', 'development'],
  'Eigenes Unternehmen - Inhaber: Pascal'
) ON CONFLICT (company_code) DO NOTHING;

-- Initiale Daten: MyDispatch / RideHub Solutions (Kunde)
INSERT INTO nexify_crm.companies (
  company_name,
  company_code,
  legal_name,
  company_type,
  website_url,
  status,
  priority,
  tags,
  notes
) VALUES (
  'RideHub Solutions',
  'ridehub-solutions',
  'RideHub Solutions',
  'client',
  'https://my-dispatch.de',
  'active',
  10,
  ARRAY['client', 'saas', 'taxi', 'mietwagen'],
  'Kunde von NeXify - MyDispatch Produkt - Dauerhafte Betreuung'
) ON CONFLICT (company_code) DO NOTHING;

-- Adressen: NeXify
DO $$
DECLARE
  nexify_company_id UUID;
BEGIN
  SELECT id INTO nexify_company_id FROM nexify_crm.companies WHERE company_code = 'nexify';
  
  IF nexify_company_id IS NOT NULL THEN
    -- Deutschland Adresse
    INSERT INTO nexify_crm.addresses (
      company_id, address_type, is_primary,
      street, street_number, city, postal_code, country
    ) VALUES (
      nexify_company_id, 'headquarters', TRUE,
      'Wallstrasse', '9', 'Nettetal', '41334', 'Deutschland'
    ) ON CONFLICT DO NOTHING;
    
    -- Niederlande Adresse
    INSERT INTO nexify_crm.addresses (
      company_id, address_type, is_primary,
      street, street_number, city, postal_code, country
    ) VALUES (
      nexify_company_id, 'branch', FALSE,
      'Graaf van Loonstraat', '1E', 'Venlo', '5921 JA', 'Niederlande'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Adressen: RideHub Solutions
DO $$
DECLARE
  ridehub_company_id UUID;
BEGIN
  SELECT id INTO ridehub_company_id FROM nexify_crm.companies WHERE company_code = 'ridehub-solutions';
  
  IF ridehub_company_id IS NOT NULL THEN
    INSERT INTO nexify_crm.addresses (
      company_id, address_type, is_primary,
      street, street_number, city, postal_code, country
    ) VALUES (
      ridehub_company_id, 'headquarters', TRUE,
      'Ensbachmühle', '4', 'Schaufling', '94571', 'Deutschland'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Kontakte: Pascal (NeXify Owner)
DO $$
DECLARE
  nexify_company_id UUID;
BEGIN
  SELECT id INTO nexify_company_id FROM nexify_crm.companies WHERE company_code = 'nexify';
  
  IF nexify_company_id IS NOT NULL THEN
    INSERT INTO nexify_crm.contacts (
      company_id, first_name, last_name, email,
      job_title, role, is_primary, status,
      preferred_contact_method
    ) VALUES (
      nexify_company_id, 'Pascal', 'Courbois', 'courbois1981@gmail.com',
      'Inhaber', 'owner', TRUE, 'active',
      'email'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Kontakte: NeXify Support
DO $$
DECLARE
  nexify_company_id UUID;
BEGIN
  SELECT id INTO nexify_company_id FROM nexify_crm.companies WHERE company_code = 'nexify';
  
  IF nexify_company_id IS NOT NULL THEN
    INSERT INTO nexify_crm.contacts (
      company_id, first_name, last_name, email, phone,
      job_title, role, is_primary, status,
      preferred_contact_method
    ) VALUES (
      nexify_company_id, 'Support', 'NeXify', 'support@nexify-automate.com', '+31 6 133 188 56',
      'Support Team', 'contact', FALSE, 'active',
      'email'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Kontakte: MyDispatch Support
DO $$
DECLARE
  ridehub_company_id UUID;
BEGIN
  SELECT id INTO ridehub_company_id FROM nexify_crm.companies WHERE company_code = 'ridehub-solutions';
  
  IF ridehub_company_id IS NOT NULL THEN
    INSERT INTO nexify_crm.contacts (
      company_id, first_name, last_name, email, phone,
      job_title, role, is_primary, status,
      preferred_contact_method
    ) VALUES (
      ridehub_company_id, 'Support', 'MyDispatch', 'info@my-dispatch.de', '+49 170 8004423',
      'Support Team', 'contact', TRUE, 'active',
      'email'
    ) ON CONFLICT DO NOTHING;
    
    -- Kontakt: Ibrahim SIMSEK
    INSERT INTO nexify_crm.contacts (
      company_id, salutation, first_name, last_name,
      job_title, role, is_primary, status
    ) VALUES (
      ridehub_company_id, 'Herr', 'Ibrahim', 'SIMSEK',
      'Geschäftsführer', 'owner', FALSE, 'active'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Verknüpfung: RideHub Solutions <-> MyDispatch Projekt
DO $$
DECLARE
  ridehub_company_id UUID;
  mydispatch_project_id UUID;
BEGIN
  SELECT id INTO ridehub_company_id FROM nexify_crm.companies WHERE company_code = 'ridehub-solutions';
  SELECT id INTO mydispatch_project_id FROM nexify_ai_master_knowledge_base.nexify_projects WHERE project_code = 'mydispatch';
  
  IF ridehub_company_id IS NOT NULL AND mydispatch_project_id IS NOT NULL THEN
    INSERT INTO nexify_crm.company_projects (
      company_id, project_id, relationship_type, status, start_date
    ) VALUES (
      ridehub_company_id, mydispatch_project_id, 'client', 'active', CURRENT_DATE
    ) ON CONFLICT (company_id, project_id) DO NOTHING;
  END IF;
END $$;

-- Updated_at Trigger
CREATE OR REPLACE FUNCTION nexify_crm.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON nexify_crm.companies
  FOR EACH ROW
  EXECUTE FUNCTION nexify_crm.update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON nexify_crm.addresses
  FOR EACH ROW
  EXECUTE FUNCTION nexify_crm.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON nexify_crm.contacts
  FOR EACH ROW
  EXECUTE FUNCTION nexify_crm.update_updated_at_column();

CREATE TRIGGER update_company_projects_updated_at
  BEFORE UPDATE ON nexify_crm.company_projects
  FOR EACH ROW
  EXECUTE FUNCTION nexify_crm.update_updated_at_column();

CREATE TRIGGER update_interactions_updated_at
  BEFORE UPDATE ON nexify_crm.interactions
  FOR EACH ROW
  EXECUTE FUNCTION nexify_crm.update_updated_at_column();

-- Trigger: Aktualisiere company.last_contact_at bei neuen Interaktionen
CREATE OR REPLACE FUNCTION nexify_crm.update_company_last_contact()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.company_id IS NOT NULL THEN
    UPDATE nexify_crm.companies
    SET last_contact_at = NEW.interaction_date
    WHERE id = NEW.company_id
    AND (last_contact_at IS NULL OR NEW.interaction_date > last_contact_at);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_last_contact_trigger
  AFTER INSERT ON nexify_crm.interactions
  FOR EACH ROW
  EXECUTE FUNCTION nexify_crm.update_company_last_contact();

-- Trigger: Aktualisiere company.total_contacts
CREATE OR REPLACE FUNCTION nexify_crm.update_company_contact_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE nexify_crm.companies
    SET total_contacts = total_contacts + 1
    WHERE id = NEW.company_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE nexify_crm.companies
    SET total_contacts = GREATEST(0, total_contacts - 1)
    WHERE id = OLD.company_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_contact_count_trigger
  AFTER INSERT OR DELETE ON nexify_crm.contacts
  FOR EACH ROW
  EXECUTE FUNCTION nexify_crm.update_company_contact_count();

