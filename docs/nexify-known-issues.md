# NeXify Wiki - Known Issues

**Quelle:** Supabase `known_issues` Tabelle  
**Stand:** 2025-11-09  
**Anzahl:** 4 Critical Issues

---

## 1. Hallucinated Functions - getUserProfile() Pattern

**Issue ID:** `8b2d2afa-32dc-4558-9ad0-161386aba049`  
**Type:** `hallucinated_function`  
**Severity:** `critical`

### Problem
AI halluziniert die Funktion `getUserProfile()` die nicht existiert.

### Solution
- Verwende `supabase.from('profiles').select('*').eq('user_id', userId).single()`
- Niemals `getUserProfile()` verwenden
- Prüfe Component Registry vor Verwendung

### Prevention Checklist
- [ ] Prüfe ob Funktion in Codebase existiert
- [ ] Verwende nur dokumentierte Supabase-Patterns
- [ ] Konsultiere Component Registry

---

## 2. Hallucinated Functions (Allgemein)

**Issue ID:** `afe0b51c-41db-44f0-b92d-295282c9f414`  
**Type:** `hallucinated_function`  
**Severity:** `critical`

### Problem
AI erfindet nicht-existierende Funktionen.

### Solution
- Immer Component Registry prüfen
- Nur dokumentierte APIs verwenden
- Code-Review vor Deployment

### Prevention Checklist
- [ ] Funktion in Codebase suchen
- [ ] Import-Pfad validieren
- [ ] TypeScript-Errors beachten

---

## 3. RLS Violation - Tables Without Policies

**Issue ID:** `f498795b-1170-4ab0-b2c4-ee814d5be6b3`  
**Type:** `rls_violation`  
**Severity:** `critical`

### Problem
Neue Tabellen werden ohne RLS Policies erstellt.

### Solution
```sql
-- IMMER RLS aktivieren
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Mindestens eine Policy erstellen
CREATE POLICY "policy_name" ON table_name
FOR SELECT USING (true);
```

### Prevention Checklist
- [ ] RLS bei Tabellen-Erstellung aktivieren
- [ ] Mindestens eine Policy definieren
- [ ] Security-Review durchführen

---

## 4. RLS Violation - Policy Creation Pattern

**Issue ID:** `f46a7bc6-e86a-492b-a596-0d475ace02e7`  
**Type:** `rls_violation`  
**Severity:** `critical`

### Problem
Falsche RLS Policy-Patterns werden verwendet.

### Solution
```sql
-- ✅ KORREKT: Authenticated Users
CREATE POLICY "Users can read own data" ON table_name
FOR SELECT USING (auth.uid() = user_id);

-- ❌ FALSCH: Public Access ohne Prüfung
CREATE POLICY "Public access" ON table_name
FOR SELECT USING (true);
```

### Prevention Checklist
- [ ] `auth.uid()` für User-spezifische Daten
- [ ] Keine `USING (true)` ohne Grund
- [ ] Policy-Tests durchführen

---

## Best Practices

### 1. Component Registry nutzen
Vor Verwendung einer Komponente/Funktion:
```bash
# Suche in Codebase
grep -r "functionName" src/
```

### 2. RLS-First Approach
Jede neue Tabelle:
1. RLS aktivieren
2. Policies definieren
3. Testen mit verschiedenen Rollen

### 3. Code-Review Checklist
- [ ] Keine halluzinierten Funktionen
- [ ] RLS Policies vorhanden
- [ ] Import-Pfade korrekt
- [ ] TypeScript-Errors behoben

---

## Deployment Checklist

Vor jedem Deployment:
1. ✅ Known Issues geprüft
2. ✅ RLS Policies validiert
3. ✅ Keine halluzinierten Funktionen
4. ✅ Component Registry aktualisiert
5. ✅ TypeScript Build erfolgreich
