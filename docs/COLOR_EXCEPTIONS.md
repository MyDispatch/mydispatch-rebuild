# COLOR EXCEPTIONS V32.1

## ✅ Erlaubte Nicht-Slate Farben

### Status-Indicators (EINZIGE AUSNAHME)

Die folgenden Farben sind **NUR** für Status-Badges und Echtzeit-Indikatoren erlaubt:

| Farbe               | Verwendung                            | Beispiel-Klassen                                                          |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| ✅ **Green (500)**  | Live, Aktiv, Verfügbar, Erfolgreich   | `bg-green-500`, `text-green-500`, `bg-green-50`, `text-green-600/700`     |
| 🔴 **Red (500)**    | Kritisch, Offline, Überfällig, Fehler | `bg-red-500`, `text-red-500`, `bg-red-50`, `text-red-600/700`             |
| 🟡 **Yellow (500)** | Warnung, Ausstehend, In Bearbeitung   | `bg-yellow-500`, `text-yellow-500`, `bg-yellow-50`, `text-yellow-600/700` |

### Erlaubte Verwendungsstellen

#### ✅ ERLAUBT in:

- **Status-Badges** (`<Badge>` mit Status-Varianten)
- **Live-Indicators** (z.B. Live-Map Dots, Connection Status)
- **Alert-Komponenten** (kritische System-Warnungen)
- **Resource-Status** (Fahrer verfügbar/beschäftigt/offline)
- **Trend-Indicators** (+/- % in Charts)
- **Progress States** (Completion, Error States)

#### ❌ VERBOTEN in:

- Card-Backgrounds
- Icon-Backgrounds (NUR `bg-slate-50` oder `bg-slate-100` erlaubt)
- Text-Colors für Headlines/Body (NUR slate-600 bis slate-900)
- Button-Backgrounds (außer Status-spezifische CTAs)
- Navigation-Elemente
- Hover-States (NUR slate-Varianten)
- Borders (außer Status-Komponenten)

---

## 📋 Beispiele

### ✅ KORREKT: Status-Badge

```tsx
{
  /* Live-Status Badge */
}
<div className="px-2 py-1 rounded-lg bg-green-100 ring-1 ring-green-200">
  <span className="text-xs font-bold text-green-700">Live</span>
</div>;

{
  /* Überfällige Rechnung */
}
<div className="p-3 rounded-lg bg-red-50 border border-red-200">
  <AlertTriangle className="h-3 w-3 text-red-600" />
  <p className="text-xs font-semibold text-red-600">Überfällig</p>
</div>;

{
  /* Trend Indicator */
}
<div className="flex items-center gap-1 text-xs text-green-600">
  <TrendingUp className="w-3 h-3" />
  <span>+12% vs. Vormonat</span>
</div>;
```

### ❌ FALSCH: Non-Slate für UI-Elemente

```tsx
{
  /* FALSCH: Icon-Background */
}
<div className="p-2 rounded-lg bg-blue-50">
  <Users className="h-4 w-4 text-blue-600" />
</div>;

{
  /* RICHTIG */
}
<div className="p-2 rounded-lg bg-slate-100">
  <Users className="h-4 w-4 text-slate-700" />
</div>;

{
  /* FALSCH: Card mit farbigem BG */
}
<div className="p-4 rounded-xl bg-green-50">
  <h3 className="text-green-700">KPI Card</h3>
</div>;

{
  /* RICHTIG */
}
<div className="p-4 rounded-xl bg-slate-50">
  <h3 className="text-slate-900">KPI Card</h3>
</div>;
```

---

## 🔍 Validierung

### Automatische Prüfung

```bash
npm run validate:design-lock
```

### Manuelle Prüfung

```bash
# Prüfe auf nicht-erlaubte Farb-Nutzung (außer Status-Badges)
grep -r "bg-green-\|bg-red-\|bg-yellow-\|bg-blue-\|bg-violet-" src/components/dashboard/

# Status-Exceptions sind erlaubt in:
# - Status-Badges (mit "✅ Status Exception" Kommentar)
# - Live-Indicators
# - Trend-Indicators
```

---

## 📝 Code-Kommentare

Alle Status-Exceptions MÜSSEN mit dem Kommentar `{/* ✅ Status Exception */}` markiert werden:

```tsx
<div className="bg-green-50 text-green-700">
  <span>Verfügbar</span> {/* ✅ Status Exception */}
</div>
```

---

## 🎯 Compliance Checklist

- [ ] Nur green/red/yellow-500 für Status-Indicators
- [ ] KEINE Status-Farben für Card-Backgrounds
- [ ] KEINE Status-Farben für Icon-Backgrounds
- [ ] Alle Exceptions mit `{/* ✅ Status Exception */}` kommentiert
- [ ] `npm run validate:design-lock` läuft fehlerfrei durch

---

## 📚 Referenzen

- [DESIGN_SYSTEM_LOCK.md](./DESIGN_SYSTEM_LOCK.md) - Vollständige Design-System Regeln
- [STYLE_CLEANUP_LOG.md](./STYLE_CLEANUP_LOG.md) - Changelog aller Cleanup-Aktionen
- [validate-design-lock.ts](../scripts/validate-design-lock.ts) - Automatische Validierung
