/* ==================================================================================
   BOOKINGS TABLE - V18.3 MOBILE-FIRST Component
   ==================================================================================
   Vollständig responsive: Cards auf Mobile, Table auf Desktop
   Performance-optimiert mit React.memo() für große Datenlisten
   V18.3: Bulk-Selection Support + Mobile Card Layout
   ================================================================================== */

import { memo, useMemo } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Eye, Handshake, Sparkles, Calendar, MapPin, User, Car, Euro } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  StatusIndicator,
  getBookingStatusType,
  getPaymentStatusType,
} from "@/components/shared/StatusIndicator";
import { useIsMobile } from "@/hooks/use-mobile";

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
  is_partner_booking?: boolean;
}

interface BookingsTableProps {
  bookings: Booking[];
  onViewDetails: (booking: Booking) => void;
  onAssignToPartner?: (booking: Booking) => void;
  onSmartAssignment?: (booking: Booking) => void;
  showPartnerButton?: boolean;
  showSmartAssignmentButton?: boolean;
  // V18.3: Bulk-Selection Props
  selectedIds?: string[];
  onToggleSelection?: (id: string) => void;
  onToggleSelectAll?: () => void;
  showBulkSelect?: boolean;
}

/**
 * Memoized Bookings Table Component - MOBILE FIRST
 * Mobile: Card-Layout mit allen Details
 * Desktop: Kompakte Tabelle
 * V18.3: Bulk-Selection Support
 */
export const BookingsTable = memo(
  ({
    bookings,
    onViewDetails,
    onAssignToPartner,
    onSmartAssignment,
    showPartnerButton = false,
    showSmartAssignmentButton = false,
    selectedIds = [],
    onToggleSelection,
    onToggleSelectAll,
    showBulkSelect = false,
  }: BookingsTableProps) => {
    const isMobile = useIsMobile();

    // Memoize formatierte Daten
    const formattedBookings = useMemo(() => {
      return bookings.map((booking) => ({
        ...booking,
        formattedPickupTime: format(new Date(booking.pickup_time), "dd.MM.yyyy HH:mm", {
          locale: de,
        }),
        formattedPrice: new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(booking.price || 0),
      }));
    }, [bookings]);

    // Check if all items are selected
    const isAllSelected = bookings.length > 0 && bookings.every((b) => selectedIds.includes(b.id));
    const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

    if (bookings.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">Keine Aufträge gefunden.</div>;
    }

    // MOBILE CARD LAYOUT
    if (isMobile) {
      return (
        <div className="space-y-3">
          {/* Bulk-Select Header auf Mobile */}
          {showBulkSelect && onToggleSelectAll && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg sticky top-0 z-10">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onToggleSelectAll}
                className={
                  isSomeSelected && !isAllSelected ? "data-[state=checked]:bg-primary" : ""
                }
                aria-label="Alle auswählen"
              />
              <span className="text-sm font-medium">
                {isAllSelected ? "Alle abwählen" : "Alle auswählen"}
              </span>
              {selectedIds.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {selectedIds.length} ausgewählt
                </Badge>
              )}
            </div>
          )}

          {/* Card-Liste */}
          {formattedBookings.map((booking) => {
            const isSelected = selectedIds.includes(booking.id);

            return (
              <Card
                key={booking.id}
                className={`overflow-hidden transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {showBulkSelect && onToggleSelection && (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => onToggleSelection(booking.id)}
                          aria-label={`Auftrag ${booking.id} auswählen`}
                        />
                      )}
                      <CardTitle className="text-base font-semibold truncate">
                        {booking.formattedPickupTime}
                      </CardTitle>
                    </div>
                    <StatusIndicator
                      type={getBookingStatusType(booking.status)}
                      label={booking.status}
                      className="shrink-0"
                    />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {/* Adressen */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-foreground shrink-0" />
                      <span className="break-words">{booking.pickup_address}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-foreground shrink-0" />
                      <span className="break-words">{booking.dropoff_address}</span>
                    </div>
                  </div>

                  {/* Preis & Zahlung */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-lg">{booking.formattedPrice}</span>
                    </div>
                    <StatusIndicator
                      type={getPaymentStatusType(booking.payment_status)}
                      label={booking.payment_status}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <V28Button
                      size="sm"
                      variant="primary"
                      onClick={() => onViewDetails(booking)}
                      className="flex-1 min-w-[120px]"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </V28Button>
                    {showSmartAssignmentButton && !booking.driver_id && onSmartAssignment && (
                      <V28Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onSmartAssignment(booking)}
                        className="flex-1 min-w-[120px]"
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        KI-Zuweisung
                      </V28Button>
                    )}
                    {showPartnerButton && !booking.is_partner_booking && onAssignToPartner && (
                      <V28Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onAssignToPartner(booking)}
                      >
                        <Handshake className="h-4 w-4" />
                      </V28Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    }

    // DESKTOP TABLE LAYOUT
    return (
      <div className="overflow-x-auto scrollbar-hide rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {showBulkSelect && onToggleSelectAll && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={onToggleSelectAll}
                    className={
                      isSomeSelected && !isAllSelected ? "data-[state=checked]:bg-primary" : ""
                    }
                    aria-label="Alle auswählen"
                  />
                </TableHead>
              )}
              <TableHead className="w-[140px]">Abholzeit</TableHead>
              <TableHead>Abholort</TableHead>
              <TableHead>Zielort</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Zahlung</TableHead>
              <TableHead className="w-[100px] text-right">Preis</TableHead>
              <TableHead className="w-[120px] text-center">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formattedBookings.map((booking) => {
              const isSelected = selectedIds.includes(booking.id);

              return (
                <TableRow key={booking.id} className="hover:bg-muted/50" data-selected={isSelected}>
                  {showBulkSelect && onToggleSelection && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelection(booking.id)}
                        aria-label={`Auftrag ${booking.id} auswählen`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{booking.formattedPickupTime}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{booking.pickup_address}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {booking.dropoff_address}
                  </TableCell>
                  <TableCell>
                    <StatusIndicator
                      type={getBookingStatusType(booking.status)}
                      label={booking.status}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusIndicator
                      type={getPaymentStatusType(booking.payment_status)}
                      label={booking.payment_status}
                    />
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {booking.formattedPrice}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <V28Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewDetails(booking)}
                        className="h-8 w-8 p-0"
                        aria-label="Details anzeigen"
                      >
                        <Eye className="h-4 w-4" />
                      </V28Button>
                      {showSmartAssignmentButton && !booking.driver_id && onSmartAssignment && (
                        <V28Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onSmartAssignment(booking)}
                          className="h-8 w-8 p-0"
                          aria-label="AI-Zuweisung (Business+)"
                        >
                          <Sparkles className="h-4 w-4 text-foreground" />
                        </V28Button>
                      )}
                      {showPartnerButton && !booking.is_partner_booking && onAssignToPartner && (
                        <V28Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onAssignToPartner(booking)}
                          className="h-8 w-8 p-0"
                          aria-label="An Partner weitergeben"
                        >
                          <Handshake className="h-4 w-4 text-foreground" />
                        </V28Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: Nur re-rendern wenn sich Bookings-Array ändert
    return prevProps.bookings === nextProps.bookings;
  }
);

BookingsTable.displayName = "BookingsTable";
