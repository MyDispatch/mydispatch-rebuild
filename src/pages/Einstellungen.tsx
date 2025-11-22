/* ==================================================================================
   EINSTELLUNGEN V38.0 - GOLDEN TEMPLATE ENFORCEMENT
   ==================================================================================
   ✅ StandardPageLayout
   ✅ Accordion-Navigation (Mobile-optimiert)
   ✅ Unified State Management mit Context
   ✅ Sticky Save-Bar für ungespeicherte Änderungen
   ✅ Desktop & Mobile optimiert
   ❌ KEINE KPIs (Settings haben keine Metriken)
   ❌ KEINE UniversalExportBar (Settings-Daten werden nicht exportiert)
   ================================================================================== */

import { useAuth } from '@/hooks/use-auth';
import { V28Button } from '@/components/design-system/V28Button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

// Context
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';

// Section Components
import { CompanyProfileSection } from '@/components/settings/CompanyProfileSection';
import { LocationSettingsTab } from '@/components/settings/LocationSettingsTab';
import { BrandingSection } from '@/components/settings/BrandingSection';
import { MinBookingLeadTimeSection } from '@/components/settings/MinBookingLeadTimeSection';
import { SubscriptionSection } from '@/components/settings/SubscriptionSection';
import { PaymentSettingsSection } from '@/components/settings/PaymentSettingsSection';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { NotificationsSection } from '@/components/settings/NotificationsSection';
import { PrivacySection } from '@/components/settings/PrivacySection';
import { SystemInfoSection } from '@/components/settings/SystemInfoSection';
import { APIKeyManagement } from '@/components/admin/APIKeyManagement';

const MASTER_ACCOUNT_EMAIL = "info@my-dispatch.de"; // Legacy fallback: courbois1981@gmail.com

function SettingsContent() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { hasUnsavedChanges, saveAllChanges, discardChanges, isSaving } = useSettings();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('company-profile');

  const isMasterAccount = user?.email === MASTER_ACCOUNT_EMAIL;

  // Authentication Guard - KRITISCH für Sicherheit!
  useEffect(() => {
    if (!loading && !profile) {
      navigate('/auth', { replace: true });
    }
  }, [loading, profile, navigate]);

  // URL-Parameter-Steuerung für Deep-Links
  useEffect(() => {
    const tab = searchParams.get('tab');
    const tabMap: Record<string, string> = {
      'standort': 'company-location',
      'location': 'company-location',
      'firmenprofil': 'company-profile',
      'branding': 'company-branding',
      'abonnement': 'billing-subscription',
      'zahlung': 'billing-payment',
      'profil': 'user-profile',
      'benachrichtigungen': 'settings-notifications',
      'datenschutz': 'settings-privacy',
      'system': 'settings-system',
      'integrationen': 'integrations-n8n',
    };

    if (tab && tabMap[tab]) {
      setActiveTab(tabMap[tab]);
    }
  }, [searchParams]);

  const handleSave = async () => {
    try {
      await saveAllChanges();
      handleSuccess('Einstellungen erfolgreich gespeichert');
    } catch (error) {
      handleError(error, 'Einstellungen konnten nicht gespeichert werden');
    }
  };

  return (
    <>
      <Accordion type="single" collapsible value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        {/* Gruppe: Unternehmen */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground px-2">Unternehmen</h3>

          <AccordionItem value="company-profile" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              Firmenprofil
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <CompanyProfileSection />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="company-location" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              Standort
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <LocationSettingsTab />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="company-branding" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              Branding & Logo
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <BrandingSection />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="company-lead-time" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              Mindestvorlauf für Buchungen
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <MinBookingLeadTimeSection />
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Gruppe: Abrechnung */}
        <div className="space-y-2 pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-2">Abrechnung</h3>

          <AccordionItem value="billing-subscription" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              Tarif & Abonnement
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <SubscriptionSection />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="billing-payment" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              Zahlungsmethoden
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <PaymentSettingsSection />
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Gruppe: Profil & Team */}
        <div className="space-y-2 pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-2">Profil & Team</h3>

          <AccordionItem value="user-profile" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              Benutzerprofil
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <ProfileSection />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="team-management" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              Team-Verwaltung
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <div className="bg-muted p-8 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Team-Verwaltung wird in Kürze verfügbar sein
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Gruppe: Benachrichtigungen */}
        <div className="space-y-2 pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-2">Benachrichtigungen</h3>

          <AccordionItem value="notifications" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              Benachrichtigungen
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <NotificationsSection />
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Gruppe: Datenschutz */}
        <div className="space-y-2 pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-2">Datenschutz</h3>

          <AccordionItem value="privacy" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              Datenschutz & Sicherheit
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <PrivacySection />
            </AccordionContent>
          </AccordionItem>
        </div>
        {/* Gruppe: System & API */}
        <div className="space-y-2 pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-2">System & API</h3>

          <AccordionItem value="system-api-keys" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              🔑 API-Schlüssel
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <APIKeyManagement />
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Gruppe: Automatisierung */}
        <div className="space-y-2 pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground px-2">Automatisierung</h3>

          <AccordionItem value="system-info" className="border rounded-lg bg-card">
            <AccordionTrigger className="text-base font-medium hover:no-underline px-8 py-5">
              System-Informationen
            </AccordionTrigger>
            <AccordionContent className="px-8 pb-8">
              <SystemInfoSection />
            </AccordionContent>
          </AccordionItem>
        </div>
      </Accordion>

      {/* Sticky Save-Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 z-50">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <p className="text-sm text-muted-foreground">
              Sie haben ungespeicherte Änderungen
            </p>
            <div className="flex gap-3">
              <V28Button variant="secondary" onClick={discardChanges}>
                Verwerfen
              </V28Button>
              <V28Button onClick={handleSave} disabled={isSaving} variant="primary">
                {isSaving ? 'Speichert...' : 'Alle Änderungen speichern'}
              </V28Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Einstellungen() {
  return (
    <StandardPageLayout
      title="Einstellungen - MyDispatch"
      description="Unternehmensprofil, Tarife und Systemeinstellungen für MyDispatch"
      canonical="/einstellungen"
      subtitle="Verwalten Sie Ihr Unternehmensprofil und Systemeinstellungen"
      cardTitle="Einstellungen"
      cardIcon={<Settings className="h-5 w-5" />}
    >
      <SettingsProvider>
        <SettingsContent />
      </SettingsProvider>
    </StandardPageLayout>
  );
}
