-- HYPERION PHASE 0: Component Classification Table
CREATE TABLE IF NOT EXISTS public.component_classification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('A', 'B', 'C')),
  reasoning TEXT,
  complexity TEXT CHECK (complexity IN ('low', 'medium', 'high')),
  migration_priority INTEGER DEFAULT 0,
  deprecated BOOLEAN DEFAULT false,
  classified_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  classified_by TEXT DEFAULT 'gemini-1.5-pro'
);

-- HYPERION PHASE 3: UI Atoms Documentation Table
CREATE TABLE IF NOT EXISTS public.ui_atoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  atom_name TEXT NOT NULL UNIQUE,
  atom_type TEXT NOT NULL CHECK (atom_type IN ('atom', 'molecule', 'organism')),
  component_path TEXT NOT NULL,
  props_definition JSONB NOT NULL DEFAULT '{}',
  states_definition JSONB NOT NULL DEFAULT '{}',
  storybook_path TEXT,
  extreme_tested BOOLEAN DEFAULT false,
  documentation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.component_classification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_atoms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for component_classification"
  ON public.component_classification FOR SELECT
  USING (true);

CREATE POLICY "Public read access for ui_atoms"
  ON public.ui_atoms FOR SELECT
  USING (true);

-- Indexes for performance
CREATE INDEX idx_component_classification_category ON public.component_classification(category);
CREATE INDEX idx_component_classification_deprecated ON public.component_classification(deprecated);
CREATE INDEX idx_ui_atoms_type ON public.ui_atoms(atom_type);
CREATE INDEX idx_ui_atoms_name ON public.ui_atoms(atom_name);