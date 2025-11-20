# ERFORDERLICHE DATENBANK-MIGRATION V18.3

**Datum:** 19.10.2025  
**Typ:** Archiving-System-Komplettierung  
**Priorität:** 🔴 P0 - DEPLOY-BLOCKER

---

## 🎯 ZIELSETZUNG

Implementierung eines vollständigen Soft-Delete-Systems für `documents` und `partner_connections` zur Einhaltung der Archiving-Vorgaben und DSGVO-Compliance.

---

## 📊 BETROFFENE TABELLEN

### 1. `documents` Tabelle

**Aktuell:** Keine Archiving-Spalten  
**Problem:** Hard-Delete-Operationen (3 Stellen im Code)  
**Risiko:** Datenverlust, DSGVO-Non-Compliance

### 2. `partner_connections` Tabelle

**Aktuell:** Keine Archiving-Spalten  
**Problem:** Hard-Delete-Operationen (1 Stelle im Code)  
**Risiko:** Historien-Verlust

---

## 🔧 MIGRATIONS-SQL

```sql
-- ==================================================================================
-- ARCHIVING-SYSTEM MIGRATION V18.3
-- ==================================================================================
-- Fügt archived/archived_at Spalten zu documents und partner_connections hinzu
-- ==================================================================================

-- 1. Documents Tabelle erweitern
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Index für Performance (nur nicht-archivierte Dokumente)
CREATE INDEX IF NOT EXISTS idx_documents_archived
ON documents(archived)
WHERE archived = false;

-- Index für Archiv-Berichte (wann wurde archiviert)
CREATE INDEX IF NOT EXISTS idx_documents_archived_at
ON documents(archived_at)
WHERE archived = true;

COMMENT ON COLUMN documents.archived IS 'Soft-Delete Flag - true wenn archiviert';
COMMENT ON COLUMN documents.archived_at IS 'Timestamp der Archivierung';

-- ==================================================================================

-- 2. Partner Connections Tabelle erweitern
ALTER TABLE partner_connections
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Index für Performance
CREATE INDEX IF NOT EXISTS idx_partner_connections_archived
ON partner_connections(archived)
WHERE archived = false;

CREATE INDEX IF NOT EXISTS idx_partner_connections_archived_at
ON partner_connections(archived_at)
WHERE archived = true;

COMMENT ON COLUMN partner_connections.archived IS 'Soft-Delete Flag';
COMMENT ON COLUMN partner_connections.archived_at IS 'Timestamp der Archivierung';

-- ==================================================================================

-- 3. RLS Policies aktualisieren (nur aktive Records zeigen)

-- Documents: Existing policies updaten
DROP POLICY IF EXISTS "Users can view documents" ON documents;
CREATE POLICY "Users can view active documents" ON documents
FOR SELECT USING (
  company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
  AND archived = false
);

DROP POLICY IF EXISTS "Users can insert documents" ON documents;
CREATE POLICY "Users can insert documents" ON documents
FOR INSERT WITH CHECK (
  company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can update documents" ON documents;
CREATE POLICY "Users can update documents" ON documents
FOR UPDATE USING (
  company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
);

-- ==================================================================================

-- Partner Connections: Existing policies updaten
DROP POLICY IF EXISTS "Users can view partner connections" ON partner_connections;
CREATE POLICY "Users can view active partner connections" ON partner_connections
FOR SELECT USING (
  (company_a_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()) OR
   company_b_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()))
  AND archived = false
);

DROP POLICY IF EXISTS "Users can insert partner connections" ON partner_connections;
CREATE POLICY "Users can create partner connections" ON partner_connections
FOR INSERT WITH CHECK (
  company_a_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()) OR
  company_b_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can update partner connections" ON partner_connections;
CREATE POLICY "Users can update partner connections" ON partner_connections
FOR UPDATE USING (
  company_a_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()) OR
  company_b_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
);

-- ==================================================================================

-- 4. Archiv-Ansichten für Admins (Optional)

-- View für archivierte Dokumente
CREATE OR REPLACE VIEW archived_documents AS
SELECT
  id,
  entity_type,
  entity_id,
  document_type,
  expiry_date,
  archived_at,
  company_id
FROM documents
WHERE archived = true
ORDER BY archived_at DESC;

GRANT SELECT ON archived_documents TO authenticated;

-- View für archivierte Partner-Verbindungen
CREATE OR REPLACE VIEW archived_partner_connections AS
SELECT
  id,
  company_a_id,
  company_b_id,
  provision_rate,
  archived_at
FROM partner_connections
WHERE archived = true
ORDER BY archived_at DESC;

GRANT SELECT ON archived_partner_connections TO authenticated;

-- ==================================================================================

-- 5. Automatische Cleanup-Funktion (Optional - nach 2 Jahren löschen)

CREATE OR REPLACE FUNCTION cleanup_old_archives()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Lösche Dokumente die >2 Jahre archiviert sind
  DELETE FROM documents
  WHERE archived = true
  AND archived_at < NOW() - INTERVAL '2 years';

  -- Lösche Partner-Verbindungen die >2 Jahre archiviert sind
  DELETE FROM partner_connections
  WHERE archived = true
  AND archived_at < NOW() - INTERVAL '2 years';
END;
$$;

COMMENT ON FUNCTION cleanup_old_archives IS 'Löscht archivierte Daten älter als 2 Jahre (DSGVO-Compliance)';

-- ==================================================================================
```

---

## 📋 POST-MIGRATION CODE-FIXES

Nach erfolgreicher Migration müssen 4 Code-Stellen angepasst werden:

### Fix 1: InlineDocumentUpload.tsx

```typescript
// Line 166-169
const { error } = await supabase
  .from("documents")
  .update({ archived: true, archived_at: new Date().toISOString() })
  .eq("id", docId);
```

### Fix 2: PartnerConnectionList.tsx

```typescript
// Line 114-117
const { error } = await supabase
  .from("partner_connections")
  .update({ archived: true, archived_at: new Date().toISOString() })
  .eq("id", selectedConnection);
```

### Fix 3: use-documents.tsx

```typescript
// Line 93-97
const { error } = await supabase
  .from("documents")
  .update({ archived: true, archived_at: new Date().toISOString() })
  .eq("id", id)
  .eq("company_id", profile?.company_id);
```

### Fix 4: use-offline-queue.tsx

```typescript
// Line 118-120
case 'delete':
  await (supabase.from as any)(operation.table).update({
    archived: true,
    archived_at: new Date().toISOString()
  }).eq('id', operation.data.id);
  break;
```

---

## ✅ VERIFIZIERUNGS-CHECKLISTE

Nach Migration und Code-Fixes:

- [ ] TypeScript Build: 0 Errors
- [ ] Runtime Test: Dokument archivieren
- [ ] Runtime Test: Partner-Verbindung archivieren
- [ ] Verifiziere: archived = false in allen Queries
- [ ] Verifiziere: Archiv-Views zugänglich
- [ ] Pre-Deploy-Check: PASSED

---

## 📈 IMPACT

**Vor Migration:**

- ❌ Hard-Deletes (Datenverlust-Risiko)
- ❌ Keine Archiv-Historie
- ❌ DSGVO-Non-Compliance

**Nach Migration:**

- ✅ Soft-Deletes (Daten-Sicherheit)
- ✅ Vollständige Archiv-Historie
- ✅ DSGVO-konform
- ✅ Wiederherstellbar

---

## 🚀 NÄCHSTE SCHRITTE

1. **Migration durchführen** (30min)
   - SQL-Script in Supabase Migration-Tool
   - User-Approval einholen
   - Migration ausführen

2. **Code-Fixes anwenden** (2h)
   - 4 Dateien anpassen
   - TypeScript-Build verifizieren
   - Runtime-Tests durchführen

3. **Verifizierung** (30min)
   - Pre-Deploy-Check
   - Manual-Testing
   - Approval für Go-Live

**Total Time:** ~3 Stunden  
**Priority:** 🔴 CRITICAL

---

**Erstellt:** 19.10.2025  
**Status:** Bereit zur Ausführung  
**Approval Required:** JA (User-Bestätigung)
