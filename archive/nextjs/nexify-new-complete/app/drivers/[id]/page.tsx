import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDate, formatPhone } from "@/lib/formatters";

interface DriverRow {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  license_expiry_date?: string;
  shift_status?: string;
}

export default async function DriverDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("drivers")
    .select(
      "id, first_name, last_name, email, phone, license_expiry_date, shift_status"
    )
    .eq("id", params.id)
    .maybeSingle();

  const driver = (data || null) as DriverRow | null;

  return (
    <div className="mx-auto w-full max-w-screen-md px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fahrer-Details</h1>
        <Link href="/drivers" className="text-sm text-muted-foreground hover:underline">
          Zurück zur Liste
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {driver ? `${driver.first_name} ${driver.last_name}` : "Unbekannter Fahrer"}
          </CardTitle>
          <CardDescription>
            {driver?.shift_status === "available" ? "Verfügbar" : "Nicht verfügbar"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">E-Mail</div>
              <div className="text-sm">{driver?.email || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Telefon</div>
              <div className="text-sm">{formatPhone(driver?.phone)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Führerschein gültig bis</div>
              <div className="text-sm">{formatDate(driver?.license_expiry_date)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="text-sm">{driver?.shift_status || "-"}</div>
            </div>
          </div>
          {error && (
            <div className="mt-4 text-sm text-red-600">Fehler beim Laden: {error.message}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

