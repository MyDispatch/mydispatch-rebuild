/* ==================================================================================
   FLEET & DRIVER ADD-ON DETAIL PAGE V18.3.25
   ==================================================================================
   Purpose: Detail-Seite für Fleet & Driver Add-On
   Created: 2025-01-30 15:30:00 UTC
   ================================================================================== */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { V28Button } from '@/components/design-system/V28Button';
import { Card } from '@/components/ui/card';
import { Check, ArrowLeft, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { Slider } from '@/components/ui/slider';

export default function FleetDriverAddon() {
  const [additionalUnits, setAdditionalUnits] = useState(5);

  // Load Add-On Data from Supabase
  const { data: addOn, isLoading } = useQuery({
    queryKey: ['add-on', 'fleet_driver_addon'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('add_ons')
        .select('*')
        .eq('add_on_id', 'fleet_driver_addon')
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-slate-600">Lädt...</p>
        </div>
      </div>
    );
  }

  if (!addOn) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-slate-600">Add-On nicht gefunden.</p>
          <Link to="/pricing">
            <V28Button variant="secondary" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zu Preisen
            </V28Button>
          </Link>
        </div>
      </div>
    );
  }

  const features = Array.isArray(addOn.features) ? addOn.features : [];
  const monthlyPrice = addOn.price_monthly || 9;
  const starterBasePrice = 39;
  const totalMonthly = starterBasePrice + monthlyPrice;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Link to="/pricing" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zu allen Tarifen
            </Link>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              {addOn.name}
            </h1>
            
            <p className="text-xl text-slate-600 mb-8">
              {addOn.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <V28Button size="lg" variant="primary">
                  Jetzt upgraden
                </V28Button>
              </Link>
              <Link to="/kontakt">
                <V28Button size="lg" variant="secondary">
                  Beratung anfragen
                </V28Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Preis-Rechner */}
      <V28MarketingSection 
        title="Preisrechner" 
        description="Berechnen Sie Ihre monatlichen Kosten"
      >
        <Card className="max-w-2xl mx-auto p-8 bg-slate-50 border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <V28IconBox icon={Calculator} variant="slate" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Interaktiver Rechner</h3>
              <p className="text-sm text-slate-600">Passen Sie die Anzahl an Ihre Bedürfnisse an</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-700">Starter Basis</span>
              <span className="text-slate-900 font-semibold">{starterBasePrice}€ / Monat</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Zusätzliche Einheiten</span>
                <span className="text-slate-900 font-semibold">{additionalUnits}</span>
              </div>
              <Slider
                value={[additionalUnits]}
                onValueChange={(value) => setAdditionalUnits(value[0])}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-slate-500 text-center">
                1 bis 50 zusätzliche Fahrzeuge oder Fahrer
              </p>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-700">Fleet & Driver Add-On</span>
              <span className="text-slate-900 font-semibold">{monthlyPrice}€ / Monat</span>
            </div>

            <div className="border-t border-slate-300 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-900">Gesamt</span>
                <span className="text-2xl font-bold text-slate-900">{totalMonthly}€ / Monat</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">
                zzgl. MwSt. | Monatlich kündbar
              </p>
            </div>
          </div>
        </Card>
      </V28MarketingSection>

      {/* Was ist enthalten */}
      <V28MarketingSection 
        title="Was ist enthalten?" 
        description="Alle Features im Überblick"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature: any, index: number) => (
            <V28MarketingCard key={index} className="bg-white border-slate-200">
              <div className="flex items-start gap-3">
                <V28IconBox icon={Check} variant="slate" />
                <p className="text-sm text-slate-700">{feature}</p>
              </div>
            </V28MarketingCard>
          ))}
        </div>
      </V28MarketingSection>

      {/* Für wen geeignet */}
      <V28MarketingSection 
        title="Für wen ist das Add-On geeignet?" 
        description="Die perfekte Lösung für wachsende Unternehmen"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <V28MarketingCard className="bg-slate-50 border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Starter-Kunden mit wachsender Flotte</h3>
            <p className="text-slate-600">
              Sie starten mit dem Starter-Tarif (10 Fahrzeuge), benötigen aber gelegentlich mehr Kapazität? 
              Das Add-On ermöglicht Ihnen flexibel zu skalieren ohne zum Business-Tarif wechseln zu müssen.
            </p>
          </V28MarketingCard>

          <V28MarketingCard className="bg-slate-50 border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Saisonale Schwankungen</h3>
            <p className="text-slate-600">
              Perfekt für Unternehmen mit saisonalen Auslastungsspitzen. Buchen Sie das Add-On nur wenn Sie 
              es benötigen - jederzeit kündbar, keine Mindestlaufzeit.
            </p>
          </V28MarketingCard>
        </div>
      </V28MarketingSection>

      {/* Upgrade zu Business? */}
      <V28MarketingSection 
        title="Wann lohnt sich ein Upgrade zu Business?" 
        description="Vergleich der Optionen"
      >
        <Card className="max-w-3xl mx-auto p-8 bg-slate-50 border-slate-200">
          <div className="space-y-4 text-slate-700">
            <p className="text-lg">
              <strong>Starter + Add-On:</strong> {totalMonthly}€ / Monat (für begrenzte zusätzliche Einheiten)
            </p>
            <p className="text-lg">
              <strong>Business-Tarif:</strong> 99€ / Monat (keine Begrenzung bei Fahrzeugen & Fahrern + Premium-Features)
            </p>
            
            <div className="border-t border-slate-300 pt-4 mt-6">
              <p className="text-slate-600">
                <strong>Empfehlung:</strong> Ab ca. 15-20 Fahrzeugen lohnt sich der Wechsel zum Business-Tarif, 
                da Sie dann zusätzlich Premium-Support, API-Zugang und erweiterte Analysen erhalten.
              </p>
            </div>
          </div>

          <Link to="/pricing" className="block mt-6">
            <V28Button variant="primary" fullWidth>
              Alle Tarife vergleichen
            </V28Button>
          </Link>
        </Card>
      </V28MarketingSection>

      {/* CTA Section */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bereit zu skalieren?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Starten Sie jetzt mit dem Starter-Tarif und fügen Sie das Add-On jederzeit hinzu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <V28Button size="lg" variant="primary">
                Jetzt starten
              </V28Button>
            </Link>
            <Link to="/kontakt">
              <V28Button size="lg" variant="secondary">
                Beratung anfragen
              </V28Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
