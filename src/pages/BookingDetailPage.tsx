/**
 * BOOKING DETAIL PAGE V1.0 (KRONOS Wave 5 - Batch 5B)
 * 
 * Assembliert aus:
 * - StandardDetailPage Template
 * - useBooking API Hook
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign, User, Car, FileText } from 'lucide-react';
import { useBooking } from '@/lib/api/bookings-hooks';
import { V28Button } from '@/components/design-system/V28Button';
import { V28Card } from '@/components/design-system/V28Card';
import { V28Badge } from '@/components/design-system/V28Badge';
import { formatDate, formatCurrency } from '@/lib/data-transformers';

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: booking, isLoading } = useBooking(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Auftrag nicht gefunden</h2>
          <V28Button onClick={() => navigate('/bookings')} className="mt-4">
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
          <V28Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/bookings')}
          >
            Zurück
          </V28Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Auftrag #{String(booking.id).slice(0, 8)}
            </h1>
            <p className="text-slate-600">
              Erstellt am {formatDate(booking.created_at)}
            </p>
          </div>
        </div>
        <V28Badge variant="primary">
          {booking.status}
        </V28Badge>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auftragsdetails */}
        <V28Card title="Auftragsdetails" variant="elevated">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">Abholort</p>
                <p className="font-medium text-slate-900">{booking.pickup_address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">Zielort</p>
                <p className="font-medium text-slate-900">{booking.dropoff_address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">Abholzeit</p>
                <p className="font-medium text-slate-900">
                  {formatDate(booking.pickup_time)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">Preis</p>
                <p className="font-medium text-slate-900">
                  {formatCurrency(booking.price)}
                </p>
              </div>
            </div>
          </div>
        </V28Card>

        {/* Weitere Informationen */}
        <V28Card title="Weitere Informationen" variant="elevated">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">Anzahl Passagiere</p>
                <p className="font-medium text-slate-900">-</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Car className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">Fahrzeug-Typ</p>
                <p className="font-medium text-slate-900">
                  {booking.vehicle_type || '-'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-slate-600 mt-0.5" />
              <div>
                <p className="text-sm text-slate-600">Notizen</p>
                <p className="font-medium text-slate-900">Keine Notizen</p>
              </div>
            </div>
          </div>
        </V28Card>
      </div>
    </div>
  );
}
