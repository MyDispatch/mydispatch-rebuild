# 🔴 CHAT-SYSTEM VORGABEN V18.2.30 - DUAL-MODE FINAL

## ABSOLUTE REGELN (NIEMALS ÄNDERN!)

### 1. ZWEI MODI - KOMPLETT GETRENNT

#### APP MODE (MyDispatch AI-Assistent)

**Kontext:** Eingeloggte Unternehmens-Nutzer im Dashboard
**Zweck:** Software-Support, Disposition, Rechtsfragen, Optimierung
**Ton:** B2B, professionell, Sie-Form, KEINE Emojis
**UI:**

- Header: "MyDispatch AI-Assistent"
- Begrüßung: "Guten Morgen/Tag/Abend, {Vorname}"
- Transparenz-Hinweis: "AI-System Gemini 2.5 Flash | Zweck: Support & Analyse"
- Kontext-Info: Seite, Unternehmen, Tarif, Daten
- Avatar: "AI" Badge
- Fragen: Software-bezogen ("Wie nutze ich MyDispatch optimal?")

#### LANDING MODE (Service-Assistent)

**Kontext:** Öffentliche Landingpage für Endkunden
**Zweck:** Buchungs-Support, Service-Fragen, Fahrzeug-Info
**Ton:** B2C, freundlich, Sie-Form, Emojis ERLAUBT 🚖
**UI:**

- Header: "{Firmenname}-Assistent" (z.B. "Taxi123-Assistent")
- Begrüßung: "Guten Morgen/Tag/Abend! Wie kann ich Ihnen helfen? 🚖"
- KEIN Transparenz-Hinweis (zu technisch)
- KEINE Kontext-Info (interne Daten)
- Avatar: Car-Icon
- Fragen: Service-bezogen ("Wie kann ich eine Fahrt buchen?")
- Kontakt-Button: Telefonnummer des Unternehmens

### 2. KRITISCHE VERBOTE FÜR LANDING MODE

❌ NIEMALS "MyDispatch" erwähnen (weder im Chat noch in Antworten)
❌ NIEMALS technische Details zeigen (AI-Modell, Tarife, Systeme)
❌ NIEMALS interne Kontext-Infos anzeigen (Subscription, Status, Datenbank-IDs)
❌ NIEMALS Software-Support-Fragen vorschlagen
❌ NIEMALS als "AI-Assistent" bezeichnen → "Service-Assistent" / "Service-Chat"

### 3. SYSTEM-PROMPT UNTERSCHIEDE

#### APP MODE Prompt:

```
Sie sind der professionelle AI-Assistent von MyDispatch, einer Dispositionssoftware...
- Verwenden Sie die Sie-Form (formell, professionell)
- KEINE Emojis
- Fokus auf Software-Funktionen, Rechtsfragen, Optimierung
```

#### LANDING MODE Prompt:

```
Sie sind der freundliche Service-Assistent von {Firmenname}...
- Verwenden Sie die Sie-Form (höflich, serviceorientiert)
- Emojis ERLAUBT (🚖 🚗 ✅ 📞)
- Fokus auf Buchung, Preise, Fahrzeugtypen
- NIEMALS "MyDispatch" erwähnen
```

## VORGESCHLAGENE FRAGEN

### APP MODE (nach Seite):

- `/auftraege`: "Wie kann ich die Fahrtenplanung optimieren?"
- `/fahrer`: "Welche Dokumente benötigt ein neuer Fahrer?"
- `/fahrzeuge`: "Wie verwalte ich Konzessionen?"
- Default: "Wie nutze ich MyDispatch optimal?"

### LANDING MODE (immer gleich):

- "Wie kann ich eine Fahrt buchen?"
- "Welche Fahrzeugtypen bieten Sie an?"
- "Was kostet eine Fahrt zum Flughafen?"

## IMPLEMENTIERUNG

### Component: `src/components/shared/IntelligentAIChat.tsx`

```tsx
interface IntelligentAIChatProps {
  isPublicLanding?: boolean; // false = APP MODE, true = LANDING MODE
  companyData?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
}
```

### Usage APP MODE:

```tsx
// In src/App.tsx (global für eingeloggte Nutzer)
<AISupportWidget /> // Zeigt IntelligentAIChat ohne Props
```

### Usage LANDING MODE:

```tsx
// In src/pages/Unternehmer.tsx
<IntelligentAIChat
  isPublicLanding={true}
  companyData={{
    id: company.id,
    name: company.name,
    phone: company.phone,
    email: company.email,
    address: company.address,
  }}
/>
```

## EDGE FUNCTION

### `supabase/functions/ai-support-chat/index.ts`

```typescript
const { isPublicLanding, companyId, context } = await req.json();

const systemPrompt = isPublicLanding
  ? `Sie sind der freundliche Service-Assistent von ${companyName}...` // B2C
  : `Sie sind der professionelle AI-Assistent von MyDispatch...`; // B2B
```

## TESTING CHECKLIST

### Landing Mode:

- [ ] Header zeigt "{Firmenname}-Assistent"
- [ ] Begrüßung zeigt "Wie kann ich Ihnen helfen? 🚖"
- [ ] KEIN Transparenz-Hinweis sichtbar
- [ ] KEINE Kontext-Infos (Tarif, Status, etc.)
- [ ] Avatar ist Car-Icon, nicht "AI"
- [ ] Vorgeschlagene Fragen sind Service-orientiert
- [ ] Telefon-Button vorhanden (wenn phone gesetzt)
- [ ] Bot-Antworten erwähnen NIEMALS "MyDispatch"
- [ ] Bot-Antworten nutzen Emojis 🚖

### App Mode:

- [ ] Header zeigt "MyDispatch AI-Assistent"
- [ ] Begrüßung zeigt "Guten Tag, {Vorname}"
- [ ] Transparenz-Hinweis vorhanden
- [ ] Kontext-Infos sichtbar (Seite, Tarif)
- [ ] Avatar ist "AI" Badge
- [ ] Vorgeschlagene Fragen sind Software-bezogen
- [ ] Bot-Antworten sind professionell, KEINE Emojis

## FEHLER-SZENARIEN

### Szenario 1: Landing zeigt "MyDispatch"

**Ursache:** `isPublicLanding` nicht übergeben oder Edge Function ignoriert Flag
**Lösung:** Props prüfen + Edge Function Logging aktivieren

### Szenario 2: Landing zeigt Tarif-Infos

**Ursache:** Kontext-Daten werden nicht gefiltert
**Lösung:** `loadContextData()` unterscheidet nicht zwischen Modi

### Szenario 3: Vorgeschlagene Fragen falsch

**Ursache:** Funktionen `getLandingSuggestedQuestions()` vs `getAppSuggestedQuestions()` nicht korrekt aufgerufen
**Lösung:** Conditional Rendering basierend auf `isPublicLanding`

## VERSION HISTORY

- **V18.2.30**: DUAL-MODE FINAL - Komplette Trennung App vs. Landing
- **V18.2.28**: Initial Landing Support (fehlerhaft)
- **V18.0**: Original MyDispatch AI-Assistent (nur App-Mode)

---

**STATUS:** ✅ PRODUKTIONSREIF | **LETZTES UPDATE:** 2025-10-18 | **AUTOR:** System | **FREIGABE:** FINAL
