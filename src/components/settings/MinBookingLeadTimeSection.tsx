/* ==================================================================================
   MIN-BOOKING-LEAD-TIME-SECTION - V33.4+ TASK 8 (Updated for Migration 20251122000008)
   ==================================================================================
   Mindestvorlauf-Konfiguration für Auftragseingabe

   REQUIREMENTS (from Lastenheft):
   - Standard: 30 Minuten (wird bei Company-Creation gesetzt) [UPDATED: Was 60, now 30]
   - Options: 30 Min. / 1 Std. / 1,5 Std. / 2 Std.
   - Individuelle Unternehmer-Einstellungen
   - Validation in Auftragseingabe

   DATABASE:
   - Storage: companies.settings JSONB column (Migration 20251122000008)
   - Key: "minimum_lead_time_minutes" (integer)
   - Validation Function: validate_minimum_lead_time(company_id, pickup_datetime)
   - Trigger: check_booking_lead_time (warns but doesn't block)
   ================================================================================== */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { V28Card } from '@/components/design-system/V28Card';
import { toast } from '@/hooks/use-toast';
import { Clock, AlertCircle } from 'lucide-react';

const LEAD_TIME_OPTIONS = [
  { value: 30, label: '30 Minuten' },
  { value: 60, label: '1 Stunde' },
  { value: 90, label: '1,5 Stunden' },
  { value: 120, label: '2 Stunden' },
];

export function MinBookingLeadTimeSection() {
  const { company } = useAuth();
  const [leadTime, setLeadTime] = useState<number>(30); // Default 30 Min (per Lastenheft Update)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLeadTime();
  }, [company?.id]);

  const loadLeadTime = async () => {
    if (!company?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('settings')
        .eq('id', company.id)
        .single();

      if (error) throw error;

      // Extract minimum_lead_time_minutes from JSONB settings column
      const settings = data?.settings as { minimum_lead_time_minutes?: number } | null;
      setLeadTime(settings?.minimum_lead_time_minutes || 30); // Default 30 (per Lastenheft)
    } catch (error) {
      console.error('Failed to load lead time:', error);
      toast({
        title: 'Fehler',
        description: 'Mindestvorlauf konnte nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!company?.id) return;

    try {
      setSaving(true);

      // Fetch current settings first
      const { data: currentData, error: fetchError } = await supabase
        .from('companies')
        .select('settings')
        .eq('id', company.id)
        .single();

      if (fetchError) throw fetchError;

      // Merge new lead time into existing settings
      const currentSettings = (currentData?.settings || {}) as Record<string, unknown>;
      const updatedSettings = {
        ...currentSettings,
        minimum_lead_time_minutes: leadTime,
      };

      const { error } = await supabase
        .from('companies')
        .update({ settings: updatedSettings })
        .eq('id', company.id);

      if (error) throw error;

      toast({
        title: 'Gespeichert',
        description: `Mindestvorlauf auf ${LEAD_TIME_OPTIONS.find((o) => o.value === leadTime)?.label} aktualisiert.`,
      });
    } catch (error) {
      console.error('Failed to save lead time:', error);
      toast({
        title: 'Fehler',
        description: 'Mindestvorlauf konnte nicht gespeichert werden.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-muted animate-pulse rounded" />
        <div className="h-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Mindestvorlauf für Buchungen
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Legen Sie fest, wie lange im Voraus Aufträge gebucht werden müssen. Dies verhindert kurzfristige Buchungen,
          die nicht mehr erfüllbar sind.
        </p>
      </div>

      {/* Lead Time Selection */}
      <div className="space-y-4">
        <Label htmlFor="lead-time">Mindestvorlauf</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LEAD_TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setLeadTime(option.value)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${
                  leadTime === option.value
                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                    : 'border-border bg-background hover:border-primary/50 text-foreground'
                }
              `}
              disabled={saving}
            >
              <div className="text-2xl font-bold">{option.value}</div>
              <div className="text-xs mt-1">{option.label.split(' ')[1]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <V28Card className="bg-muted/50 border-info/20">
        <div className="p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong className="text-foreground">Wie funktioniert der Mindestvorlauf?</strong>
            </p>
            <p>
              Bei der Auftragseingabe wird geprüft, ob die Abholzeit mindestens {leadTime} Minuten in der Zukunft
              liegt. Liegt sie darunter, wird eine Warnung angezeigt.
            </p>
            <p className="text-xs">
              Beispiel: Bei 60 Minuten Mindestvorlauf können Aufträge erst ab {new Date(Date.now() + leadTime * 60000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr gebucht werden.
            </p>
          </div>
        </div>
      </V28Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {saving ? 'Speichern...' : 'Änderungen speichern'}
        </button>
      </div>
    </div>
  );
}
