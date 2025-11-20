# Cache-Clearing Solution V18.5.1

**Problem:** Browser zeigt alte gecachte Version trotz Code-Updates  
**Ursache:** Aggressive Browser-Caches, Service Worker, LocalStorage  
**Status:** ✅ GELÖST

---

## 🔧 Implementierte Lösungen

### 1. **HTTP-Header (\_headers Datei)**

```
/*
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: no-cache, no-store, must-revalidate
```

### 2. **Meta-Tags (index.html)**

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<meta name="build-version" content="v18.5.1-1761210800000" />
```

### 3. **Service Worker Cleanup (main.tsx)**

```typescript
// Aggressive Cache-Clearing:
// 1. Alle Service Worker deregistrieren
// 2. Alle Caches löschen
// 3. LocalStorage Version-Check
// 4. Force Reload bei Version-Mismatch
```

### 4. **Vite Build Config**

```typescript
// Cache-Busting via Hash in Dateinamen:
chunkFileNames: "assets/js/[name]-[hash].js";
entryFileNames: "assets/js/[name]-[hash].js";
assetFileNames: "assets/[name]-[hash][extname]";
```

---

## 🚀 Deployment-Prozess

### **Nach jedem Update:**

1. Build Version in `index.html` erhöhen
2. Build Version in `main.tsx` anpassen
3. `npm run build`
4. Deploy

### **User sieht Update automatisch:**

- Beim ersten Laden nach Deploy
- Version-Check in LocalStorage
- Automatischer Reload wenn nötig

---

## 🧪 Testing

### **Lokaler Test:**

```bash
# 1. Build
npm run build

# 2. Preview
npm run preview

# 3. Hard Reload im Browser
# Chrome/Edge: Ctrl+Shift+R
# Firefox: Ctrl+F5
# Safari: Cmd+Shift+R
```

### **Production Test:**

```bash
# 1. Inkognito-Fenster öffnen
# 2. App aufrufen
# 3. DevTools → Application → Clear Storage
# 4. Reload
```

---

## 📊 Cache-Strategie

| Asset-Typ         | Cache-Strategy     | Grund                          |
| ----------------- | ------------------ | ------------------------------ |
| **index.html**    | No-Cache           | Immer latest Version           |
| **JS/CSS Chunks** | Immutable (1 Jahr) | Hash im Dateinamen = eindeutig |
| **Images**        | Immutable (1 Jahr) | Hash im Dateinamen = eindeutig |
| **Fonts**         | Immutable (1 Jahr) | Hash im Dateinamen = eindeutig |

---

## 🔍 Debugging

### **Problem: User sieht alte Version**

```javascript
// DevTools Console:
localStorage.getItem("app-version");
// Soll: "v18.5.1-1761210800000"

// Cache prüfen:
caches.keys().then(console.log);
// Soll: [] (leer)

// Service Worker prüfen:
navigator.serviceWorker.getRegistrations().then(console.log);
// Soll: [] (leer)
```

### **Problem: White Screen**

```javascript
// DevTools Console → Network Tab
// Prüfe: werden neue Hashes geladen?
// Prüfe: 404 Errors?
// Prüfe: CORS Errors?
```

---

## ✅ Checkliste für Updates

- [ ] Build Version in `index.html` erhöht?
- [ ] Build Version in `main.tsx` angepasst?
- [ ] `npm run build` ausgeführt?
- [ ] Deploy durchgeführt?
- [ ] Inkognito-Test erfolgreich?
- [ ] Hard Reload funktioniert?

---

**Letzte Aktualisierung:** 2025-10-23 23:30 (DE)  
**Version:** V18.5.1  
**Status:** ✅ Production-Ready
