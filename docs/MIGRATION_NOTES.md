# 🔄 MIGRATION NOTES - Abhängigkeiten & Restore-Anleitungen

**Status:** ✅ DOKUMENTIERT  
**Version:** 1.0  
**Last Update:** 2025-10-29

---

## 🎯 ZWECK

Dieses Dokument dokumentiert:

1. **Migration-Dependencies** - Welche Migration hängt von welcher Function/Tabelle ab?
2. **Restore-Probleme** - Was kann beim Restore schiefgehen?
3. **Manual Fixes** - Wie löse ich Restore-Probleme manuell?

**Ziel:** Fehlerfreie DB-Restores auch bei komplexen Dependencies!

---

## 📊 MIGRATION DEPENDENCIES

### Migration: `20251024203559_6f58d675-4666-4b91-a56e-5d23e21c345f.sql`

**Title:** V18.5.13 Data-RAG & Task-Queue  
**Erstellt:** 2025-10-24

#### ABHÄNGIGKEIT: `is_master_account()` Function

**Genutzt in Zeilen:**

- Zeile 170: `data_rag_tasks` RLS-Policy
- Zeile 183: `data_rag_documents` RLS-Policy
- Zeile 196: `scheduled_tasks` RLS-Policy
- Zeile 201: `scheduled_tasks` RLS-Policy (Update)
- Zeile 205: `task_queue` RLS-Policy

**Beispiel:**

```sql
-- Zeile 170
CREATE POLICY "Master accounts have full access to all data_rag_tasks"
ON public.data_rag_tasks
FOR ALL
USING (is_master_account((SELECT auth.uid())));
```

#### ⚠️ RESTORE-PROBLEM

**Szenario:** Migration wird vor Function-Definition ausgeführt

**Fehler:**

```
ERROR: function is_master_account(uuid) does not exist
HINT: No function matches the given name and argument types.
```

**Lösung:** Function MUSS VOR dieser Migration existieren!

---

### Migration: `20251024120516_*.sql` (vermutlich)

**Title:** Master-Account Function Definition (vermutlich)

**Definiert:**

```sql
CREATE OR REPLACE FUNCTION public.is_master_account(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  master_emails TEXT[] := ARRAY[
    'courbois1981@gmail.com',
    'master@my-dispatch.de',
    'nexify.login@gmail.com'
  ];
BEGIN
  user_email := (auth.jwt() ->> 'email');
  IF user_email IS NULL THEN
    RETURN false;
  END IF;
  RETURN user_email = ANY(master_emails);
END;
$$;
```

**Dependency:** KEINE (kann als erste Migration laufen)

---

## 🔧 MANUAL FIX PROCEDURES

### Fix #1: `is_master_account()` fehlt bei Restore

**Symptom:**

```
ERROR: function is_master_account(uuid) does not exist
```

**Lösung: Manuelle Function-Erstellung VORHER**

**Schritt 1:** Erstelle Function manuell

```sql
CREATE OR REPLACE FUNCTION public.is_master_account(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  master_emails TEXT[] := ARRAY[
    'courbois1981@gmail.com',
    'master@my-dispatch.de',
    'nexify.login@gmail.com'
  ];
BEGIN
  user_email := (auth.jwt() ->> 'email');
  IF user_email IS NULL THEN
    RETURN false;
  END IF;
  RETURN user_email = ANY(master_emails);
END;
$$;
```

**Schritt 2:** Verifiziere Function

```sql
SELECT public.is_master_account('00000000-0000-0000-0000-000000000000');
-- Expected: false (oder true falls JWT mit Master-Email)
```

**Schritt 3:** Führe fehlgeschlagene Migration erneut aus

```bash
# Via Lovable Cloud:
# Migrations werden automatisch neu versucht
```

---

### Fix #2: Zirkuläre RLS-Dependencies

**Symptom:**

```
ERROR: infinite recursion detected in policy for relation "user_roles"
```

**Ursache:** Function nutzt DB-Lookup statt JWT

**Lösung:**

1. Prüfe, ob `is_master_account()` JWT nutzt (NICHT DB-Lookup!)
2. Falls DB-Lookup: Siehe `docs/SECURITY_ARCHITECTURE.md` für korrektes Pattern

---

## 📋 MIGRATION EXECUTION ORDER

**Korrekte Reihenfolge bei Restore:**

1. ✅ **Zuerst:** `is_master_account()` Function erstellen
2. ✅ **Dann:** Alle anderen Migrations in chronologischer Reihenfolge
3. ✅ **Verifizieren:** `SELECT public.is_master_account(auth.uid());`

**Falsche Reihenfolge vermeiden:**
❌ Migrations mit RLS-Policies BEVOR Functions definiert sind!

---

## 🔍 DEPENDENCY DETECTION

### Wie finde ich Dependencies?

**Schritt 1:** Suche nach Function-Aufrufen in Migrations

```bash
grep -r "is_master_account" supabase/migrations/
```

**Schritt 2:** Prüfe RLS-Policies

```sql
SELECT tablename, policyname, definition
FROM pg_policies
WHERE definition LIKE '%is_master_account%';
```

**Schritt 3:** Dokumentiere in diesem File!

---

## 📚 BEST PRACTICES

### Practice #1: Functions VOR RLS-Policies

✅ Definiere Functions IMMER in früheren Migrations  
✅ RLS-Policies, die Functions nutzen, kommen SPÄTER

### Practice #2: Idempotente Functions

✅ Nutze `CREATE OR REPLACE FUNCTION` (nicht `CREATE FUNCTION`)  
✅ Ermöglicht Re-Run bei Fehlern

### Practice #3: Dependency-Dokumentation

✅ JEDE Migration, die Functions nutzt → Hier dokumentieren!  
✅ JEDE neue Function → Migration-Timestamp notieren

---

## 🚨 CRITICAL FUNCTIONS (Required by Multiple Migrations)

| Function                        | Used By         | Defined In                          |
| ------------------------------- | --------------- | ----------------------------------- |
| `is_master_account(uuid)`       | 5+ RLS-Policies | `20251024120516_*.sql` (vermutlich) |
| (weitere bei Bedarf hinzufügen) |                 |                                     |

---

## 🔗 RELATED DOCS

- `docs/SECURITY_ARCHITECTURE.md` - Warum `is_master_account()` hardcoded ist
- `docs/DATABASE_SCHEMA_COMPLETE.md` - Alle RLS-Policies
- `docs/CHANGELOG.md` - Migration-Changes chronologisch

---

## 📝 UPDATE-PROZEDUR

**Bei neuer Migration mit Function-Dependency:**

1. [ ] Migration-Name + Timestamp notieren
2. [ ] Function-Name + Verwendung dokumentieren
3. [ ] Restore-Test durchführen (falls möglich)
4. [ ] Dieses Dokument updaten
5. [ ] `CHANGELOG.md` updaten

---

**LAST UPDATE:** 2025-10-29  
**MAINTAINER:** NeXify AI Agent  
**NEXT REVIEW:** Bei jeder neuen Migration mit Function-Dependencies
