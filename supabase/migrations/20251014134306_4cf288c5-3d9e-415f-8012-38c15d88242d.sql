-- Create partners table
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  provision_amount NUMERIC NOT NULL DEFAULT 0,
  online_access_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view partners of their company"
  ON public.partners
  FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert partners for their company"
  ON public.partners
  FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update partners of their company"
  ON public.partners
  FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete partners of their company"
  ON public.partners
  FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();