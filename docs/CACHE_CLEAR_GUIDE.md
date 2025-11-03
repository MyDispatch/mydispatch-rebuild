# CACHE-CLEAR GUIDE - Änderungen nicht sichtbar?

**Problem:** Code wurde geändert, aber Änderungen werden im Browser nicht angezeigt

---

## 🚨 SYMPTOME

- ✅ Code wurde korrekt geändert
- ✅ Keine Build-Errors
- ❌ Änderungen werden nicht im Browser angezeigt
- ❌ Alte Styles/Farben werden noch verwendet

**Ursache:** Browser-Cache oder Vite-Dev-Server-Cache

---

## 🔧 LÖSUNG (3 SCHRITTE)

### ⚡ METHODE 1: SCHNELLER FIX (Hard Refresh)

**Windows/Linux:**
```
Strg + Shift + R
```

**Mac:**
```
Cmd + Shift + R
```

**Oder:**
```
Strg + F5 (Windows/Linux)
Cmd + Shift + Delete (Mac - dann Cache löschen)
```

---

### 🛠️ METHODE 2: VOLLSTÄNDIGER CACHE-CLEAR

#### 1. VITE DEV-SERVER NEU STARTEN
```bash
# Im Terminal:
# 1. Server stoppen (Strg+C oder Cmd+C)
# 2. Neu starten:
npm run dev
```

#### 2. BROWSER-CACHE LÖSCHEN

**Chrome/Edge:**
1. Drücke `Strg+Shift+Delete` (Win) oder `Cmd+Shift+Delete` (Mac)
2. Wähle "Bilder und Dateien im Cache"
3. Klicke "Daten löschen"

**Firefox:**
1. Drücke `Strg+Shift+Delete` (Win) oder `Cmd+Shift+Delete` (Mac)
2. Wähle "Cache"
3. Klicke "Jetzt löschen"

**Safari:**
1. Drücke `Cmd+Option+E`
2. Oder: Entwickler → Caches leeren

---

### 🔥 METHODE 3: NUCLEAR OPTION (Wenn nichts hilft)

**ALLE Caches löschen + Neuinstallation:**

```bash
# 1. Dev-Server stoppen (Strg+C)

# 2. Alle Caches löschen
rm -rf dist/
rm -rf node_modules/.vite/
rm -rf .next/
rm -rf .parcel-cache/

# 3. Dependencies neu installieren (optional, wenn wirklich alles schief läuft)
# rm -rf node_modules/
# npm install

# 4. Dev-Server neu starten
npm run dev
```

**Windows (PowerShell):**
```powershell
# 1. Dev-Server stoppen (Strg+C)

# 2. Alle Caches löschen
Remove-Item -Recurse -Force dist/
Remove-Item -Recurse -Force node_modules/.vite/

# 3. Dev-Server neu starten
npm run dev
```

---

## 🧪 VERIFIKATION

Nach dem Cache-Clear solltest du:

1. **Hard Refresh** durchführen (`Strg+Shift+R`)
2. **Browser-DevTools** öffnen (`F12`)
3. **Network-Tab** öffnen
4. **"Disable cache"** aktivieren
5. **Seite neu laden**

**Erwartetes Ergebnis:**
- ✅ Alle Änderungen sichtbar
- ✅ Neue Styles werden angewendet
- ✅ Korrekte Farben werden angezeigt

---

## 🎯 SPEZIALFALL: TOKEN-ÄNDERUNGEN

Wenn du Design-Token-Dateien geändert hast:

```typescript
// z.B. in unified-design-tokens.ts
beige: 'hsl(42, 49%, 78%)'
```

**Zusätzlich erforderlich:**

1. **Vite-Config-Cache löschen:**
```bash
rm -rf node_modules/.vite/
```

2. **Browser-Cache löschen** (siehe oben)

3. **Server neu starten:**
```bash
npm run dev
```

4. **Hard Refresh im Browser:**
```
Strg+Shift+R
```

---

## 🐛 TROUBLESHOOTING

### Problem: Änderungen immer noch nicht sichtbar

**Prüfe:**

1. **Datei gespeichert?**
   - Achte auf das Speicher-Symbol im Editor

2. **Korrekte Datei geändert?**
   - Prüfe Import-Pfade in Komponenten

3. **TypeScript-Error?**
   - Prüfe Terminal-Output
   - Prüfe Browser-Console (`F12`)

4. **Build-Error?**
   - Prüfe Terminal auf Fehlermeldungen

5. **Falscher Import?**
```typescript
// ❌ Falsch
import { TOKENS } from './old-tokens';

// ✅ Richtig
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';
```

---

## 📱 MOBILE TESTING

Wenn du auf einem Mobilgerät testest:

**iOS Safari:**
1. Einstellungen → Safari → Erweitert
2. Website-Daten → Alle Website-Daten entfernen

**Android Chrome:**
1. Chrome → Einstellungen → Datenschutz
2. Browserdaten löschen → Cache → Daten löschen

---

## 🎓 WARUM PASSIERT DAS?

### Browser-Cache
- Browser speichern CSS/JS-Dateien lokal
- Bei erneutem Laden werden alte Dateien verwendet
- Cache-Busting-Hashes helfen, aber nicht immer

### Vite-Dev-Server-Cache
- Vite cached transformierte Module
- Bei Token-Änderungen wird Cache nicht immer invalidiert
- Neustart hilft

### CSS-Specificity
- Manchmal überschreiben alte Styles neue Styles
- Nicht ein Cache-Problem, sondern CSS-Priorität

---

## ✅ BEST PRACTICES

**Während der Entwicklung:**

1. **DevTools immer offen** (`F12`)
2. **"Disable cache" aktiviert** (im Network-Tab)
3. **Nach Token-Änderungen:** Server neu starten
4. **Nach großen Änderungen:** Hard Refresh

**Vor dem Testen:**
```bash
npm run dev
# Warten bis "ready" erscheint
# Dann: Strg+Shift+R im Browser
```

---

## 🚀 SCHNELL-REFERENZ

| Problem | Lösung |
|---------|--------|
| Kleine Änderung nicht sichtbar | `Strg+Shift+R` |
| Token geändert | Server neu starten + Hard Refresh |
| Gar nichts hilft | `rm -rf node_modules/.vite/ && npm run dev` |
| Build-Error | Terminal prüfen |
| TypeScript-Error | `npm run build` prüfen |

---

**Bei Fragen:** Siehe `docs/V26_SYSTEM_CLEANUP_COMPLETE.md`
