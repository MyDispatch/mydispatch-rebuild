# Landingpage-Domain-Konzept für MyDispatch V18.2.8

## 🎯 Anforderung

**Vorgabe:** Die gebrandete Landingpage eines Unternehmens muss über eine saubere, SEO-freundliche URL erreichbar sein.

## 📋 URL-Struktur

### Standard-Format

```
https://my-dispatch.de/[company-slug]
```

### Komponenten

- **Base-Domain:** `my-dispatch.de` (Produktions-Domain)
- **Dynamischer Slug:** `[company-slug]` (kundenspezifisch, anpassbar, direkt auf Root-Level)

### Beispiele

| Unternehmen                | Slug                    | Vollständige URL                               |
| -------------------------- | ----------------------- | ---------------------------------------------- |
| Taxi München Schmidt       | `taxi-muenchen-schmidt` | `https://my-dispatch.de/taxi-muenchen-schmidt` |
| City-Cars Berlin           | `city-cars-berlin`      | `https://my-dispatch.de/city-cars-berlin`      |
| Premium Limousinen Service | `premium-limousinen`    | `https://my-dispatch.de/premium-limousinen`    |

## 🔧 Technische Umsetzung

### 1. Slug-Feld (company_slug)

- **Datenbank-Feld:** `companies.company_slug` (TEXT, UNIQUE)
- **Validierung:** Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt
- **Format:** `^[a-z0-9-]+$`
- **Mindestlänge:** 3 Zeichen
- **Maximallänge:** 50 Zeichen

### 2. Einstellungen-UI

**Pfad:** `/einstellungen` → Tab "Landingpage"

**Eingabefeld:**

```tsx
<Label htmlFor="company_slug">URL-Slug</Label>
<Input
  id="company_slug"
  value={companyData.company_slug || ''}
  onChange={(e) => setCompanyData({
    ...companyData,
    company_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
  })}
  placeholder="ihr-unternehmen"
/>
```

**URL-Anzeige:**

```tsx
<p className="text-sm font-medium mb-2">🔗 Ihre Landingpage-URL:</p>
<a
  href={`/unternehmen/${companyData.company_slug || 'ihr-slug'}`}
  target="_blank"
  rel="noopener noreferrer"
  className="text-sm text-accent hover:underline break-all"
>
  https://my-dispatch.de/unternehmen/{companyData.company_slug || 'ihr-slug'}
</a>
```

### 3. Routing (React Router)

**App.tsx - Route-Definition:**

```tsx
<Route path="/unternehmen/:slug" element={<Unternehmer />} />
```

**Unternehmer.tsx - Slug-Auflösung:**

```tsx
const { slug } = useParams();

// Lookup company by slug
const { data: company } = await supabase
  .from("companies")
  .select("*")
  .eq("company_slug", slug)
  .single();
```

### 4. Fallback für Legacy-URLs

**Alte URL-Struktur:** `/unternehmer?tenant=[id]`

**Migration:**

- Alte Links werden weiterhin unterstützt (Abwärtskompatibilität)
- Automatischer Redirect zu neuer Slug-basierter URL
- Keine 404-Fehler für bestehende Bookmarks

## 🛡️ Validierung & Sicherheit

### Slug-Validierung

1. **Client-Side:** Automatische Bereinigung bei Eingabe
2. **Server-Side:** DB-Constraint für UNIQUE
3. **Collision-Handling:** Fehlermeldung bei Duplikaten

### Reserved Slugs (Blacklist)

Folgende Slugs sind reserviert und dürfen nicht verwendet werden:

- `admin`, `dashboard`, `api`, `auth`, `login`, `signup`
- `einstellungen`, `auftraege`, `fahrer`, `fahrzeuge`
- `impressum`, `datenschutz`, `agb`, `kontakt`
- `pricing`, `docs`, `support`, `help`

### SEO-Optimierung

- **Canonical URL:** Jede Landingpage hat canonical tag mit Slug-URL
- **Meta-Tags:** Dynamische Title/Description basierend auf company_slug
- **Sitemap:** Automatische Generierung aller Unternehmens-Landingpages
- **robots.txt:** Alle Landingpages sind indexierbar

## 📊 Vorteile der neuen Struktur

### 1. SEO

✅ Sprechende URLs (z.B. `/taxi-muenchen-schmidt` statt `?tenant=uuid`)
✅ Bessere Rankings durch Keyword-reiche URLs
✅ Höhere Klickraten in Suchergebnissen

### 2. Benutzererfahrung

✅ Einfach zu merken und weiterzugeben
✅ Professionelles Erscheinungsbild
✅ Keine kryptischen IDs in der URL

### 3. Marketing

✅ Einfaches Teilen auf Social Media
✅ Printfähig (Visitenkarten, Flyer)
✅ QR-Code-freundlich

### 4. Branding

✅ Stärkere Markenidentität durch individuellen Slug
✅ Konsistente URL-Struktur für alle Kunden
✅ Professionelle Domain-Präsentation

## 🔄 Migration Bestehender Kunden

### Phase 1: Slug-Generierung

Für bestehende Kunden ohne `company_slug`:

```sql
UPDATE companies
SET company_slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE company_slug IS NULL;
```

### Phase 2: Duplikat-Auflösung

Bei Kollisionen: Automatisches Suffix anhängen

```sql
-- Beispiel: "taxi-muenchen" → "taxi-muenchen-2"
```

### Phase 3: Redirect-Handling

Legacy-URLs (`?tenant=id`) werden automatisch zu Slug-URLs redirectet

## 📝 Dokumentation für Kunden

### E-Mail-Template (Slug-Änderung)

```
Betreff: Ihre neue MyDispatch Landingpage-URL

Liebe/r Kunde/in,

Ihre Unternehmens-Landingpage ist jetzt unter einer neuen, noch professionelleren URL erreichbar:

https://my-dispatch.de/unternehmen/[ihr-slug]

Diese URL können Sie:
✓ In Google My Business eintragen
✓ Auf Visitenkarten drucken
✓ In Social Media teilen
✓ Auf Ihrer Website verlinken

Die alte URL funktioniert weiterhin und leitet automatisch zur neuen URL weiter.

Sie können Ihren URL-Slug jederzeit in den Einstellungen anpassen.

Mit freundlichen Grüßen
Ihr MyDispatch Team
```

## 🧪 Testing-Checklist

- [ ] Slug-Eingabe: Nur erlaubte Zeichen möglich
- [ ] Slug-Uniqueness: Duplikate werden verhindert
- [ ] URL-Anzeige: Korrekte URL wird angezeigt
- [ ] Routing: `/unternehmen/slug` funktioniert
- [ ] Legacy-Support: `?tenant=id` redirectet zu Slug-URL
- [ ] 404-Handling: Unbekannte Slugs zeigen Fehlerseite
- [ ] SEO: Canonical Tags sind korrekt
- [ ] Mobile: URL bricht sauber um

## 🚀 Deployment-Hinweise

### Produktions-Domain

- **Live-Domain:** `https://my-dispatch.de`
- **DNS-Konfiguration:** A-Record auf Lovable-IP (185.158.133.1)
- **SSL:** Automatisch via Let's Encrypt

### Lovable Project Settings

1. **Custom Domain hinzufügen:** `my-dispatch.de`
2. **DNS-Records konfigurieren**
3. **SSL-Verifizierung abwarten** (bis zu 48h)
4. **Deployment:** Automatisch bei Code-Push

## 📞 Support & Fehlerbehebung

### Häufige Probleme

**Problem:** Slug wird als "vergeben" angezeigt
**Lösung:** Anderen Slug wählen oder Support kontaktieren

**Problem:** Landingpage zeigt 404
**Lösung:** Slug in Einstellungen überprüfen und speichern

**Problem:** URL funktioniert nicht
**Lösung:** `landingpage_enabled` muss auf `true` gesetzt sein

---

**Version:** V18.2.8
**Stand:** 17.10.2025
**Autor:** MyDispatch Development Team
