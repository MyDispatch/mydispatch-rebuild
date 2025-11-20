/* ==================================================================================
   Shift Form Component - Schichtzettel Erfassung V40.2 OPTIMIERT
   ==================================================================================
   V40.2 OPTIMIERUNGEN (DASHBOARD_DESIGN_VORGABEN-KONFORM):
   - ✅ V26InfoBox für Gesamt-Km & Gesamt-Einnahmen (Konsistenz)
   - ✅ Spacing auf space-y-3 (statt 4/6) angepasst
   - ✅ Alle Abstände gemäß DASHBOARD_DESIGN_VORGABEN.md
   
   V40.0 OPTIMIERUNGEN:
   - ✅ Zentrale formatCurrency aus @/lib/index statt lokale Kopie
   - ✅ useMemo für calculateTotalKm (Performance)
   - ✅ Defensive Input-Validierung erweitert
   - ✅ Safe number parsing mit Fallbacks
   - ✅ Company-ID Guard am Anfang
   
   FEATURES:
   - Fahrer & Fahrzeug Auswahl
   - Schichtzeiten (Start/Ende, Pausen)
   - Kilometerstände (automatische Berechnung)
   - Einnahmen (Bar, Karte, Rechnung)
   - Doppelte Bestätigung
   - DSGVO-konform mit company_id
   ================================================================================== */

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth.tsx";
import { useShifts } from "@/hooks/use-shifts";
import { supabase } from "@/integrations/supabase/client";
import { V28Button } from "@/components/design-system/V28Button";
import { Input, Checkbox } from "@/lib/compat";
import { Label } from "@/components/ui/label";
import { handleError, handleSuccess } from "@/lib/error-handler";
import { formatCurrency } from "@/lib/index";
import { Loader2, Clock, Car, Euro, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { V26InfoBox } from "@/components/design-system/V26InfoBox";

interface ShiftFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
}

interface Vehicle {
  id: string;
  license_plate: string;
  concession_number: string | null;
}

export function ShiftForm({ onSuccess, onCancel }: ShiftFormProps) {
  const { profile } = useAuth();
  const { createShift } = useShifts();
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // V40.0: Company-ID Guard
  if (!profile?.company_id) {
    return (
      <div className="p-4 text-center text-destructive">
        Fehler: Company-ID fehlt. Bitte melden Sie sich erneut an.
      </div>
    );
  }

  const [formData, setFormData] = useState({
    driver_id: undefined as string | undefined,
    vehicle_id: undefined as string | undefined,
    date: format(new Date(), "yyyy-MM-dd"),
    shift_start_time: "",
    shift_end_time: "",
    pause_start_time: "",
    pause_end_time: "",
    km_start: "",
    km_end: "",
    cash_earnings: "0",
    card_earnings: "0",
    invoice_earnings: "0",
    confirmed_by_driver: false,
  });

  useEffect(() => {
    if (profile?.company_id) {
      fetchDrivers();
      fetchVehicles();
    }
  }, [profile?.company_id]);

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("id, first_name, last_name")
        .eq("company_id", profile?.company_id)
        .order("last_name");

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      handleError(error, "Fehler beim Laden der Fahrer", { showToast: false });
    }
  };

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, license_plate, concession_number")
        .eq("company_id", profile?.company_id)
        .order("license_plate");

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      handleError(error, "Fehler beim Laden der Fahrzeuge", { showToast: false });
    }
  };

  // V40.0: Memoized calculation for performance
  const calculateTotalKm = useMemo(() => {
    return () => {
      const start = parseFloat(formData.km_start);
      const end = parseFloat(formData.km_end);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        return end - start;
      }
      return null;
    };
  }, [formData.km_start, formData.km_end]);

  // V40.0: Safe number parsing with fallback
  const safeParseFloat = (value: string, defaultValue: number = 0): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  // V40.0: Memoized total earnings
  const totalEarnings = useMemo(() => {
    return (
      safeParseFloat(formData.cash_earnings) +
      safeParseFloat(formData.card_earnings) +
      safeParseFloat(formData.invoice_earnings)
    );
  }, [formData.cash_earnings, formData.card_earnings, formData.invoice_earnings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // V40.0: Comprehensive Input Validation
    if (!formData.driver_id || !formData.vehicle_id) {
      handleError(
        new Error("Missing required fields"),
        "Bitte wählen Sie Fahrer und Fahrzeug aus",
        { showToast: true, logToSupabase: false }
      );
      return;
    }

    if (!formData.shift_start_time || !formData.shift_end_time) {
      handleError(new Error("Missing shift times"), "Bitte geben Sie Schichtzeiten an", {
        showToast: true,
        logToSupabase: false,
      });
      return;
    }

    if (!formData.confirmed_by_driver) {
      handleError(new Error("Missing confirmation"), "Fahrer muss die Schichtdaten bestätigen", {
        showToast: true,
        logToSupabase: false,
      });
      return;
    }

    setLoading(true);

    try {
      const selectedVehicle = vehicles.find((v) => v.id === formData.vehicle_id);
      const totalKm = calculateTotalKm();

      // V40.0: Safe number parsing for all numeric fields
      const shiftData = {
        driver_id: formData.driver_id!,
        vehicle_id: formData.vehicle_id!,
        date: formData.date,
        shift_start_time: formData.shift_start_time,
        shift_end_time: formData.shift_end_time,
        pause_start_time: formData.pause_start_time || undefined,
        pause_end_time: formData.pause_end_time || undefined,
        km_start: safeParseFloat(formData.km_start, 0) || undefined,
        km_end: safeParseFloat(formData.km_end, 0) || undefined,
        total_km: totalKm,
        cash_earnings: safeParseFloat(formData.cash_earnings),
        card_earnings: safeParseFloat(formData.card_earnings),
        invoice_earnings: safeParseFloat(formData.invoice_earnings),
        license_plate: selectedVehicle?.license_plate || undefined,
        concession_number: selectedVehicle?.concession_number || undefined,
        confirmed_by_driver: formData.confirmed_by_driver,
        approved_by_company: false,
      };

      // ✅ MISSION II: TanStack Query Hook statt direktem Supabase-Call
      await createShift(shiftData);

      handleSuccess("Schicht erfolgreich erfasst");
      onSuccess();
    } catch (error) {
      handleError(error, "Schicht konnte nicht gespeichert werden", {
        showToast: true,
        logToSupabase: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Fahrer & Fahrzeug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="driver_id">Fahrer *</Label>
          <SearchableSelect
            options={drivers.map((driver) => ({
              value: driver.id,
              label: `${driver.last_name}, ${driver.first_name}`,
            }))}
            value={formData.driver_id}
            onValueChange={(value) => setFormData({ ...formData, driver_id: value })}
            placeholder="Fahrer auswählen..."
            searchPlaceholder="Fahrer suchen..."
            emptyText="Kein Fahrer gefunden"
          />
        </div>

        <div>
          <Label htmlFor="vehicle_id">Fahrzeug *</Label>
          <SearchableSelect
            options={vehicles.map((vehicle) => ({
              value: vehicle.id,
              label: `${vehicle.license_plate}${vehicle.concession_number ? ` (${vehicle.concession_number})` : ""}`,
            }))}
            value={formData.vehicle_id}
            onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
            placeholder="Fahrzeug auswählen..."
            searchPlaceholder="Fahrzeug suchen..."
            emptyText="Kein Fahrzeug gefunden"
          />
        </div>
      </div>

      {/* Datum */}
      <div>
        <Label htmlFor="date">Datum *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      {/* Schichtzeiten */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4 text-foreground" />
          Schichtzeiten
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shift_start_time">Schichtbeginn *</Label>
            <Input
              id="shift_start_time"
              type="time"
              value={formData.shift_start_time}
              onChange={(e) => setFormData({ ...formData, shift_start_time: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="shift_end_time">Schichtende *</Label>
            <Input
              id="shift_end_time"
              type="time"
              value={formData.shift_end_time}
              onChange={(e) => setFormData({ ...formData, shift_end_time: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Pausenzeiten */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Pausenzeiten (optional)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pause_start_time">Pausenbeginn</Label>
            <Input
              id="pause_start_time"
              type="time"
              value={formData.pause_start_time}
              onChange={(e) => setFormData({ ...formData, pause_start_time: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="pause_end_time">Pausenende</Label>
            <Input
              id="pause_end_time"
              type="time"
              value={formData.pause_end_time}
              onChange={(e) => setFormData({ ...formData, pause_end_time: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Kilometerstände */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Car className="h-4 w-4 text-foreground" />
          Kilometerstände
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="km_start">Km-Stand Beginn</Label>
            <Input
              id="km_start"
              type="number"
              step="0.1"
              value={formData.km_start}
              onChange={(e) => setFormData({ ...formData, km_start: e.target.value })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="km_end">Km-Stand Ende</Label>
            <Input
              id="km_end"
              type="number"
              step="0.1"
              value={formData.km_end}
              onChange={(e) => setFormData({ ...formData, km_end: e.target.value })}
              placeholder="0"
            />
          </div>
        </div>
        {calculateTotalKm() !== null && (
          <V26InfoBox type="info">
            <p className="text-xs">
              <strong>Gesamt-Km:</strong> {calculateTotalKm()} km
            </p>
          </V26InfoBox>
        )}
      </div>

      {/* Einnahmen */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Euro className="h-4 w-4 text-foreground" />
          Einnahmen (€)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="cash_earnings">Bar</Label>
            <Input
              id="cash_earnings"
              type="number"
              step="0.01"
              value={formData.cash_earnings}
              onChange={(e) => setFormData({ ...formData, cash_earnings: e.target.value })}
              placeholder="0,00"
            />
          </div>
          <div>
            <Label htmlFor="card_earnings">Karte</Label>
            <Input
              id="card_earnings"
              type="number"
              step="0.01"
              value={formData.card_earnings}
              onChange={(e) => setFormData({ ...formData, card_earnings: e.target.value })}
              placeholder="0,00"
            />
          </div>
          <div>
            <Label htmlFor="invoice_earnings">Rechnung</Label>
            <Input
              id="invoice_earnings"
              type="number"
              step="0.01"
              value={formData.invoice_earnings}
              onChange={(e) => setFormData({ ...formData, invoice_earnings: e.target.value })}
              placeholder="0,00"
            />
          </div>
        </div>
        <V26InfoBox type="info">
          <p className="text-xs">
            <strong>Gesamt:</strong> {formatCurrency(totalEarnings)}
          </p>
        </V26InfoBox>
      </div>

      {/* Bestätigung */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-md">
        <Checkbox
          id="confirmed_by_driver"
          checked={formData.confirmed_by_driver}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, confirmed_by_driver: checked as boolean })
          }
        />
        <div className="flex-1">
          <Label htmlFor="confirmed_by_driver" className="cursor-pointer flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-foreground" />
            <span className="font-medium">Fahrer-Bestätigung *</span>
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Ich bestätige, dass alle Angaben korrekt sind und der Schicht entsprechen.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <V28Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Abbrechen
        </V28Button>
        <V28Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Schicht speichern
        </V28Button>
      </div>
    </form>
  );
}
