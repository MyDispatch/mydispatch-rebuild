# 🎨 BRANDING-VORGABEN MYDISPATCH V18.3.24 FINAL

**Status:** 🔴 KRITISCH - ZWINGEND EINZUHALTEN  
**Datum:** 18.01.2025  
**Version:** V18.3.24 FINAL  
**Gültigkeit:** Systemweit (öffentlich, intern, rechtlich)

---

## 📋 EXECUTIVE SUMMARY

MyDispatch ist eine eigenständige Marke. Alle externen Referenzen (insbesondere "Lovable") wurden entfernt. Diese Vorgaben stellen sicher, dass:

1. ✅ Nutzer NICHT sehen, wie MyDispatch technisch gebaut wurde
2. ✅ Keine Test-Account-Angebote (MyDispatch ist ein Premium-Produkt)
3. ✅ Konsequentes "MyDispatch"-Branding auf allen Ebenen
4. ✅ Rechtssichere Darstellung ohne irreführende Tech-Namen

---

## 🚫 REGEL 1: KEINE KOSTENLOSEN TESTS

### Verboten:
- ❌ "14 Tage kostenlos testen"
- ❌ "Kostenlose Testphase"
- ❌ "Geld-zurück-Garantie für Tests"
- ❌ "Jetzt gratis ausprobieren"
- ❌ Trial-Accounts, Demo-Accounts (außer intern)

### Erlaubt:
- ✅ "Monatlich kündbar" (keine Mindestlaufzeit)
- ✅ "Jetzt starten" (ohne "kostenlos")
- ✅ "Jetzt Tarif wählen"

### Ausnahme (NUR intern):
**Test-Accounts für Entwicklung:**
- courbois1981@gmail.com
- demo@my-dispatch.de

Diese können Tarife frei wechseln (via Tariff-Switcher in Einstellungen). NIEMALS öffentlich zeigen oder erwähnen!

### Begründung:
MyDispatch ist ein professionelles B2B-Tool. Kostenlose Tests würden den Wert des Produkts mindern. Nutzer sollen direkt in einen Tarif einsteigen (monatlich kündbar).

---

## 🔒 REGEL 2: TECHNISCHE DETAILS VERBERGEN

### Verboten auf öffentlichen Seiten:
- ❌ "React", "Vite", "TailwindCSS", "TypeScript"
- ❌ "Supabase", "Postgres", "PostgreSQL"
- ❌ "Lovable", "lovable.dev", "lovable.app"
- ❌ Tech-Stack-Auflistungen
- ❌ Framework-Namen

### Erlaubt auf öffentlichen Seiten:
- ✅ "Cloud-basiert"
- ✅ "Browser-basiert" oder "Web-Anwendung"
- ✅ "Progressive Web App (PWA)"
- ✅ "KI-gestützt" (ohne Modell-Namen)
- ✅ "Live-Karte" (statt "HERE Maps")
- ✅ "Intelligente Routenplanung"

### Ausnahmen (gesetzlich vorgeschrieben):

#### In Datenschutzerklärung:
```text
ERLAUBT (technisch notwendig):
- "SSL/TLS-Verschlüsselung"
- "Google Cloud Platform" (Hosting)
- "Google Gemini 2.5 Flash" (KI-Modell, AI Act Art. 52)
- "Stripe" (Zahlungsdienstleister)
- "Resend.com" (E-Mail-Versand)

VERBOTEN:
- "Supabase", "Lovable", "Lovable Cloud"
- "React", "Vite", "TypeScript"
```

#### In AGB/Impressum:
Nur Kontaktdaten, keine Tech-Details.

### Begründung:
Nutzer sollen nicht sehen, wie MyDispatch gebaut wurde. Das erhöht:
- Marken-Autonomie
- Wettbewerbs-Vorteil (Konkurrenz kopiert nicht einfach)
- Professionalität (Nutzer denken nicht an "billiges Framework")

---

## 🏷️ REGEL 3: KONSEQUENTES BRANDING

### Marken-Namen:
```text
✅ RICHTIG:
- "MyDispatch"
- "MyDispatch by RideHub Solutions"
- "MyDispatch AI"
- "MyDispatch Cloud"

❌ FALSCH:
- "Lovable"
- "Lovable AI"
- "Lovable Cloud"
- "Supabase"
- "The App"
```

### KI-Features:
```text
✅ RICHTIG:
- "MyDispatch AI" (allgemein)
- "MyDispatch AI-Assistent"
- "KI-gestützte Fahrer-Zuweisung"
- "Intelligente Routenoptimierung"

❌ FALSCH:
- "Lovable AI"
- "Google Gemini" (auf öffentlichen Seiten)
- "Claude Sonnet" (auf öffentlichen Seiten)

AUSNAHME (Datenschutz):
- "Google Gemini 2.5 Flash" (AI Act Art. 52 Transparenz-Pflicht)
- "Anthropic Claude Sonnet 4" (AI Act Art. 52)
```

### Hosting-Referenzen:
```text
✅ RICHTIG (Datenschutz):
- "Google Cloud Platform"
- "EU-Datacenter (Frankfurt)"
- "Cloudflare (CDN)"

❌ FALSCH:
- "Lovable Cloud"
- "Supabase"
- "Vercel"
```

---

## 📄 REGEL 4: DATENSCHUTZ-SPEZIFISCH

### Hosting-Sektion (Datenschutz.tsx):
```markdown
**Hosting & Infrastruktur**

**Anbieter:** Google Cloud Platform, Cloudflare (CDN)
**Serverstandort:** Deutschland (Frankfurt), EU-Datacenter
**Zweck:** Hosting der MyDispatch-Anwendung, Datenbank, API-Gateway
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung), Art. 28 DSGVO (Auftragsverarbeitungsvertrag)
**Datenschutz:** Google Cloud & Cloudflare sind DSGVO-zertifiziert. Alle Daten verbleiben in der EU.
**AVV:** Auftragsverarbeitungsverträge mit Google Cloud & Cloudflare liegen vor.
```

### KI-Sektion (Datenschutz.tsx):
```markdown
**KI-Assistent & Chatbot**

**Anbieter & Modelle:** MyDispatch AI (Google Gemini 2.5 Flash, Anthropic Claude Sonnet 4)
**Hosting:** Google Cloud Platform (EU-Datacenter, DSGVO-konform)
**Transparenz:** AI Act Art. 52 - vollständige Transparenz über KI-Nutzung
**Zweck:** Support-Anfragen, Dispositions-Optimierung, Routenplanung, Fahrtenanalyse
```

---

## 🔍 PRÜFLISTE VOR COMMIT

### Öffentliche Seiten:
- [ ] Keine "kostenlos testen" Erwähnungen
- [ ] Keine Tech-Stack-Namen (React, Vite, Supabase, etc.)
- [ ] Keine "Lovable"-Referenzen
- [ ] Nur "MyDispatch" / "MyDispatch AI"

### Rechtliche Seiten (Datenschutz, AGB, Impressum):
- [ ] "Google Cloud Platform" statt "Lovable Cloud"
- [ ] "MyDispatch AI" statt "Lovable AI"
- [ ] Keine "Supabase"-Erwähnungen
- [ ] Gesetzlich vorgeschriebene Tech-Details ERLAUBT (SSL, KI-Modelle)

### Interne Seiten:
- [ ] Test-Account-Features NUR für whitelisted E-Mails
- [ ] Keine öffentliche Erwähnung von Test-Accounts
- [ ] Tariff-Switcher nur für courbois1981@gmail.com / demo@my-dispatch.de

### Code-Kommentare:
- [ ] "Lovable Cloud" → "Backend" oder "Google Cloud"
- [ ] "Lovable AI" → "MyDispatch AI"

---

## 🚨 VERSTÖSSE BEHANDELN

**Severity: CRITICAL**

Verstöße gegen diese Vorgaben sind Design-Violations der höchsten Stufe:

1. **Bei Code-Review:**
   - Sofort Ablehnen
   - Zurück an Entwickler
   - Mit Hinweis auf diese Datei

2. **Bei Produktion:**
   - SOFORT Hotfix
   - Alle betroffenen Seiten prüfen
   - Dokumentation aktualisieren

3. **Bei Dokumentation:**
   - Parallel zu Code-Änderungen fixen
   - Nie vergessen, Docs zu updaten

---

## 📊 BEREITS UMGESETZTE ÄNDERUNGEN

### ✅ Abgeschlossene Tasks (18.01.2025):

1. **SYSTEM_VORGABEN_V18.3.24_FINAL.md**
   - Neue Regeln hinzugefügt (Test-Accounts, Tech-Details, Branding)

2. **Datenschutz.tsx**
   - "Lovable AI" → "MyDispatch AI"
   - "Lovable Cloud" → "Google Cloud Platform"
   - Hosting-Sektion aktualisiert

3. **Pricing.tsx**
   - "Kostenlose Testphase" FAQ entfernt
   - Ersetzt durch "Zahlungsmethoden"

4. **FAQ.tsx**
   - "Geld-zurück-Garantie" → "Monatlich kündbar"

5. **N8nWorkflowSetup.tsx**
   - "Lovable Cloud Secrets" → "Backend Secrets"

6. **sentry-integration.ts**
   - "Lovable Cloud" → "backend secrets"

7. **error-to-chat-pipeline.ts**
   - "Lovable AI" → "MyDispatch AI"
   - "Lovable Chat" → "MyDispatch AI Chat"

8. **go-live-orchestrator.ts**
   - "lovable" → "auto_deployment"

---

## 🔗 RELATED DOCS

- [SYSTEM_VORGABEN_V18.3.24_FINAL.md](./SYSTEM_VORGABEN_V18.3.24_FINAL.md)
- [INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md](./INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md)
- [REBRANDING_MYDISPATCH_DOKUMENTATION.md](../REBRANDING_MYDISPATCH_DOKUMENTATION.md)

---

## 📞 VERANTWORTUNG

**Autor:** AI-Agent (Claude Sonnet 4)  
**Genehmigt:** Pascal Courbois (Projektleiter)  
**Aktualisiert:** 18.01.2025, 17:45 Uhr (CET)

---

**NIEMALS RÜCKGÄNGIG MACHEN! BRANDING IST FINAL!**
