/* ==================================================================================
   LOCATION SETTINGS TAB - V18.2.8
   ==================================================================================
   - Firmenstandort-Verwaltung (Tab 8 in Einstellungen)
   - AddressInput Integration mit HERE Geocoding
   - Live-Koordinaten-Anzeige
   - Wetter-Preview für Standort
   ================================================================================== */

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { V28Button } from '@/components/design-system/V28Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AddressInput } from '@/components/forms/AddressInput';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { formatCoordinates } from '@/lib/format-utils-extended';
import { useCompanyLocation } from '@/hooks/use-company-location';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GeocodingResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
  street?: string;
  street_number?: string;
  postal_code?: string;
  city?: string;
  timezone?: string;
  country_code?: string;
}

export function LocationSettingsTab() {
  const { profile } = useAuth();
  const { location, refetch } = useCompanyLocation();
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [street, setStreet] = useState(location?.street || '');
  const [streetNumber, setStreetNumber] = useState(location?.street_number || '');
  const [postalCode, setPostalCode] = useState(location?.postal_code || '');
  const [city, setCity] = useState(location?.city || '');
  const [latitude, setLatitude] = useState<number | undefined>(location?.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(location?.longitude);
  const [timezone, setTimezone] = useState(location?.timezone || 'Europe/Berlin');
  const [countryCode, setCountryCode] = useState(location?.country_code || 'DE');
  const [phonePrefix, setPhonePrefix] = useState(location?.phone_prefix || '+49');

  // Geocoding mit HERE API (via Edge Function)
  const handleGeocodeAddress = async () => {
    const fullAddress = `${street} ${streetNumber}, ${postalCode} ${city}`;
    
    if (!street || !city) {
      handleError(
        new Error('Unvollständige Adresse'),
        'Bitte geben Sie mindestens Straße und Stadt ein.',
        { title: 'Geocoding nicht möglich' }
      );
      return;
    }

    setIsGeocoding(true);

    try {
      const { data, error } = await supabase.functions.invoke<GeocodingResult>(
        'geocode-company-address',
        {
          body: { address: fullAddress }
        }
      );

      if (error) throw error;

      if (data) {
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setTimezone(data.timezone || 'Europe/Berlin');
        setCountryCode(data.country_code || 'DE');
        
        handleSuccess('Adresse erfolgreich geocodiert! Koordinaten wurden automatisch ermittelt.');
      }
    } catch (error) {
      handleError(
        error,
        'Adresse konnte nicht geocodiert werden. Bitte überprüfen Sie die Eingabe.',
        { title: 'Geocoding fehlgeschlagen' }
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  // Speichern
  const handleSave = async () => {
    if (!profile?.company_id) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('companies')
        .update({
          street,
          street_number: streetNumber,
          postal_code: postalCode,
          city,
          latitude,
          longitude,
          timezone,
          country_code: countryCode,
          phone_prefix: phonePrefix,
        })
        .eq('id', profile.company_id);

      if (error) throw error;

      handleSuccess('Standort erfolgreich gespeichert!');
      refetch(); // Aktualisiere Company Location Cache
    } catch (error) {
      handleError(error, 'Fehler beim Speichern des Standorts');
    } finally {
      setIsSaving(false);
    }
  };

  // Callback für AddressInput
  const handleAddressChange = (data: unknown) => {
    if (data.street) setStreet(data.street);
    if (data.houseNumber) setStreetNumber(data.houseNumber);
    if (data.postalCode) setPostalCode(data.postalCode);
    if (data.city) setCity(data.city);
    if (data.latitude) setLatitude(data.latitude);
    if (data.longitude) setLongitude(data.longitude);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Firmenstandort</h2>
        <p className="text-muted-foreground mt-1">
          Verwalten Sie den Standort Ihres Unternehmens. Die Koordinaten werden für Wetter-, Verkehrs- und GPS-Funktionen verwendet.
        </p>
      </div>

      {/* Adress-Eingabe */}
      <Card>
        <CardHeader>
          <CardTitle>
            Adresse
          </CardTitle>
          <CardDescription>
            Geben Sie die vollständige Firmenadresse ein. Die Koordinaten werden automatisch ermittelt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AddressInput Component (Google Maps Autocomplete) */}
          <div className="space-y-2">
            <Label>Adresse (mit Autocomplete)</Label>
            <AddressInput
              street={street}
              streetNumber={streetNumber}
              postalCode={postalCode}
              city={city}
              onAddressChange={handleAddressChange}
              onStreetChange={setStreet}
              onStreetNumberChange={setStreetNumber}
              onPostalCodeChange={setPostalCode}
              onCityChange={setCity}
            />
          </div>

          {/* Manuelle Eingabe-Felder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Straße</Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="z.B. Maximilianstraße"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street_number">Hausnummer</Label>
              <Input
                id="street_number"
                value={streetNumber}
                onChange={(e) => setStreetNumber(e.target.value)}
                placeholder="z.B. 12a"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">PLZ</Label>
              <Input
                id="postal_code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="z.B. 80539"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Stadt</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="z.B. München"
              />
            </div>
          </div>

          {/* Geocode-Button */}
          <V28Button
            onClick={handleGeocodeAddress}
            disabled={isGeocoding || !street || !city}
            variant="secondary"
            className="w-full"
          >
            {isGeocoding ? 'Geocodiere...' : 'Koordinaten ermitteln'}
          </V28Button>
        </CardContent>
      </Card>

      {/* Koordinaten & Meta-Daten */}
      <Card>
        <CardHeader>
          <CardTitle>
            Geo-Daten & Zeitzone
          </CardTitle>
          <CardDescription>
            Koordinaten und Zeitzone werden für Location-Aware Features verwendet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Koordinaten (Read-Only, nur via Geocoding) */}
          {latitude && longitude && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                Koordinaten
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                {formatCoordinates(latitude, longitude)}
              </p>
              <p className="text-xs text-muted-foreground">
                Breitengrad: {latitude.toFixed(6)} | Längengrad: {longitude.toFixed(6)}
              </p>
            </div>
          )}

          {/* Zeitzone */}
          <div className="space-y-2">
            <Label htmlFor="timezone">
              Zeitzone
            </Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Europe/Berlin">Europe/Berlin (MEZ/MESZ)</SelectItem>
                <SelectItem value="Europe/Vienna">Europe/Vienna (MEZ/MESZ)</SelectItem>
                <SelectItem value="Europe/Zurich">Europe/Zurich (MEZ/MESZ)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ländercode & Telefonvorwahl */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country_code">Ländercode</Label>
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger id="country_code">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DE">DE (Deutschland)</SelectItem>
                  <SelectItem value="AT">AT (Österreich)</SelectItem>
                  <SelectItem value="CH">CH (Schweiz)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_prefix">
                Telefonvorwahl
              </Label>
              <Select value={phonePrefix} onValueChange={setPhonePrefix}>
                <SelectTrigger id="phone_prefix">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+49">+49 (Deutschland)</SelectItem>
                  <SelectItem value="+43">+43 (Österreich)</SelectItem>
                  <SelectItem value="+41">+41 (Schweiz)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hinweis: Location-Aware Features */}
      {latitude && longitude && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm font-medium">Location-Aware Features aktiviert</p>
              <p className="text-xs text-muted-foreground">
                Ihr Dashboard zeigt nun automatisch Wetter- und Verkehrsinformationen für{' '}
                <strong>{city}</strong>. Die Live-Karte wird auf Ihren Standort zentriert.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Speichern-Button */}
      <div className="flex justify-end">
        <V28Button
          onClick={handleSave}
          disabled={isSaving || !street || !city}
          size="lg"
        >
          {isSaving ? 'Speichere...' : 'Standort speichern'}
        </V28Button>
      </div>
    </div>
  );
}
