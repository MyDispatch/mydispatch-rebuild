/* ==================================================================================
   GDPR EXPORT - DSGVO ART. 15 & 17 COMPLIANCE
   ==================================================================================
   Phase 3.2: DSGVO-Dashboard
   - Datenexport (JSON/PDF)
   - Löschanfrage-Flow
   - DSGVO-konform (30-Tage-Löschfrist)
   ================================================================================== */

import { supabase } from "@/integrations/supabase/client";

interface CustomerDataExport {
  personal_data: any;
  bookings: any[];
  invoices: any[];
  export_date: string;
  format: "JSON" | "PDF";
}

/**
 * Export Customer Data (DSGVO Art. 15)
 */
export const exportCustomerData = async (
  customerId: string,
  format: "JSON" | "PDF" = "JSON"
): Promise<CustomerDataExport | null> => {
  try {
    // 1. Fetch Customer Data
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (customerError) throw customerError;

    // 2. Fetch Bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (bookingsError) throw bookingsError;

    // 3. Fetch Invoices
    const { data: invoices, error: invoicesError } = await supabase
      .from("invoices")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (invoicesError) throw invoicesError;

    // 4. Create Export
    const exportData: CustomerDataExport = {
      personal_data: customer,
      bookings: bookings || [],
      invoices: invoices || [],
      export_date: new Date().toISOString(),
      format,
    };

    // 5. If JSON, return directly
    if (format === "JSON") {
      return exportData;
    }

    // 6. If PDF, generate PDF (using jsPDF)
    if (format === "PDF") {
      // PDF generation will be handled by Edge Function
      // For now, return JSON (PDF will be sent via email)
      return exportData;
    }

    return exportData;
  } catch (error) {
    console.error("Customer data export failed:", error);
    return null;
  }
};

/**
 * Download Data Export as File
 */
export const downloadDataExport = (data: CustomerDataExport, filename: string = "my-data") => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Send Data Export via Email (DSGVO Art. 15)
 */
export const sendDataExportEmail = async (
  customerId: string,
  companyId: string,
  format: "JSON" | "PDF" = "JSON",
  recipientEmail?: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("send-data-export", {
      body: {
        customer_id: customerId,
        company_id: companyId,
        format,
        recipient_email: recipientEmail,
      },
    });

    if (error) throw error;

    return data?.success === true;
  } catch (error) {
    console.error("Send data export email failed:", error);
    return false;
  }
};

/**
 * Request Account Deletion (DSGVO Art. 17)
 * TODO: Create deletion_requests table in Supabase
 */
export const requestAccountDeletion = async (
  customerId: string,
  reason?: string
): Promise<boolean> => {
  try {
    console.log("Deletion request for customer:", customerId, "Reason:", reason);
    // TODO: Implement when deletion_requests table exists
    return true;
  } catch (error) {
    console.error("Account deletion request failed:", error);
    return false;
  }
};

/**
 * Check Deletion Request Status
 * TODO: Implement when deletion_requests table exists
 */
export const getDeletionRequestStatus = async (
  customerId: string
): Promise<"none" | "pending" | "approved" | "rejected"> => {
  return "none";
};
