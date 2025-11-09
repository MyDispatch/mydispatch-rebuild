/* ==================================================================================
   SETTINGS CONTEXT V18.3 - Unified State Management
   ==================================================================================
   Zentraler State für alle Einstellungen-Sections
   Reduziert Redundanz und verbessert Performance
   ================================================================================== */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useCompany } from '@/hooks/use-company';
import { useSubscription } from '@/hooks/use-subscription';
import { useChatConsent } from '@/hooks/use-chat-consent';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { Profile } from '@/integrations/supabase/types/core-tables';

// Type helper for typed queries
import type { Database } from '@/integrations/supabase/types';

type TypedSupabaseClient = typeof supabase & {
  from(table: 'profiles'): ReturnType<typeof supabase.from<'profiles'>>;
};
const typedClient = supabase as TypedSupabaseClient;

interface CompanyData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id: string;
  primary_color?: string;
  logo_url?: string;
  letterhead_url?: string;
  landingpage_title?: string;
  landingpage_hero_text?: string;
  landingpage_description?: string;
  widget_button_text?: string;
  widget_size?: string;
  widget_enabled?: boolean;
  landingpage_enabled?: boolean;
  widget_show_phone?: boolean;
  business_hours?: Record<string, string>;
  company_slug?: string;
  custom_impressum_text?: string;
  custom_datenschutz_text?: string;
  custom_agb_text?: string;
  invoice_start_number?: number;
  quote_start_number?: number;
  payment_term_days?: number;
  discount_term_days?: number;
  discount_percentage?: number;
  reminder_before_due_days?: number;
  default_vat_rate?: number;
  quote_validity_days?: number;
  payment_methods?: string[] | null;
  notification_email_bookings?: boolean;
  notification_email_messages?: boolean;
  notification_sms?: boolean;
  notification_push?: boolean;
  privacy_data_processing?: boolean;
  privacy_marketing?: boolean;
  privacy_analytics?: boolean;
  total_bookings?: number;
  total_drivers?: number;
  total_vehicles?: number;
  monthly_revenue?: number;
}

interface ProfileData {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
}

interface SettingsContextType {
  companyData: CompanyData;
  setCompanyData: (data: CompanyData) => void;
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  hasUnsavedChanges: boolean;
  saveAllChanges: () => Promise<void>;
  discardChanges: () => void;
  isSaving: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { profile: authProfile } = useAuth();
  const { company, updateCompany, isUpdating } = useCompany();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalCompanyData, setOriginalCompanyData] = useState<CompanyData | null>(null);
  const [originalProfileData, setOriginalProfileData] = useState<ProfileData | null>(null);

  const [companyData, setCompanyData] = useState<CompanyData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    tax_id: '',
  });

  const [profileData, setProfileData] = useState<ProfileData>({
    id: '',
    user_id: '',
    first_name: '',
    last_name: '',
  });

  // Sync company data from React Query
  useEffect(() => {
    if (company) {
      const paymentMethods = Array.isArray(company.payment_methods)
        ? (company.payment_methods as string[])
        : ['cash', 'invoice'];

      const data = {
        ...company,
        payment_methods: paymentMethods
      } as CompanyData;

      setCompanyData(data);
      setOriginalCompanyData(data);
    }
  }, [company]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authProfile?.user_id) return;

      try {
        const { data: profileData, error } = await typedClient
          .from('profiles')
          .select('*')
          .eq('user_id', authProfile.user_id)
          .single();

        if (error) throw error;
        if (profileData) {
          setProfileData(profileData as Profile);
          setOriginalProfileData(profileData as Profile);
        }
      } catch (error) {
        logger.error('[SettingsContext] Error fetching profile', error as Error, {
          component: 'SettingsContext',
          action: 'fetchProfile'
        });
      }
    };

    fetchProfile();
  }, [authProfile?.user_id]);

  // Detect changes
  useEffect(() => {
    const companyChanged = JSON.stringify(companyData) !== JSON.stringify(originalCompanyData);
    const profileChanged = JSON.stringify(profileData) !== JSON.stringify(originalProfileData);
    setHasUnsavedChanges(companyChanged || profileChanged);
  }, [companyData, profileData, originalCompanyData, originalProfileData]);

  const saveAllChanges = async () => {
    if (!companyData.tax_id) {
      throw new Error('Umsatzsteuernummer ist obligatorisch.');
    }

    // Save company data
    updateCompany({
      name: companyData.name,
      email: companyData.email,
      phone: companyData.phone,
      address: companyData.address,
      tax_id: companyData.tax_id,
      primary_color: companyData.primary_color,
      logo_url: companyData.logo_url,
      landingpage_title: companyData.landingpage_title,
      landingpage_hero_text: companyData.landingpage_hero_text,
      landingpage_description: companyData.landingpage_description,
      widget_button_text: companyData.widget_button_text,
      widget_size: companyData.widget_size,
      widget_enabled: companyData.widget_enabled,
      landingpage_enabled: companyData.landingpage_enabled,
      widget_show_phone: companyData.widget_show_phone,
      business_hours: companyData.business_hours,
      company_slug: companyData.company_slug,
      custom_impressum_text: companyData.custom_impressum_text,
      custom_datenschutz_text: companyData.custom_datenschutz_text,
      custom_agb_text: companyData.custom_agb_text,
      invoice_start_number: companyData.invoice_start_number,
      quote_start_number: companyData.quote_start_number,
      payment_term_days: companyData.payment_term_days,
      discount_term_days: companyData.discount_term_days,
      discount_percentage: companyData.discount_percentage,
      reminder_before_due_days: companyData.reminder_before_due_days,
      default_vat_rate: companyData.default_vat_rate,
      quote_validity_days: companyData.quote_validity_days,
      payment_methods: companyData.payment_methods,
      notification_email_bookings: companyData.notification_email_bookings,
      notification_email_messages: companyData.notification_email_messages,
      notification_sms: companyData.notification_sms,
      notification_push: companyData.notification_push,
      privacy_data_processing: companyData.privacy_data_processing,
      privacy_marketing: companyData.privacy_marketing,
      privacy_analytics: companyData.privacy_analytics,
    });

    // Save profile data if changed
    if (JSON.stringify(profileData) !== JSON.stringify(originalProfileData)) {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
        })
        .eq('id', profileData.id);

      if (error) throw error;
    }
  };

  const discardChanges = () => {
    if (originalCompanyData) setCompanyData(originalCompanyData);
    if (originalProfileData) setProfileData(originalProfileData);
  };

  return (
    <SettingsContext.Provider
      value={{
        companyData,
        setCompanyData,
        profileData,
        setProfileData,
        hasUnsavedChanges,
        saveAllChanges,
        discardChanges,
        isSaving: isUpdating,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
