/* ==================================================================================
   Subscription Hook - V18.3.19 Sprint 41
   ==================================================================================
   - Verbesserte Fehlerbehandlung
   - Loading-States
   - Error-State im Context
   - Type-Safety
   ================================================================================== */

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { toast } from 'sonner';
import { handleError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

interface SubscriptionContextType {
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
  error: string | null;
  checkSubscription: () => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

function SubscriptionProviderInner({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = async () => {
    // Guard: Kein User oder Profile
    if (!user || !profile?.company_id) {
      setSubscribed(false);
      setProductId(null);
      setSubscriptionEnd(null);
      setLoading(false);
      setError('Kein Benutzer angemeldet');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // PRIMÄR: Datenbank ist die einzige Wahrheitsquelle
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('subscription_product_id, subscription_status, subscription_current_period_end')
        .eq('id', profile.company_id)
        .single();

      if (companyError) {
        throw new Error(companyError.message || 'Fehler beim Laden der Unternehmensdaten');
      }
      
      if (companyData) {
        const isActive = companyData.subscription_status === 'active';
        const productId = companyData.subscription_product_id || null;
        
        setSubscribed(isActive);
        setProductId(productId);
        setSubscriptionEnd(companyData.subscription_current_period_end || null);
        
        // Debug-Log (nur in Development)
        if (import.meta.env.DEV) {
          logger.info('[Subscription] Loaded', {
            component: 'useSubscription',
            subscribed: isActive,
            productId,
            subscriptionEnd: companyData.subscription_current_period_end,
          });
        }
      } else {
        // Kein Data: Starter-Tarif oder nicht subscribed
        setSubscribed(false);
        setProductId(null);
        setSubscriptionEnd(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fehler beim Laden des Abonnements';
      setError(errorMessage);
      handleError(err, 'checkSubscription');
      
      // Fallback zu "nicht subscribed"
      setSubscribed(false);
      setProductId(null);
      setSubscriptionEnd(null);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    // Guard: Kein User oder Profile
    if (!user || !profile?.company_id) {
      toast.error('Bitte melden Sie sich an');
      return;
    }

    try {
      toast.loading('Öffne Kundenportal...');

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { company_id: profile.company_id }
      });

      if (error) {
        throw new Error(error.message || 'Fehler beim Öffnen des Kundenportals');
      }

      if (data?.url) {
        toast.dismiss();
        window.location.href = data.url;
      } else {
        throw new Error('Keine Portal-URL erhalten');
      }
    } catch (err) {
      toast.dismiss();
      const errorMessage = err instanceof Error ? err.message : 'Fehler beim Öffnen des Kundenportals';
      handleError(err, 'openCustomerPortal');
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    checkSubscription();

    // Auto-refresh alle 30 Sekunden
    const interval = setInterval(checkSubscription, 30000);
    return () => clearInterval(interval);
  }, [user, profile?.company_id]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscribed,
        productId,
        subscriptionEnd,
        loading,
        error,
        checkSubscription,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  return <SubscriptionProviderInner>{children}</SubscriptionProviderInner>;
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}
