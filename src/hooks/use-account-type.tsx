/* ==================================================================================
   ACCOUNT-TYPE DETECTION HOOK - V18.2
   ==================================================================================
   Erkennt Account-Typen: Normal, Test, Master
   - Normal: Reguläre Kunden (Starter/Business)
   - Test: courbois1981@gmail.com, demo@my-dispatch.de (Tariff-Switching)
   - Master: master@my-dispatch.de (Master-Dashboard)
   ================================================================================== */

import { useMemo } from 'react';
import { useAuth } from './use-auth';
import { isBusinessTier } from '@/lib/subscription-utils';

export type AccountType = 'normal' | 'test' | 'master';

const SPECIAL_ACCOUNTS = {
  test: [
    'demo@my-dispatch.de',
  ],
  master: [
    'courbois1981@gmail.com',
    'master@my-dispatch.de',
  ],
} as const;

interface AccountPermissions {
  canSwitchTariff: boolean;
  canAccessMasterDashboard: boolean;
  canBypassPayment: boolean;
  canAccessBusinessFeatures: boolean;
}

interface UseAccountTypeReturn {
  accountType: AccountType;
  permissions: AccountPermissions;
}

export function useAccountType(): UseAccountTypeReturn {
  const { user, profile } = useAuth();

  const accountType: AccountType = useMemo(() => {
    if (!user?.email) return 'normal';
    const emailLower = user.email.toLowerCase().trim();
    
    // Check master first (highest priority)
    if (SPECIAL_ACCOUNTS.master.some(e => e.toLowerCase() === emailLower)) {
      return 'master';
    }
    // Then check test
    if (SPECIAL_ACCOUNTS.test.some(e => e.toLowerCase() === emailLower)) {
      return 'test';
    }
    return 'normal';
  }, [user?.email]);

  const permissions: AccountPermissions = useMemo(() => {
    const canBypassPayment = accountType === 'test' || accountType === 'master';
    const hasBusinessSubscription = isBusinessTier(profile?.company?.subscription_product_id);
    
    return {
      canSwitchTariff: accountType === 'test' || accountType === 'master',
      canAccessMasterDashboard: accountType === 'master',
      canBypassPayment,
      canAccessBusinessFeatures: 
        accountType !== 'normal' || hasBusinessSubscription,
    };
  }, [accountType, profile?.company?.subscription_product_id]);

  return { accountType, permissions };
}
