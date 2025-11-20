/* ==================================================================================
   BOOKING PDF - Auftrag als PDF erstellen und versenden
   ==================================================================================
   Erstellt: 2025-01-31
   Zweck: Aufträge als PDF erstellen und per E-Mail versenden
   Autor: NeXify AI MASTER
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/format-utils';

/**
 * Generate Booking PDF and Send via Email
 */
export const sendBookingPDF = async (
  bookingId: string,
  companyId: string,
  recipientEmail?: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-booking-pdf', {
      body: {
        booking_id: bookingId,
        company_id: companyId,
        recipient_email: recipientEmail,
      },
    });

    if (error) throw error;

    return data?.success === true;
  } catch (error) {
    console.error('Send booking PDF failed:', error);
    return false;
  }
};

/**
 * Generate Booking PDF HTML (for client-side generation)
 */
export const generateBookingPDFHTML = (booking: any): string => {
  const bookingNumber = booking.booking_number || booking.id.slice(0, 8);
  const pickupDate = booking.pickup_time ? formatDate(booking.pickup_time) : 'N/A';
  const pickupTime = booking.pickup_time ? formatDateTime(booking.pickup_time).split(' ')[1] || 'N/A' : 'N/A';

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 25mm; }
    body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #323D5E; }
    .header { display: flex; justify-content: space-between; padding-bottom: 10mm; border-bottom: 2px solid #EADEBD; margin-bottom: 10mm; }
    .header h1 { font-size: 32pt; font-weight: bold; color: #323D5E; margin: 0; }
    .header h2 { font-size: 24pt; font-weight: bold; color: #323D5E; margin: 0; }
    .address-block { margin-bottom: 20mm; }
    .content { margin-bottom: 15mm; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #EADEBD; padding: 8px; text-align: left; font-weight: bold; }
    td { padding: 8px; border-bottom: 1px solid #E5E7EB; }
    .footer { margin-top: 20mm; padding-top: 5mm; border-top: 1px solid #E5E7EB; font-size: 8pt; color: #6B7280; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>MyDispatch</h1>
      <p>Professionelle Dispositionssoftware</p>
    </div>
    <div style="text-align: right;">
      <h2>AUFTRAG</h2>
      <p><strong>Auftragsnummer:</strong> ${bookingNumber}</p>
      <p><strong>Datum:</strong> ${pickupDate}</p>
    </div>
  </div>
  
  <div class="address-block">
    <div style="font-size: 11pt; line-height: 1.5;">
      <strong>${booking.customer?.first_name || ''} ${booking.customer?.last_name || ''}</strong><br>
      ${booking.customer?.address || ''}<br>
      ${booking.customer?.postal_code || ''} ${booking.customer?.city || ''}
    </div>
  </div>
  
  <div class="content">
    <h3 style="font-size: 14pt; font-weight: bold; margin-bottom: 15mm;">Auftragsdetails</h3>
    <table>
      <tr>
        <th style="width: 30%;">Abholort</th>
        <td>${booking.pickup_address || "N/A"}</td>
      </tr>
      <tr>
        <th>Zielort</th>
        <td>${booking.dropoff_address || "N/A"}</td>
      </tr>
      <tr>
        <th>Datum & Uhrzeit</th>
        <td>${pickupDate} um ${pickupTime}</td>
      </tr>
      ${booking.price ? `
      <tr>
        <th>Preis</th>
        <td>${formatCurrency(booking.price)}</td>
      </tr>
      ` : ''}
      ${booking.passengers ? `
      <tr>
        <th>Passagiere</th>
        <td>${booking.passengers}</td>
      </tr>
      ` : ''}
      ${booking.vehicle_type ? `
      <tr>
        <th>Fahrzeugtyp</th>
        <td>${booking.vehicle_type}</td>
      </tr>
      ` : ''}
      ${booking.status ? `
      <tr>
        <th>Status</th>
        <td>${booking.status}</td>
      </tr>
      ` : ''}
    </table>
  </div>
  
  ${booking.notes ? `
  <div class="content">
    <h3 style="font-size: 14pt; font-weight: bold; margin-bottom: 10mm;">Bemerkungen</h3>
    <p style="font-size: 10pt; line-height: 1.6;">${booking.notes}</p>
  </div>
  ` : ''}
  
  <div class="footer">
    <p><strong>MyDispatch</strong> - Professionelle Dispositionssoftware</p>
    <p>© ${new Date().getFullYear()} MyDispatch. Alle Rechte vorbehalten.</p>
  </div>
</body>
</html>
  `.trim();
};

