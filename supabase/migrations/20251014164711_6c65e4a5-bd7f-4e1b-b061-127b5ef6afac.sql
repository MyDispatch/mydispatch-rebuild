-- Erweitere companies-Tabelle für Stripe-Abonnements
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS subscription_product_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_cancel_at_period_end BOOLEAN DEFAULT false;

-- Index für schnellere Subscription-Abfragen
CREATE INDEX IF NOT EXISTS idx_companies_subscription_status ON public.companies(subscription_status);
CREATE INDEX IF NOT EXISTS idx_companies_stripe_customer ON public.companies(stripe_customer_id);