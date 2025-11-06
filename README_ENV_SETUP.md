# 🔐 ENVIRONMENT VARIABLES SETUP

## KRITISCHER FEHLER BEHEBEN

Der Fehler `supabaseKey is required` tritt auf, wenn die Environment-Variablen nicht korrekt konfiguriert sind.

## SCHRITTE ZUR BEHEBUNG

### 1. Erstelle `.env.local` Datei

Erstelle eine Datei namens `.env.local` im Projektroot (`C:\Users\pcour\mydispatch-rebuild\.env.local`)

### 2. Füge folgende Variablen hinzu:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Ersetze die Platzhalter

- `https://your-project.supabase.co` → Deine tatsächliche Supabase-URL
- `your-anon-key-here` → Deinen tatsächlichen Supabase Anon Key

### 4. Dev Server neu starten

Nach dem Erstellen/Ändern der `.env.local` Datei:
1. Stoppe den Dev Server (Ctrl+C)
2. Starte ihn neu: `npm run dev`

## WICHTIG

- Die Variablen müssen mit `VITE_` beginnen (Vite-Anforderung)
- Die Datei `.env.local` ist bereits in `.gitignore` und wird nicht committed
- Verwende `.env.example` als Vorlage für andere Entwickler

## VERIFIKATION

Nach dem Neustart sollte der Fehler `supabaseKey is required` verschwinden.
Prüfe die Browser-Console (F12) für weitere Informationen.

