/* ==================================================================================
   AUFTRÄGE V28.1 - PROFESSIONAL GRAY-BLUE FLAT DESIGN
   ==================================================================================
   ✅ V28.1 Pure Tailwind Slate Design System
   ✅ Professional Gray-Blue Minimalism (dezent & B2B-konform)
   ✅ Flat Design 2.0 - Keine 3D-Effekte
   ✅ 100% Tailwind Native - KEINE Token-Imports
   ✅ Slate Palette (slate-900, slate-600, slate-200)
   ✅ 1px Borders, Tailwind Shadows (shadow-sm/md/lg)
   ✅ 100% Funktionalität beibehalten
   ================================================================================== */

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormData } from "@/schemas/booking.schema";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { useLocation } from "react-router-dom";
import { useDeviceType } from "@/hooks/use-device-type";
import { isBusinessTier } from "@/lib/subscription-utils";
import { supabase } from "@/integrations/supabase/client";
import { useBookings } from "@/hooks/use-bookings";
import { useRealtimeBookings } from "@/hooks/use-realtime-bookings";
import { StandardPageLayout } from "@/components/layout/StandardPageLayout";
import { EmptyState } from "@/components/shared/EmptyState";
import { useTouchTargetValidation } from "@/hooks/validation/useTouchTargetValidation";
import { V28Button } from "@/components/design-system/V28Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  StatusIndicator,
  getBookingStatusType,
  getPaymentStatusType,
} from "@/components/shared/StatusIndicator";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Euro,
  Handshake,
  Edit,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { validateFutureBooking } from "@/lib/date-validation";
import { handleError, handleSuccess } from "@/lib/error-handler";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { PartnerFilter } from "@/components/shared/PartnerFilter";
import { DetailDialog } from "@/components/shared/DetailDialog";
import { BookingsTable } from "@/components/tables/BookingsTable";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { useMemoizedFilter } from "@/hooks/use-memoized-kpis";
import { BulkActionBar } from "@/components/shared/BulkActionBar";
import { Mail, Download, RefreshCw, Archive as ArchiveIcon } from "lucide-react";
import { RelatedEntityCard, getStandardActions } from "@/components/shared/RelatedEntityCard";
import { SmartAssignmentDialog } from "@/components/booking/SmartAssignmentDialog";
import { MobileAuftraege } from "@/components/mobile/MobileAuftraege";
import { KPIGenerator } from "@/lib/dashboard-automation";
import { formatCurrency } from "@/lib/format-utils";
import { BookingForm } from "@/components/forms/wrapped/BookingForm";
import { useDevValidation } from "@/hooks/validation";
// Recharts imports removed - charts currently not in use
import { UniversalExportBar } from "@/components/dashboard/UniversalExportBar";
import { useBookingData } from "@/hooks/use-booking-data";
import { StatCard } from "@/components/smart-templates/StatCard";

interface Booking {
  id: string;
  created_at: string;
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  status: string;
  payment_status: string;
  price: number;
  customer_id?: string;
  driver_id?: string;
  vehicle_id?: string;
  cost_center_id?: string;
  payment_method?: string;
  is_offer?: boolean;
  is_partner_booking?: boolean;
  partner_id?: string;
  partner_provision_manual?: number;
  archived?: boolean;
  offer_status?: string;
  // Erweiterte Felder
  passengers?: number;
  luggage?: number;
  vehicle_type?: string;
  special_requests?: string;
  is_airport_pickup?: boolean;
  is_train_station_pickup?: boolean;
  flight_number?: string;
  terminal?: string;
  train_number?: string;
  arrival_time?: string;
  wait_time?: number;
  meet_and_greet?: boolean;
  name_sign?: string;
  vat_rate?: number;
  assignment_type?: string;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  is_manually_created: boolean;
  phone?: string;
  email?: string;
}

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  license_number?: string;
  shift_status?: string;
  phone?: string;
}

interface Vehicle {
  id: string;
  license_plate: string;
  vehicle_class?: string;
  status?: string;
}

interface CostCenter {
  id: string;
  name: string;
}

interface Partner {
  id: string;
  name: string;
  provision_amount?: number;
  phone?: string;
  email?: string;
}

export default function Auftraege() {
  // ✅ V5.0 FIX 3: Validation Hooks (Development-Only)
  useDevValidation("Auftraege");
  useTouchTargetValidation();

  // ✅ PHASE 1: ALLE HOOKS VOR BEDINGTER LOGIK
  const { profile, company } = useAuth();
  const { productId } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // V18.3.2: React Query Integration für optimale Performance
  const {
    bookings: allBookings,
    isLoading: bookingsLoading,
    createBooking,
    updateBooking: updateBookingMutation,
  } = useBookings();

  // V18.3: Bulk-Selection Integration (MUSS VOR isMobile-Check sein!)
  const bulkSelection = useBulkSelection<Booking>();

  // ✅ JETZT ERST Device-Type Check
  const { isMobile } = useDeviceType();

  // V28.2.19: Statistics für Quick-Actions (currently not in use)

  const currentTab = searchParams.get("tab") || "auftraege";

  // Business+ Feature Check
  const hasBusinessFeatures = isBusinessTier(productId);

  // ⚡ V37.2: Separate Datenquellen für Aufträge & Angebote
  const bookings = useMemoizedFilter(
    () => allBookings.filter((b) => !b.is_offer && !b.archived),
    [allBookings]
  );

  const offers = useMemoizedFilter(
    () => allBookings.filter((b) => b.is_offer && !b.archived),
    [allBookings]
  );

  const loading = bookingsLoading;

  // ✅ V28.2 REFACTORING: Data fetching via custom hook
  const {
    customers,
    drivers,
    vehicles,
    costCenters,
    partners,
    fetchCustomers,
    fetchDrivers,
    fetchVehicles,
  } = useBookingData(profile?.company_id);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [filterPartner, setFilterPartner] = useState<string>("all");
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [selectedBookingForPartner, setSelectedBookingForPartner] = useState<Booking | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [smartAssignmentOpen, setSmartAssignmentOpen] = useState(false);
  const [smartAssignmentData, setSmartAssignmentData] = useState<{
    bookingId: string;
    pickupLocation: { lat: number; lng: number };
    pickupTime: string;
    vehicleClass?: string;
    passengers: number;
  } | null>(null);
  const [, setShowInlineCustomerForm] = useState(false);

  // ⚡ V37.1 FIX: ALLE useMemo Hooks VOR Early Returns! (React Hook Rules!)
  // V18.5.1: SSOT - Einheitliche KPIs und Quick Actions für Mobile + Desktop
  const bookingKPIs = useMemo(
    () =>
      [
        KPIGenerator.bookings.open(
          bookings.filter((b) => !b.archived && b.status === "pending").length
        ),
        KPIGenerator.bookings.today(
          bookings.filter(
            (b) =>
              !b.archived && new Date(b.pickup_time).toDateString() === new Date().toDateString()
          ).length,
          bookings
            .filter(
              (b) =>
                !b.archived &&
                new Date(b.pickup_time).toDateString() === new Date().toDateString() &&
                b.payment_status === "paid"
            )
            .reduce((sum, b) => sum + (b.price || 0), 0)
        ),
        KPIGenerator.custom({
          title: "Umsatz heute",
          value: formatCurrency(
            bookings
              .filter(
                (b) =>
                  !b.archived &&
                  new Date(b.pickup_time).toDateString() === new Date().toDateString() &&
                  b.payment_status === "paid"
              )
              .reduce((sum, b) => sum + (b.price || 0), 0)
          ),
          icon: Euro,
          subtitle: `${bookings.filter((b) => !b.archived && b.payment_status === "paid").length} bezahlt`,
        }),
      ] as [any, any, any],
    [bookings]
  );

  // ⚡ V37.2: KPIs für Angebote
  const offerKPIs = useMemo(
    () =>
      [
        KPIGenerator.custom({
          title: "Offene Angebote",
          value: offers.filter((o) => !o.offer_status || o.offer_status === "pending").length,
          icon: BookOpen,
          subtitle: "Warten auf Annahme",
        }),
        KPIGenerator.custom({
          title: "Angenommene Angebote",
          value: offers.filter((o) => o.offer_status === "accepted").length,
          icon: FileText,
          subtitle: "Wurden akzeptiert",
        }),
        KPIGenerator.custom({
          title: "Gesamtwert Angebote",
          value: formatCurrency(offers.reduce((sum, o) => sum + (o.price || 0), 0)),
          icon: Euro,
          subtitle: `${offers.length} Angebote gesamt`,
        }),
      ] as [any, any, any],
    [offers]
  );

  // ⚡ V37.2 FIX: Chart-Daten useMemo MUSS vor Early Returns stehen (React Hook Rules!)
  // Charts aktuell nicht aktiv
  const offersChartData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayOffers = offers.filter((b) => {
        if (!b.created_at) return false;
        const offerDate = new Date(b.created_at);
        return offerDate.toDateString() === date.toDateString();
      });
      data.push({
        date: format(date, "dd.MM", { locale: de }),
        count: dayOffers.length,
      });
    }
    return data;
  }, [offers]);

  // V18.3: Auto-open Dialog wenn von Dashboard navigiert
  useEffect(() => {
    if (location.state?.openCreateDialog) {
      setIsDialogOpen(true);
      // Clear state nach öffnen
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ⚡ V37.2: Realtime Updates für Aufträge ohne Refresh
  // ✅ REALTIME: Verwendet dedizierten Hook (keine direkten Supabase-Calls)
  useRealtimeBookings();

  // ✅ V28.1 FORM MIGRATION: Schema aus zentraler Datei (src/schemas/booking.schema.ts)

  // ✅ V28.1 FORM MIGRATION: React Hook Form Instance
  const bookingForm = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pickup_date: "",
      pickup_time: "",
      pickup_street: "",
      pickup_street_number: "",
      pickup_postal_code: "",
      pickup_city: "",
      dropoff_street: "",
      dropoff_street_number: "",
      dropoff_postal_code: "",
      dropoff_city: "",
      passengers: "1",
      luggage: "0",
      vehicle_type: "Economy Class (1-4 Pax)",
      payment_method: "invoice",
      price: "",
      vat_rate: "19",
      special_requests: "",
      status: "pending",
      payment_status: "pending",
      assignment_type: "automatisch",
      is_partner_booking: false,
      is_airport_pickup: false,
      is_train_station_pickup: false,
      wait_time: "0",
      meet_and_greet: false,
    },
  });

  // ✅ V28.2 REFACTORING: Data fetching removed - handled by useBookingData hook

  // ✅ V28.1 FORM MIGRATION: Submit Handler
  const handleBookingSubmit = async (data: BookingFormData) => {
    if (!profile?.company_id) return;

    // Validiere Future Booking mit Mindestvorlauf
    try {
      const pickupDateTime = `${data.pickup_date}T${data.pickup_time}`;

      // Hole Mindestvorlauf aus Company Settings
      const minimumLeadTime = (company?.settings as { minimum_lead_time_minutes?: number })?.minimum_lead_time_minutes || 30;

      validateFutureBooking(new Date(pickupDateTime), minimumLeadTime);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Rückwirkende Buchungen sind nicht erlaubt";
      handleError(error, message);
      return;
    }

    const bookingData = {
      pickup_address: [
        data.pickup_street,
        data.pickup_street_number,
        data.pickup_postal_code,
        data.pickup_city,
      ]
        .filter(Boolean)
        .join(", "),
      dropoff_address: [
        data.dropoff_street,
        data.dropoff_street_number,
        data.dropoff_postal_code,
        data.dropoff_city,
      ]
        .filter(Boolean)
        .join(", "),
      pickup_time: `${data.pickup_date}T${data.pickup_time}`,
      price: data.price ? parseFloat(data.price) : null,
      customer_id: data.customer_id || null,
      driver_id: data.driver_id || null,
      vehicle_id: data.vehicle_id || null,
      cost_center_id: data.cost_center_id || null,
      payment_method: data.payment_method,
      company_id: profile.company_id,
      is_offer: false,
      status: data.status as "pending" | "confirmed" | "in_progress" | "completed" | "cancelled",
      payment_status: data.payment_status as "pending" | "paid" | "overdue" | "cancelled",
      passengers: parseInt(data.passengers) || 1,
      luggage: parseInt(data.luggage) || 0,
      vehicle_type: data.vehicle_type,
      special_requests: data.special_requests || null,
      is_airport_pickup: data.is_airport_pickup,
      is_train_station_pickup: data.is_train_station_pickup,
      flight_number: data.flight_number || null,
      terminal: data.terminal || null,
      train_number: data.train_number || null,
      arrival_time: data.arrival_time || null,
      wait_time: parseInt(data.wait_time) || 0,
      meet_and_greet: data.meet_and_greet,
      name_sign: data.name_sign || null,
      vat_rate: parseFloat(data.vat_rate) || 19,
      assignment_type: data.assignment_type,
      is_partner_booking: data.is_partner_booking,
      partner_id: data.partner_id || null,
      partner_provision_manual: data.partner_provision_manual
        ? parseFloat(data.partner_provision_manual)
        : null,
    };

    try {
      if (editingBooking) {
        await new Promise<void>((resolve, reject) => {
          updateBookingMutation(
            { id: editingBooking.id, updates: bookingData },
            {
              onSuccess: () => {
                bookingForm.reset();
                setIsDialogOpen(false);
                setEditingBooking(null);
                resolve();
              },
              onError: (error) => reject(error),
            }
          );
        });
      } else {
        await new Promise<void>((resolve, reject) => {
          createBooking(bookingData, {
            onSuccess: () => {
              bookingForm.reset();
              setIsDialogOpen(false);
              resolve();
            },
            onError: (error) => reject(error),
          });
        });
      }
    } catch (error) {
      // Error handling is already done in the mutations (logger.error)
    }
  };

  // V18.3: Bulk-Actions Handlers
  const handleBulkStatusChange = async () => {
    const statusOptions = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ] as const;
    const newStatus = await new Promise<string>((resolve) => {
      const status = prompt(`Neuer Status (${statusOptions.join(", ")}):`);
      resolve(status || "");
    });

    if (!newStatus || !statusOptions.includes(newStatus as any)) {
      handleError(new Error("Ungültiger Status"), "Ungültiger Status");
      return;
    }

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: newStatus as "pending" | "confirmed" | "in_progress" | "completed" | "cancelled",
        })
        .in("id", bulkSelection.selectedIds);

      if (error) throw error;
      handleSuccess(`${bulkSelection.selectedCount} Aufträge aktualisiert`);
      // React Query invalidiert automatisch
      bulkSelection.clearSelection();
    } catch (error) {
      handleError(error, "Status konnte nicht geändert werden");
    }
  };

  const handleBulkArchive = async () => {
    if (!confirm(`${bulkSelection.selectedCount} Aufträge wirklich archivieren?`)) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ archived: true, archived_at: new Date().toISOString() })
        .in("id", bulkSelection.selectedIds);

      if (error) throw error;
      handleSuccess(`${bulkSelection.selectedCount} Aufträge archiviert`);
      // React Query invalidiert automatisch
      bulkSelection.clearSelection();
    } catch (error) {
      handleError(error, "Aufträge konnten nicht archiviert werden");
    }
  };

  const handleBulkPDFExport = async () => {
    try {
      toast({
        title: "PDF-Export wird erstellt...",
        description: `${bulkSelection.selectedCount} Aufträge werden exportiert.`,
      });

      const { data, error } = await supabase.functions.invoke("bulk-export-pdf", {
        body: {
          entity_type: "bookings",
          entity_ids: bulkSelection.selectedIds,
        },
      });

      if (error) throw error;

      handleSuccess(`${data.count} PDFs erfolgreich erstellt`);
      // In production, trigger download of ZIP file
      if (data.download_url) {
        window.open(data.download_url, "_blank");
      }
    } catch (error) {
      handleError(error, "PDF-Export fehlgeschlagen");
    }
  };

  const handleBulkEmail = async () => {
    const emailType = prompt("Email-Typ (confirmation/invoice/reminder):", "confirmation");
    if (!emailType) return;

    try {
      toast({
        title: "E-Mails werden versendet...",
        description: `${bulkSelection.selectedCount} E-Mails werden versendet.`,
      });

      const { data, error } = await supabase.functions.invoke("bulk-send-email", {
        body: {
          entity_type: "bookings",
          entity_ids: bulkSelection.selectedIds,
          email_type: emailType,
        },
      });

      if (error) throw error;

      handleSuccess(
        `${data.sent} E-Mails erfolgreich versendet${data.failed > 0 ? ` (${data.failed} fehlgeschlagen)` : ""}`
      );
      bulkSelection.clearSelection();
    } catch (error) {
      handleError(error, "E-Mail-Versand fehlgeschlagen");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ archived: true, archived_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      handleSuccess("Auftrag wurde archiviert");
      setDetailDialogOpen(false);
      // React Query invalidiert automatisch
    } catch (error) {
      handleError(error, "Auftrag konnte nicht archiviert werden");
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailDialogOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    // ✅ V28.1: Use react-hook-form reset with values
    bookingForm.reset({
      customer_id: booking.customer_id || "",
      pickup_date: booking.pickup_time ? booking.pickup_time.split("T")[0] : "",
      pickup_time: booking.pickup_time ? booking.pickup_time.split("T")[1]?.substring(0, 5) : "",
      pickup_street: "", // Would need to parse from pickup_address
      pickup_street_number: "",
      pickup_postal_code: "",
      pickup_city: "",
      dropoff_street: "", // Would need to parse from dropoff_address
      dropoff_street_number: "",
      dropoff_postal_code: "",
      dropoff_city: "",
      passengers: booking.passengers?.toString() || "1",
      luggage: booking.luggage?.toString() || "0",
      vehicle_type: booking.vehicle_type || "Economy Class (1-4 Pax)",
      payment_method: booking.payment_method || "invoice",
      price: booking.price?.toString() || "",
      vat_rate: booking.vat_rate?.toString() || "19",
      special_requests: booking.special_requests || "",
      status: booking.status,
      payment_status: booking.payment_status,
      assignment_type: booking.assignment_type || "automatisch",
      driver_id: booking.driver_id || "",
      vehicle_id: booking.vehicle_id || "",
      cost_center_id: booking.cost_center_id || "",
      is_partner_booking: booking.is_partner_booking || false,
      partner_id: booking.partner_id || "",
      partner_provision_manual: booking.partner_provision_manual?.toString() || "",
      is_airport_pickup: booking.is_airport_pickup || false,
      is_train_station_pickup: booking.is_train_station_pickup || false,
      flight_number: booking.flight_number || "",
      terminal: booking.terminal || "",
      train_number: booking.train_number || "",
      arrival_time: booking.arrival_time || "",
      wait_time: booking.wait_time?.toString() || "0",
      meet_and_greet: booking.meet_and_greet || false,
      name_sign: booking.name_sign || "",
    });
    setIsDialogOpen(true);
    setDetailDialogOpen(false);
  };

  const filteredBookings = bookings
    .filter((booking) => showArchived || !booking.archived)
    .filter((booking) => {
      const matchesSearch =
        booking.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.dropoff_address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPartner =
        filterPartner === "all" ||
        (filterPartner === "own" && !booking.is_partner_booking) ||
        (filterPartner === "partner" && booking.is_partner_booking) ||
        booking.partner_id === filterPartner;

      return matchesSearch && matchesPartner;
    });

  // ⚡ V37.2: Separate Filterung für Angebote
  const filteredOffers = offers
    .filter((offer) => showArchived || !offer.archived)
    .filter((offer) => {
      const matchesSearch =
        offer.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.dropoff_address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPartner =
        filterPartner === "all" ||
        (filterPartner === "own" && !offer.is_partner_booking) ||
        (filterPartner === "partner" && offer.is_partner_booking) ||
        offer.partner_id === filterPartner;

      return matchesSearch && matchesPartner;
    });

  // Aktueller Tab-Daten
  const currentTabData = currentTab === "angebote" ? filteredOffers : filteredBookings;

  const formatDateTime = (date: string) => {
    return format(new Date(date), "dd.MM.yyyy HH:mm");
  };

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return "-";
    const customer = customers.find((c) => c.id === customerId);
    return customer ? `${customer.first_name} ${customer.last_name}` : "-";
  };

  const getDriverName = (driverId?: string) => {
    if (!driverId) return "Nicht zugewiesen";
    const driver = drivers.find((d) => d.id === driverId);
    return driver ? `${driver.first_name} ${driver.last_name}` : "-";
  };

  const getVehiclePlate = (vehicleId?: string) => {
    if (!vehicleId) return "-";
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle?.license_plate || "-";
  };

  const handleAssignToPartner = async () => {
    if (!selectedBookingForPartner || !selectedPartnerId || !profile?.company_id) return;

    try {
      const partner = partners.find((p) => p.id === selectedPartnerId);
      if (!partner) throw new Error("Partner nicht gefunden");

      const provisionAmount = partner.provision_amount || 0;

      const { error } = await supabase
        .from("bookings")
        .update({
          is_partner_booking: true,
          partner_id: selectedPartnerId,
          partner_provision_manual: partner.provision_amount,
          price: Math.max(
            0,
            (selectedBookingForPartner.price || 0) - (partner.provision_amount || 0)
          ),
          updated_at: new Date().toISOString(),
        })
        .eq("company_id", profile.company_id)
        .eq("id", selectedBookingForPartner.id);

      if (error) throw error;

      handleSuccess(
        `Auftrag an ${partner.name} weitergegeben. Provision: ${formatCurrency(provisionAmount)}`
      );

      setIsPartnerDialogOpen(false);
      setSelectedBookingForPartner(null);
      setSelectedPartnerId("");
      // React Query invalidiert automatisch
    } catch (error) {
      handleError(error, "Auftrag konnte nicht an Partner weitergegeben werden");
    }
  };

  // Smart Assignment Handler mit Geocoding
  const handleOpenSmartAssignment = async (booking: Booking) => {
    if (!hasBusinessFeatures) {
      toast({
        title: "Business+ Feature",
        description: "AI-Zuweisung ist nur für Business+ Tarife verfügbar",
        variant: "destructive",
      });
      return;
    }

    // Geocoding via HERE API
    let pickupLocation = { lat: 48.1351, lng: 11.582 }; // Fallback München

    try {
      if (booking.pickup_address) {
        const { data: geocodeData, error: geocodeError } = await supabase.functions.invoke(
          "geocode-address",
          {
            body: { address: booking.pickup_address },
          }
        );

        if (!geocodeError && geocodeData?.lat && geocodeData?.lng) {
          pickupLocation = {
            lat: geocodeData.lat,
            lng: geocodeData.lng,
          };
        }
      }
    } catch (error) {
      // Geocoding error silently falls back to default coordinates
      // Error is already handled by try-catch, no logging needed
    }

    setSmartAssignmentData({
      bookingId: booking.id,
      pickupLocation,
      pickupTime: booking.pickup_time,
      vehicleClass: booking.vehicle_type,
      passengers: booking.passengers || 1,
    });
    setSmartAssignmentOpen(true);
  };

  const handleSmartAssign = async (driverId: string, vehicleId: string) => {
    if (!smartAssignmentData || !profile?.company_id) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          driver_id: driverId,
          vehicle_id: vehicleId,
          assignment_type: "ai",
          updated_at: new Date().toISOString(),
        })
        .eq("company_id", profile.company_id)
        .eq("id", smartAssignmentData.bookingId);

      if (error) throw error;

      handleSuccess("Fahrer erfolgreich per AI zugewiesen");
      // React Query invalidiert automatisch
      setSmartAssignmentOpen(false);
      setSmartAssignmentData(null);
    } catch (error) {
      handleError(error, "Fehler bei der AI-Zuweisung");
      throw error; // Re-throw für Dialog-Handling
    }
  };

  // ⚡ V37.1: useMemo Hooks wurden nach oben verschoben (Zeile 253-300)
  // React Hook Rules: ALLE Hooks MÜSSEN VOR bedingten Returns stehen!

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Lädt...</p>
      </div>
    );
  }

  // Mobile-spezifische Render-Logik
  if (isMobile) {
    return (
      <StandardPageLayout
        title="Aufträge"
        description="MyDispatch Auftrags- und Angebotsverwaltung: Disposition, Status-Tracking und Verwaltung für Taxi- und Mietwagenunternehmen."
        canonical="/auftraege"
        subtitle="Verwaltung Ihrer Aufträge"
        onCreateNew={() => setIsDialogOpen(true)}
        createButtonLabel="Neuer Auftrag"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Aufträge durchsuchen..."
        filterComponents={
          <div className="flex items-center gap-2">
            <Switch
              id="show-archived-bookings-mobile"
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor="show-archived-bookings-mobile" className="text-sm cursor-pointer">
              Archivierte anzeigen
            </Label>
          </div>
        }
      >
        {/* Hero-Bereich - V28.1 Slate Design */}
        <div className="relative w-full h-[200px] sm:h-[250px] lg:h-[300px] mb-6 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-slate-100 to-slate-50">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="mb-4 p-6 rounded-full backdrop-blur-sm bg-white/50">
              <FileText className="h-16 w-16 sm:h-20 sm:w-20 text-slate-900" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-slate-900">
              Aufträge
            </h2>
            <p className="text-sm sm:text-base max-w-2xl text-muted-foreground">
              Effiziente Buchungsverwaltung für Ihr Unternehmen
            </p>
          </div>
        </div>

        {/* ✅ V6.1: StatCards Pattern (Golden Template - Mobile) */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {bookingKPIs.map((kpi, index) => (
            <StatCard
              key={index}
              label={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              change={
                kpi.trend
                  ? {
                      value: kpi.trend.value,
                      trend: kpi.trend.value >= 0 ? "up" : "down",
                    }
                  : undefined
              }
            />
          ))}
        </div>

        {/* V33.0: Export Bar */}
        <UniversalExportBar
          data={filteredBookings}
          filename={`auftraege-${new Date().toISOString().split("T")[0]}`}
          showPdf={true}
          showExcel={true}
          showCsv={true}
        />

        <MobileAuftraege
          bookings={filteredBookings.map((b) => ({
            id: b.id,
            booking_number: b.id.slice(0, 8),
            customer_first_name: b.customer?.first_name,
            customer_last_name: b.customer?.last_name,
            pickup_address: b.pickup_address,
            dropoff_address: b.dropoff_address,
            pickup_datetime: b.pickup_time,
            status: b.status || "pending",
            price: b.price,
          }))}
          isLoading={loading}
          onCreateNew={() => setIsDialogOpen(true)}
          onBookingClick={(booking) => {
            const fullBooking = bookings.find((b) => b.id === booking.id);
            if (fullBooking) {
              setSelectedBooking(fullBooking);
              setDetailDialogOpen(true);
            }
          }}
          onRefresh={async () => {
            // React Query Refresh statt vollständigem Reload
            await fetchCustomers();
            await fetchDrivers();
            await fetchVehicles();
          }}
        />

        {/* ✅ V28.1 FORM MIGRATION: Mobile Dialog with BookingForm Wrapper */}
        <BookingForm
          form={bookingForm}
          onSubmit={handleBookingSubmit}
          mode="dialog"
          portal="entrepreneur"
          customers={customers}
          drivers={drivers}
          vehicles={vehicles}
          partners={partners}
          costCenters={costCenters}
          onCreateCustomer={() => setShowInlineCustomerForm(true)}
          dialogOpen={isDialogOpen}
          onDialogOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              bookingForm.reset();
              setEditingBooking(null);
            }
          }}
          loading={loading}
        />
      </StandardPageLayout>
    );
  }

  // Desktop-Layout bleibt EXAKT wie aktuell

  return (
    <>
      {/* ✅ DESKTOP VIEW */}
      <StandardPageLayout
        title="Aufträge"
        description="MyDispatch Auftragsverwaltung: Disposition, Status-Tracking und Verwaltung für Taxi- und Mietwagenunternehmen."
        canonical="/auftraege"
        subtitle="Verwaltung Ihrer Aufträge"
        onCreateNew={() => setIsDialogOpen(true)}
        createButtonLabel="Auftrag erstellen"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Aufträge durchsuchen..."
        cardTitle="Auftragsübersicht"
        cardIcon={<FileText className="h-5 w-5" />}
        filterComponents={
          <div className="flex items-center gap-2">
            <Switch
              id="show-archived-bookings"
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor="show-archived-bookings" className="text-sm cursor-pointer">
              Archivierte anzeigen
            </Label>
          </div>
        }
        footerContent={
          <div className="p-4 rounded-lg text-xs sm:text-sm bg-muted">
            <p className="font-medium mb-2 text-slate-900">⚖️ PBefG-Hinweis:</p>
            <p className="text-muted-foreground">
              Selbstregistrierte Kunden können aus rechtlichen Gründen nicht bar zahlen. Barzahlung
              ist nur für manuell angelegte Kunden verfügbar.
            </p>
          </div>
        }
      >
        {/* ✅ V6.1: StatCards Pattern (Golden Template - Desktop) */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(currentTab === "angebote" ? offerKPIs : bookingKPIs).map((kpi, index) => (
            <StatCard
              key={index}
              label={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              change={
                kpi.trend
                  ? {
                      value: kpi.trend.value,
                      trend: kpi.trend.value >= 0 ? "up" : "down",
                    }
                  : undefined
              }
            />
          ))}
        </div>

        {/* ⚡ V37.2: Tab-Navigation für Aufträge & Angebote */}
        <Tabs
          value={currentTab}
          onValueChange={(value) => {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("tab", value);
            navigate(`?${newParams.toString()}`, { replace: true });
          }}
          className="w-full mb-6"
        >
          <TabsList className="bg-muted p-1 rounded-lg w-full sm:w-auto">
            <TabsTrigger
              value="auftraege"
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 flex-1 sm:flex-none"
            >
              <FileText className="h-4 w-4 mr-2" />
              Aufträge ({bookings.length})
            </TabsTrigger>
            <TabsTrigger
              value="angebote"
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900 flex-1 sm:flex-none"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Angebote ({offers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auftraege" className="mt-6">
            {profile?.company_id && (
              <div className="mb-4">
                <PartnerFilter
                  currentCompanyId={profile.company_id}
                  value={filterPartner !== "all" ? filterPartner : undefined}
                  onValueChange={(partnerId, provisionRate) => {
                    setFilterPartner(partnerId || "all");
                  }}
                />
              </div>
            )}

            {filteredBookings.length === 0 ? (
              <EmptyState
                icon={<FileText className="w-full h-full" />}
                title={
                  searchTerm || filterPartner !== "all"
                    ? "Keine Aufträge gefunden"
                    : "Noch keine Aufträge"
                }
                description={
                  searchTerm || filterPartner !== "all"
                    ? "Versuchen Sie einen anderen Suchbegriff oder Filter"
                    : "Erstellen Sie Ihren ersten Auftrag, um mit der Verwaltung zu beginnen"
                }
                actionLabel={
                  searchTerm || filterPartner !== "all" ? undefined : "Auftrag erstellen"
                }
                onAction={
                  searchTerm || filterPartner !== "all" ? undefined : () => setIsDialogOpen(true)
                }
                isSearchResult={searchTerm.length > 0 || filterPartner !== "all"}
              />
            ) : (
              <>
                <BookingsTable
                  bookings={filteredBookings}
                  onViewDetails={(booking) => {
                    setSelectedBooking(booking);
                    setDetailDialogOpen(true);
                  }}
                  onAssignToPartner={(booking) => {
                    setSelectedBookingForPartner(booking);
                    setIsPartnerDialogOpen(true);
                  }}
                  onSmartAssignment={handleOpenSmartAssignment}
                  showPartnerButton={partners.length > 0}
                  showSmartAssignmentButton={hasBusinessFeatures}
                  selectedIds={bulkSelection.selectedIds}
                  onToggleSelection={bulkSelection.toggleSelection}
                  onToggleSelectAll={() => bulkSelection.toggleSelectAll(filteredBookings)}
                  showBulkSelect={true}
                />
                <BulkActionBar
                  selectedCount={bulkSelection.selectedCount}
                  onClearSelection={bulkSelection.clearSelection}
                  actions={[
                    { label: "Status ändern", icon: RefreshCw, onClick: handleBulkStatusChange },
                    { label: "PDF exportieren", icon: Download, onClick: handleBulkPDFExport },
                    { label: "E-Mail senden", icon: Mail, onClick: handleBulkEmail },
                    {
                      label: "Archivieren",
                      icon: ArchiveIcon,
                      onClick: handleBulkArchive,
                      variant: "destructive",
                    },
                  ]}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="angebote" className="mt-6">
            {profile?.company_id && (
              <div className="mb-4">
                <PartnerFilter
                  currentCompanyId={profile.company_id}
                  value={filterPartner !== "all" ? filterPartner : undefined}
                  onValueChange={(partnerId, provisionRate) => {
                    setFilterPartner(partnerId || "all");
                  }}
                />
              </div>
            )}

            {filteredOffers.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="w-full h-full" />}
                title={
                  searchTerm || filterPartner !== "all"
                    ? "Keine Angebote gefunden"
                    : "Noch keine Angebote"
                }
                description={
                  searchTerm || filterPartner !== "all"
                    ? "Versuchen Sie einen anderen Suchbegriff oder Filter"
                    : "Erstellen Sie Ihr erstes Angebot, um zu beginnen"
                }
                actionLabel={
                  searchTerm || filterPartner !== "all" ? undefined : "Angebot erstellen"
                }
                onAction={
                  searchTerm || filterPartner !== "all" ? undefined : () => setIsDialogOpen(true)
                }
                isSearchResult={searchTerm.length > 0 || filterPartner !== "all"}
              />
            ) : (
              <>
                <BookingsTable
                  bookings={filteredOffers}
                  onViewDetails={(booking) => {
                    setSelectedBooking(booking);
                    setDetailDialogOpen(true);
                  }}
                  onAssignToPartner={(booking) => {
                    setSelectedBookingForPartner(booking);
                    setIsPartnerDialogOpen(true);
                  }}
                  onSmartAssignment={handleOpenSmartAssignment}
                  showPartnerButton={partners.length > 0}
                  showSmartAssignmentButton={hasBusinessFeatures}
                  selectedIds={bulkSelection.selectedIds}
                  onToggleSelection={bulkSelection.toggleSelection}
                  onToggleSelectAll={() => bulkSelection.toggleSelectAll(filteredOffers)}
                  showBulkSelect={true}
                />
                <BulkActionBar
                  selectedCount={bulkSelection.selectedCount}
                  onClearSelection={bulkSelection.clearSelection}
                  actions={[
                    { label: "Status ändern", icon: RefreshCw, onClick: handleBulkStatusChange },
                    { label: "PDF exportieren", icon: Download, onClick: handleBulkPDFExport },
                    { label: "E-Mail senden", icon: Mail, onClick: handleBulkEmail },
                    {
                      label: "Archivieren",
                      icon: ArchiveIcon,
                      onClick: handleBulkArchive,
                      variant: "destructive",
                    },
                  ]}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </StandardPageLayout>

      {/* ✅ V28.1 FORM MIGRATION: Desktop Dialog with BookingForm Wrapper */}
      <BookingForm
        form={bookingForm}
        onSubmit={handleBookingSubmit}
        mode="dialog"
        portal="entrepreneur"
        customers={customers}
        drivers={drivers}
        vehicles={vehicles}
        partners={partners}
        costCenters={costCenters}
        onCreateCustomer={() => setShowInlineCustomerForm(true)}
        dialogOpen={isDialogOpen}
        onDialogOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            bookingForm.reset();
            setEditingBooking(null);
          }
        }}
        loading={loading}
      />

      {/* Partner-Zuweisungs-Dialog */}
      <Dialog open={isPartnerDialogOpen} onOpenChange={setIsPartnerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Auftrag an Partner weitergeben</DialogTitle>
            <DialogDescription>
              Wählen Sie einen Partner aus. Die Provision wird automatisch vom Preis abgezogen.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedBookingForPartner && (
              <div className="p-4 rounded-lg space-y-2 text-sm bg-muted">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Originalpreis:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedBookingForPartner.price
                      ? formatCurrency(selectedBookingForPartner.price)
                      : "-"}
                  </span>
                </div>
                {selectedPartnerId && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provision:</span>
                      <span className="text-destructive font-semibold">
                        -{" "}
                        {formatCurrency(
                          partners.find((p) => p.id === selectedPartnerId)?.provision_amount || 0
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-semibold text-slate-900">Neuer Preis:</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(
                          (selectedBookingForPartner.price || 0) -
                            (partners.find((p) => p.id === selectedPartnerId)?.provision_amount ||
                              0)
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="partner_select">Partner auswählen *</Label>
              <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Partner wählen" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name} (Provision: {formatCurrency(partner.provision_amount || 0)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <V28Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsPartnerDialogOpen(false);
                  setSelectedBookingForPartner(null);
                  setSelectedPartnerId("");
                }}
                className="flex-1"
              >
                Abbrechen
              </V28Button>
              <V28Button
                onClick={handleAssignToPartner}
                disabled={!selectedPartnerId}
                className="flex-1"
                variant="primary"
              >
                <Handshake className="mr-2 h-4 w-4" />
                Weitergeben
              </V28Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DetailDialog für Auftrags-Details */}
      {selectedBooking && (
        <DetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          title="Auftrags-Details"
          editForm={
            <p className="text-sm text-muted-foreground">Bearbeitung über Hauptformular möglich</p>
          }
          onArchive={async () => {
            await handleDelete(selectedBooking.id);
          }}
          createdAt={selectedBooking.created_at}
        >
          <div className="space-y-6">
            {/* Hauptinformationen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Auftragsnummer</p>
                <p className="font-semibold">
                  AU-{selectedBooking.id.substring(0, 8).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Abholzeit</p>
                <p className="font-semibold">{formatDateTime(selectedBooking.pickup_time)}</p>
              </div>
            </div>

            {/* Route */}
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Abholort</p>
                <p className="font-medium">{selectedBooking.pickup_address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Zielort</p>
                <p className="font-medium">{selectedBooking.dropoff_address}</p>
              </div>
            </div>

            {/* Kunde & Zuordnung */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Kunde</p>
                <p className="font-medium">{getCustomerName(selectedBooking.customer_id)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fahrer</p>
                <p className="font-medium">{getDriverName(selectedBooking.driver_id)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fahrzeug</p>
                <p className="font-medium">{getVehiclePlate(selectedBooking.vehicle_id)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fahrzeugklasse</p>
                <p className="font-medium">
                  {selectedBooking.vehicle_type || "Economy Class (1-4 Pax)"}
                </p>
              </div>
            </div>

            {/* Passagiere & Gepäck */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Passagiere</p>
                <p className="font-medium">{selectedBooking.passengers || 1}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gepäckstücke</p>
                <p className="font-medium">{selectedBooking.luggage || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preis</p>
                <p className="font-bold text-lg">
                  {selectedBooking.price ? formatCurrency(selectedBooking.price) : "-"}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusIndicator
                  type={getBookingStatusType(selectedBooking.status)}
                  label={selectedBooking.status}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Zahlungsstatus</p>
                <StatusIndicator
                  type={getPaymentStatusType(selectedBooking.payment_status)}
                  label={selectedBooking.payment_status}
                />
              </div>
            </div>

            {/* Flughafen-Abholung */}
            {selectedBooking.is_airport_pickup && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Flughafen-Abholung</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Flugnummer</p>
                    <p className="font-medium">{selectedBooking.flight_number || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Terminal</p>
                    <p className="font-medium">{selectedBooking.terminal || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ankunftszeit</p>
                    <p className="font-medium">
                      {selectedBooking.arrival_time
                        ? format(new Date(`2000-01-01T${selectedBooking.arrival_time}`), "HH:mm")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Wartezeit</p>
                    <p className="font-medium">{selectedBooking.wait_time || 0} Min</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meet & Greet</p>
                    <p className="font-medium">{selectedBooking.meet_and_greet ? "Ja" : "Nein"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Namensschild</p>
                    <p className="font-medium">{selectedBooking.name_sign || "-"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bahnhof-Abholung */}
            {selectedBooking.is_train_station_pickup && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Bahnhof-Abholung</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Zugnummer</p>
                    <p className="font-medium">{selectedBooking.train_number || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ankunftszeit</p>
                    <p className="font-medium">
                      {selectedBooking.arrival_time
                        ? format(new Date(`2000-01-01T${selectedBooking.arrival_time}`), "HH:mm")
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Besondere Wünsche */}
            {selectedBooking.special_requests && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-1">Besondere Wünsche</p>
                <p className="font-medium">{selectedBooking.special_requests}</p>
              </div>
            )}

            {/* V18.3: Verknüpfte Daten - Related Entities */}
            <div className="space-y-3 mt-6 pt-6 border-t">
              <h4 className="text-sm font-semibold text-muted-foreground">Verknüpfte Daten</h4>

              {/* Kunde */}
              {selectedBooking.customer_id &&
                customers.find((c) => c.id === selectedBooking.customer_id) &&
                (() => {
                  const customer = customers.find((c) => c.id === selectedBooking.customer_id);
                  if (!customer) return null;

                  return (
                    <RelatedEntityCard
                      type="customer"
                      label="Kunde"
                      value={`${customer.first_name} ${customer.last_name}`}
                      meta={customer.is_manually_created ? "Manuell angelegt" : "Selbstregistriert"}
                      onClick={() => navigate(`/kunden?id=${customer.id}`)}
                      actions={
                        [
                          customer.phone && getStandardActions.phone(customer.phone),
                          customer.email && getStandardActions.email(customer.email),
                        ].filter(Boolean) as any
                      }
                    />
                  );
                })()}

              {/* Fahrer */}
              {selectedBooking.driver_id &&
                drivers.find((d) => d.id === selectedBooking.driver_id) &&
                (() => {
                  const driver = drivers.find((d) => d.id === selectedBooking.driver_id);
                  if (!driver) return null;

                  return (
                    <RelatedEntityCard
                      type="driver"
                      label="Fahrer"
                      value={`${driver.first_name} ${driver.last_name}`}
                      meta={`Führerschein: ${driver.license_number || "Nicht hinterlegt"}`}
                      status={
                        driver.shift_status === "available"
                          ? "success"
                          : driver.shift_status === "on_duty"
                            ? "warning"
                            : "neutral"
                      }
                      statusLabel={
                        driver.shift_status === "available"
                          ? "Verfügbar"
                          : driver.shift_status === "on_duty"
                            ? "Im Dienst"
                            : "Offline"
                      }
                      onClick={() => navigate(`/fahrer?id=${driver.id}`)}
                      actions={
                        [driver.phone && getStandardActions.phone(driver.phone)].filter(
                          Boolean
                        ) as any
                      }
                    />
                  );
                })()}

              {/* Fahrzeug */}
              {selectedBooking.vehicle_id &&
                vehicles.find((v) => v.id === selectedBooking.vehicle_id) &&
                (() => {
                  const vehicle = vehicles.find((v) => v.id === selectedBooking.vehicle_id);
                  if (!vehicle) return null;

                  return (
                    <RelatedEntityCard
                      type="vehicle"
                      label="Fahrzeug"
                      value={vehicle.license_plate}
                      meta={`${vehicle.vehicle_class}`}
                      status={
                        vehicle.status === "available"
                          ? "success"
                          : vehicle.status === "im_einsatz"
                            ? "warning"
                            : "neutral"
                      }
                      statusLabel={
                        vehicle.status === "available"
                          ? "Verfügbar"
                          : vehicle.status === "im_einsatz"
                            ? "Im Einsatz"
                            : vehicle.status
                      }
                      onClick={() => navigate(`/fahrer?tab=fahrzeuge&id=${vehicle.id}`)}
                    />
                  );
                })()}

              {/* Partner */}
              {selectedBooking.is_partner_booking &&
                selectedBooking.partner_id &&
                partners.find((p) => p.id === selectedBooking.partner_id) &&
                (() => {
                  const partner = partners.find((p) => p.id === selectedBooking.partner_id);
                  if (!partner) return null;

                  const provision =
                    selectedBooking.partner_provision_manual || partner.provision_amount || 0;

                  return (
                    <RelatedEntityCard
                      type="partner"
                      label="Partner"
                      value={partner.name}
                      meta={`Provision: ${formatCurrency(provision)}`}
                      onClick={() => navigate(`/partner?id=${partner.id}`)}
                      actions={
                        [
                          partner.phone && getStandardActions.phone(partner.phone),
                          partner.email && getStandardActions.email(partner.email),
                        ].filter(Boolean) as any
                      }
                    />
                  );
                })()}
            </div>

            {/* Bearbeiten-Button */}
            <div className="border-t pt-4 mt-4">
              <V28Button
                onClick={() => {
                  setDetailDialogOpen(false);
                  handleEdit(selectedBooking);
                }}
                className="w-full"
                variant="primary"
              >
                <Edit className="mr-2 h-4 w-4" />
                Auftrag bearbeiten
              </V28Button>
            </div>
          </div>
        </DetailDialog>
      )}

      {/* Smart Assignment Dialog (Business+) */}
      {smartAssignmentData && (
        <SmartAssignmentDialog
          open={smartAssignmentOpen}
          onOpenChange={setSmartAssignmentOpen}
          bookingId={smartAssignmentData.bookingId}
          pickupLocation={smartAssignmentData.pickupLocation}
          pickupTime={smartAssignmentData.pickupTime}
          vehicleClass={smartAssignmentData.vehicleClass}
          passengers={smartAssignmentData.passengers}
          companyId={profile?.company_id || ""}
          onAssign={handleSmartAssign}
        />
      )}
    </>
  );
}
