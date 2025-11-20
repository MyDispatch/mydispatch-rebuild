/**
 * DRIVER DETAIL PAGE V1.0 (KRONOS Wave 5 - Batch 5B)
 *
 * Assembliert aus:
 * - StandardDetailPage Template
 * - useDriver API Hook
 */

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, Award } from "lucide-react";
import { useDrivers } from "@/hooks/use-drivers";
import { V28Button } from "@/components/design-system/V28Button";
import { V28Card } from "@/components/design-system/V28Card";
import { V28Badge } from "@/components/design-system/V28Badge";
import { formatDate } from "@/lib/data-transformers";

export function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { drivers, isLoading } = useDrivers();
  const driver = drivers?.find((d) => d.id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Fahrer nicht gefunden</h2>
          <V28Button onClick={() => navigate("/drivers")} className="mt-4">
            Zurück zur Übersicht
          </V28Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <V28Button variant="ghost" icon={ArrowLeft} onClick={() => navigate("/drivers")}>
            Zurück
          </V28Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {driver.first_name} {driver.last_name}
            </h1>
            <p className="text-slate-600">Fahrer-ID: {String(driver.id).slice(0, 8)}</p>
          </div>
        </div>
        <V28Badge variant="primary">{driver.shift_status}</V28Badge>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kontaktinformationen */}
        <V28Card title="Kontaktinformationen" variant="elevated">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">E-Mail</p>
                <p className="font-medium text-slate-900">{driver.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">Telefon</p>
                <p className="font-medium text-slate-900">{driver.phone || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">Adresse</p>
                <p className="font-medium text-slate-900">
                  {driver.street} {driver.street_number || ""}
                  <br />
                  {driver.postal_code} {driver.city}
                </p>
              </div>
            </div>
          </div>
        </V28Card>

        {/* Führerschein & Qualifikationen */}
        <V28Card title="Führerschein & Qualifikationen" variant="elevated">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">Führerscheinnummer</p>
                <p className="font-medium text-slate-900">-</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">Führerschein gültig bis</p>
                <p className="font-medium text-slate-900">
                  {driver.license_expiry_date ? formatDate(driver.license_expiry_date) : "-"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">P-Schein vorhanden</p>
                <p className="font-medium text-slate-900">-</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">P-Schein gültig bis</p>
                <p className="font-medium text-slate-900">-</p>
              </div>
            </div>
          </div>
        </V28Card>
      </div>
    </div>
  );
}
