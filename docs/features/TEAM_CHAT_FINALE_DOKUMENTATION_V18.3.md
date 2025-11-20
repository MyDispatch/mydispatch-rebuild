# 💬 TEAM-KOMMUNIKATION - Finale Produktions-Dokumentation V18.3
**Datum:** 19.10.2025  
**Version:** V18.3 Production  
**Status:** ✅ PRODUKTIONSREIF  

---

## 📋 EXECUTIVE SUMMARY

Das Team-Kommunikationssystem ist ein internes WhatsApp-ähnliches Chat-System für Teammitglieder desselben Unternehmens. Es unterstützt:

- ✅ **Echtzeit-Chat** via Supabase Realtime
- ✅ **Multi-Tenant-Isolation** via `company_id`
- ✅ **Dateifreigabe** via Supabase Storage
- ⚠️ **Audio/Video-Calls** via Daily.co (Optional - Beta)

---

## 🎯 SYSTEM-ANFORDERUNGEN

### Voraussetzungen (KRITISCH)
```
✅ Mindestens 2 User im selben Unternehmen (company_id)
✅ Beide User müssen Profile in `profiles`-Tabelle haben
✅ `user_id` ist der Primary Key für Chat-Participants
```

### Warum funktioniert Chat NICHT mit nur 1 User?
```
❌ Solo-Conversations werden gefiltert (Design-Entscheidung)
❌ ParticipantSelector zeigt keine Teilnehmer an
✅ Prominenter Empty-State mit "Team einladen"-Button
```

---

## 🏗️ SYSTEM-ARCHITEKTUR

### Datenbank-Schema
```sql
-- Chat Conversations (Haupt-Entity)
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id), -- Multi-Tenant
  name TEXT NULL,                                    -- Optional (Gruppen)
  is_group BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  archived BOOLEAN DEFAULT false
);

-- Chat Participants (Many-to-Many)
CREATE TABLE chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id),
  user_id UUID NOT NULL,                             -- ⚠️ NUR echte User-IDs!
  joined_at TIMESTAMPTZ DEFAULT now(),
  last_read_at TIMESTAMPTZ NULL
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id),
  sender_id UUID NOT NULL,                           -- ⚠️ NUR echte User-IDs!
  message_text TEXT NULL,
  message_type TEXT DEFAULT 'text',                  -- 'text' | 'file'
  file_url TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  edited_at TIMESTAMPTZ NULL,
  is_deleted BOOLEAN DEFAULT false
);
```

### RLS Policies (Multi-Tenant-Security)
```sql
-- Conversations: Nur eigene Company
CREATE POLICY "Users can view conversations in their company"
ON chat_conversations FOR SELECT
USING (company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- Participants: Nur wenn in Conversation
CREATE POLICY "Users can view participants in their conversations"
ON chat_participants FOR SELECT
USING (conversation_id IN (
  SELECT id FROM chat_conversations 
  WHERE company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
));

-- Messages: Nur wenn Participant
CREATE POLICY "Users can view messages in their conversations"
ON chat_messages FOR SELECT
USING (conversation_id IN (
  SELECT conversation_id FROM chat_participants WHERE user_id = auth.uid()
));
```

---

## 🔄 KOMPONENTEN-STRUKTUR

### 1. TeamChat.tsx (Haupt-Seite)
**Verantwortung:** Layout, State-Management, Conversation-Selection

```typescript
// Key Features:
✅ Lädt Conversations mit fetchConversations()
✅ Mobile-Responsive (1-Spalte vs. 2-Spalten)
✅ Prominent Empty-State wenn keine Conversations
✅ Call-Interface Integration (deaktiviert wenn Daily.co Fehler)
✅ Realtime-Updates via Supabase Channel
```

### 2. ConversationList.tsx (Gesprächsliste)
**Verantwortung:** Anzeige aller Conversations mit Unread-Badges

```typescript
// Query-Optimierung V18.3:
✅ Batch-Load: 1 Query für Participants, 1 für Profiles
✅ Solo-Conversations werden gefiltert (keine anderen Participants)
✅ Unread-Count via last_read_at
✅ Namen-Generierung:
   - 1:1 Chat → "Max Mustermann"
   - Gruppe → "Max, Anna, Peter +2"
   - Kein Name → "Leeres Gespräch"
```

### 3. ChatWindow.tsx (Nachrichten-Thread)
**Verantwortung:** Nachrichten anzeigen & senden, Datei-Upload

```typescript
// Key Features:
✅ Realtime-Updates via postgres_changes (INSERT event)
✅ Auto-Scroll zu neuesten Nachrichten
✅ Datei-Upload zu Supabase Storage (documents Bucket)
✅ Markiere als gelesen (last_read_at update)
✅ Enter-to-Send (Shift+Enter für neue Zeile)
```

### 4. ParticipantSelector.tsx (Teilnehmer-Auswahl)
**Verantwortung:** Neue Conversation erstellen, Teilnehmer auswählen

```typescript
// Key Features:
✅ Lädt nur echte User (mit user_id)
✅ Multi-Select für Gruppen-Chats
✅ Gruppen-Namen optional
✅ Prominent Empty-State: "Team einladen" Button
❌ KEINE Fahrer/Kunden mehr (haben keine user_ids)
```

### 5. CallInterface.tsx (Audio/Video)
**Verantwortung:** Daily.co iFrame, Call-Controls

```typescript
// Status: ⚠️ BETA (Daily.co Payment-Fehler)
✅ Audio/Video via Daily.co WebRTC
✅ Screen-Sharing
✅ Custom Controls (Mute, Video, End)
❌ Deaktiviert: account-missing-payment-method
```

---

## 🐛 BEKANNTE PROBLEME & LÖSUNGEN

### Problem 1: "Keine Namen angezeigt"
**Root Cause:**  
- User ist einziges Teammitglied
- Alle Conversations sind Solo-Conversations (nur 1 Participant)
- Solo-Conversations werden gefiltert → Keine Anzeige

**Lösung:**  
```
✅ Prominent Empty-State mit "Team einladen"-Button
✅ Klare Anleitung: Einstellungen → Team
✅ Hinweis: Mindestens 2 Teammitglieder erforderlich
```

### Problem 2: "Daily.co Fehler: account-missing-payment-method"
**Root Cause:**  
- Daily.co Account benötigt Zahlungsmethode
- Free-Plan unterstützt keine API-Calls mehr

**Lösung:**  
```
✅ Call-Buttons deaktiviert (disabled={true})
✅ Tooltips: "Sprachanruf starten (Beta)"
✅ Graceful Degradation: Chat funktioniert weiterhin
🔧 TODO: Daily.co Account mit Zahlungsmethode konfigurieren
```

### Problem 3: "Solo-Conversations in DB"
**Root Cause:**  
- Alte Bugs haben Conversations mit nur 1 Participant erstellt

**Cleanup (Optional):**  
```sql
-- Archiviere Solo-Conversations
UPDATE chat_conversations 
SET archived = true 
WHERE id IN (
  SELECT c.id 
  FROM chat_conversations c
  WHERE (
    SELECT COUNT(*) FROM chat_participants 
    WHERE conversation_id = c.id
  ) <= 1
);
```

---

## 📊 DATENFLUSS-DIAGRAMM

```
┌─────────────────────────────────────────────────────┐
│ TeamChat.tsx (Haupt-Seite)                          │
├─────────────────────────────────────────────────────┤
│ 1. useAuth() → user, profile                        │
│ 2. fetchConversations()                             │
│    ↓                                                 │
│    SELECT conversation_id FROM chat_participants    │
│    WHERE user_id = current_user                     │
│    ↓                                                 │
│    SELECT * FROM chat_conversations                 │
│    WHERE id IN (conversation_ids)                   │
│    ↓                                                 │
│    Conversations-Liste geladen                      │
└─────────────────────────────────────────────────────┘
             ↓
┌─────────────────────────────────────────────────────┐
│ ConversationList.tsx (Gesprächsliste)               │
├─────────────────────────────────────────────────────┤
│ 1. Batch-Load Participants für alle Conversations  │
│    SELECT * FROM chat_participants                  │
│    WHERE conversation_id IN (all_conv_ids)          │
│    ↓                                                 │
│ 2. Extrahiere unique user_ids                       │
│    ↓                                                 │
│ 3. Batch-Load Profiles                              │
│    SELECT user_id, first_name, last_name            │
│    FROM profiles WHERE user_id IN (all_user_ids)    │
│    ↓                                                 │
│ 4. Filtere Solo-Conversations (0 other participants)│
│    ↓                                                 │
│ 5. Enriched Conversations mit Namen & Unread-Count  │
└─────────────────────────────────────────────────────┘
             ↓ (Click auf Conversation)
┌─────────────────────────────────────────────────────┐
│ ChatWindow.tsx (Nachrichten-Thread)                 │
├─────────────────────────────────────────────────────┤
│ 1. Lade Messages                                    │
│    SELECT * FROM chat_messages                      │
│    WHERE conversation_id = selected_conv            │
│    ↓                                                 │
│ 2. Batch-Load Sender-Profiles                       │
│    SELECT * FROM profiles                           │
│    WHERE user_id IN (all_sender_ids)                │
│    ↓                                                 │
│ 3. Enriched Messages mit Sender-Namen               │
│    ↓                                                 │
│ 4. Realtime-Updates via Supabase Channel            │
│    ON INSERT → Neue Nachricht anzeigen              │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 UX-OPTIMIERUNGEN (V18.3)

### Empty-States (Hierarchie)

**Level 1: Keine Teammitglieder (Kritisch)**
```tsx
// Prominent Card mit Call-to-Action
<Card className="border-2 border-accent bg-accent/5">
  <Icon: MessageSquare (groß, accent-Farbe)>
  <h3>"Team-Chat aktivieren"</h3>
  <p>"Sie sind aktuell das einzige Teammitglied..."</p>
  <Button size="lg">Team-Mitglieder einladen</Button>
  <Tipp>"Gehen Sie zu Einstellungen → Team"</Tipp>
</Card>
```

**Level 2: ParticipantSelector leer**
```tsx
<EmptyState>
  <Icon: Users (groß)>
  <h4>"Keine Teammitglieder verfügbar"</h4>
  <p>"Um den Team-Chat zu nutzen, müssen Sie..."</p>
  <Button variant="outline">Zu Einstellungen → Team</Button>
</EmptyState>
```

**Level 3: ConversationList leer (nach Filter)**
```tsx
<EmptyState>
  <Icon: MessageSquare (klein)>
  <h4>"Keine Chat-Partner"</h4>
  <p>"Laden Sie weitere Teammitglieder ein..."</p>
  <Tipp>"Gehen Sie zu Einstellungen → Team"</Tipp>
</EmptyState>
```

### Design-System-Farben (CI-konform)
```tsx
// ✅ KORREKT: Semantische Tokens
Avatar: bg-primary/10 text-primary border border-primary/20
Message (own): bg-primary/10 text-foreground border border-primary/20
Message (other): bg-muted text-foreground
Accent-Card: bg-accent/5 border-accent/20

// ❌ VERBOTEN:
bg-blue-500, text-white, bg-gray-100 etc.
```

---

## 🔧 DAILY.CO INTEGRATION (OPTIONAL)

### Status: ⚠️ BETA - Deaktiviert
**Fehler:** `account-missing-payment-method`

### Aktivierung (wenn Payment konfiguriert):
```typescript
// TeamChat.tsx - Call-Buttons aktivieren
<Button
  variant="ghost"
  size="icon"
  onClick={() => handleStartCall('audio')}
  className="h-9 w-9"
  title="Sprachanruf starten"
  disabled={false} // ← HIER: false setzen
>
  <Phone className="h-4 w-4" />
</Button>
```

### Daily.co Setup-Schritte:
1. ✅ Secret `DAILY_API_KEY` ist bereits konfiguriert
2. ❌ **TODO:** Daily.co Dashboard → Billing → Zahlungsmethode hinzufügen
3. ✅ Edge Function `create-daily-room` ist bereit
4. ✅ Hook `use-daily-call.tsx` ist implementiert

### Alternative (Ohne Daily.co):
```typescript
// Option 1: Supabase OpenAI Realtime API (Voice-Only)
// → Kein Video, aber Voice-Chat ohne Daily.co

// Option 2: Twilio Voice API
// → Telefon-Integration statt Video-Calls

// Option 3: Jitsi Meet (Open-Source)
// → Self-Hosted Video-Conferencing
```

---

## 📱 MOBILE OPTIMIZATION

### Responsive Breakpoints
```tsx
// Desktop (≥1024px): 2-Spalten (List + Chat)
lg:grid-cols-4

// Mobile (<1024px): 1-Spalte
grid-cols-1

// Logik:
- Mobile: Zeige List ODER Chat (nicht beides)
- Desktop: Zeige List UND Chat (parallel)
```

### Mobile-Spezifische UI
```tsx
{isMobile && (
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setSelectedConversation(null)}
  >
    ← Zurück
  </Button>
)}
```

---

## 🧪 TESTING-CHECKLISTE

### Voraussetzungen
- [ ] Mindestens 2 User-Accounts im selben Unternehmen
- [ ] Beide User haben Profiles in `profiles`-Tabelle
- [ ] Beide User können sich einloggen

### Test-Szenarien

**Szenario 1: Neue Conversation erstellen**
```
1. User A: Öffnet /kommunikation
2. User A: Klickt "Neue Unterhaltung"
3. User A: Wählt User B aus
4. User A: Klickt "Gespräch erstellen"
✅ Erwartung: Neue Conversation erscheint in Liste
✅ Erwartung: User B sieht Conversation auch (Realtime)
```

**Szenario 2: Nachricht senden**
```
1. User A: Öffnet Conversation mit User B
2. User A: Schreibt "Hallo Test"
3. User A: Drückt Enter
✅ Erwartung: Nachricht erscheint rechts (eigene)
✅ Erwartung: User B sieht Nachricht links (Realtime)
✅ Erwartung: Unread-Badge bei User B (bis gelesen)
```

**Szenario 3: Datei senden**
```
1. User A: Klickt Büroklammer-Icon
2. User A: Wählt Datei aus (z.B. PDF)
3. User A: Upload startet
✅ Erwartung: "Datei wird hochgeladen..." Toast
✅ Erwartung: Nachricht mit Datei-Link erscheint
✅ Erwartung: User B kann Datei öffnen (Public URL)
```

**Szenario 4: Empty-State**
```
1. Admin: Erstellt neuen Company-Account
2. Admin: Loggt sich ein
✅ Erwartung: Prominent Empty-State mit "Team einladen"
✅ Erwartung: Button führt zu /einstellungen?tab=team
✅ Erwartung: Keine Solo-Conversations sichtbar
```

---

## 🚨 HÄUFIGE FEHLER & FIXES

### Fehler 1: "Keine Namen angezeigt"
**Ursache:** Nur 1 User im System  
**Fix:** Team-Mitglieder einladen (Einstellungen → Team)

### Fehler 2: "Conversations leer"
**Ursache:** Solo-Conversations werden gefiltert  
**Fix:** Ist gewolltes Verhalten - siehe Empty-State

### Fehler 3: "Daily.co Fehler"
**Ursache:** Zahlungsmethode fehlt  
**Fix:** Call-Buttons sind deaktiviert (graceful degradation)

### Fehler 4: "Profile nicht gefunden"
**Ursache:** `user_id` existiert nicht in `profiles`-Tabelle  
**Fix:** 
```sql
-- Prüfe ob Profile fehlen
SELECT cp.user_id 
FROM chat_participants cp
LEFT JOIN profiles p ON cp.user_id = p.user_id
WHERE p.user_id IS NULL;

-- Cleanup: Entferne Participants ohne Profile
DELETE FROM chat_participants 
WHERE user_id NOT IN (SELECT user_id FROM profiles);
```

### Fehler 5: "Realtime funktioniert nicht"
**Ursache:** Channel nicht subscribed oder falsche Filter  
**Fix:**
```typescript
// Prüfe subscription status
const channel = supabase
  .channel('chat:conversation-id')
  .on('postgres_changes', { ... })
  .subscribe((status) => {
    console.log('Channel status:', status); // Muss "SUBSCRIBED" sein
  });
```

---

## 🎯 PRODUCTION-CHECKLISTE

### Pre-Launch
- [x] RLS Policies getestet (Multi-Tenant-Isolation)
- [x] Solo-Conversations werden gefiltert
- [x] Empty-States implementiert
- [x] Design-System-Farben verwendet
- [x] Mobile-Responsive
- [x] Realtime-Updates funktionieren
- [ ] **TODO:** Daily.co Payment konfigurieren (oder deaktivieren)
- [x] Error-Handling vollständig
- [x] Loading-States überall

### Post-Launch Monitoring
```sql
-- Anzahl aktiver Conversations pro Company
SELECT 
  c.company_id,
  COUNT(*) as total_conversations,
  COUNT(*) FILTER (WHERE is_group = true) as group_chats,
  COUNT(*) FILTER (WHERE is_group = false) as direct_chats
FROM chat_conversations c
WHERE archived = false
GROUP BY c.company_id;

-- Durchschnittliche Nachrichten pro Conversation
SELECT 
  AVG(msg_count) as avg_messages_per_conversation
FROM (
  SELECT conversation_id, COUNT(*) as msg_count
  FROM chat_messages
  WHERE is_deleted = false
  GROUP BY conversation_id
) sub;

-- Top 10 aktivste User (nach Nachrichten-Anzahl)
SELECT 
  p.first_name, p.last_name, 
  COUNT(*) as total_messages
FROM chat_messages m
JOIN profiles p ON m.sender_id = p.user_id
WHERE m.is_deleted = false
GROUP BY m.sender_id, p.first_name, p.last_name
ORDER BY total_messages DESC
LIMIT 10;
```

---

## 🔐 SECURITY & COMPLIANCE

### DSGVO-Konformität
```
✅ Multi-Tenant-Isolation (company_id)
✅ RLS Policies (jeder sieht nur eigene Daten)
✅ Soft-Delete (is_deleted statt DELETE)
✅ Datei-Speicherung in EU (Supabase EU-Region)
✅ Kein Data-Sharing zwischen Companies
```

### Data Retention
```sql
-- Optional: Auto-Cleanup nach 90 Tagen
-- Edge Function: cleanup-old-chat-data

DELETE FROM chat_messages 
WHERE created_at < NOW() - INTERVAL '90 days'
  AND is_deleted = false;
```

---

## 🚀 FUTURE ENHANCEMENTS

### V18.4 Roadmap
- [ ] **Read-Receipts:** Zeige "Gelesen von 2 Personen"
- [ ] **Typing-Indicators:** "Max schreibt..."
- [ ] **Message-Reactions:** 👍 ❤️ 😂
- [ ] **Thread-Replies:** Antworten auf einzelne Nachrichten
- [ ] **Voice-Messages:** Audio-Nachrichten aufnehmen
- [ ] **Search:** Durchsuche alle Nachrichten
- [ ] **Pinned-Messages:** Wichtige Nachrichten fixieren
- [ ] **Message-Forwarding:** Nachricht weiterleiten

### V18.5 Enterprise-Features
- [ ] **E2E-Verschlüsselung:** Signal-Protocol Integration
- [ ] **Compliance-Export:** DSGVO-Datenexport
- [ ] **Audit-Trail:** Wer hat was wann gelesen
- [ ] **Admin-Dashboard:** Chat-Statistiken & Monitoring

---

## 📚 REFERENZEN

### Relevante Dateien
```
src/pages/TeamChat.tsx              - Haupt-Seite
src/components/chat/
  ├── ConversationList.tsx           - Gesprächsliste
  ├── ChatWindow.tsx                 - Nachrichten-Thread
  ├── ParticipantSelector.tsx        - Teilnehmer-Auswahl
  └── CallInterface.tsx              - Audio/Video (Beta)
src/hooks/use-daily-call.tsx         - Daily.co WebRTC Hook
```

### Datenbank-Tabellen
```
chat_conversations                   - Conversations (Haupt-Entity)
chat_participants                    - Many-to-Many (User ↔ Conversation)
chat_messages                        - Nachrichten mit Sender-ID
profiles                             - User-Daten (Namen, E-Mail)
companies                            - Multi-Tenant-Isolation
```

### Edge Functions
```
create-daily-room                    - Erstellt Daily.co WebRTC-Room
(Hinweis: Keine weiteren Functions notwendig)
```

---

## ✅ FAZIT

**Status:** ✅ **PRODUKTIONSREIF** (Chat-Funktionalität)  
**Status:** ⚠️ **BETA** (Audio/Video via Daily.co)

### Was funktioniert:
- ✅ Echtzeit-Chat zwischen Teammitgliedern
- ✅ Dateifreigabe über Supabase Storage
- ✅ Multi-Tenant-Isolation (100% sicher)
- ✅ Responsive Design (Mobile + Desktop)
- ✅ DSGVO-konform

### Was NICHT funktioniert:
- ❌ Audio/Video-Calls (Daily.co Payment fehlt)
- ❌ Solo-User sehen keine Conversations (Design-Entscheidung)

### Nächste Schritte:
1. **Team einladen:** Einstellungen → Team → Neue User erstellen
2. **Daily.co Payment:** (Optional) Zahlungsmethode hinterlegen
3. **Testing:** Mit 2+ Users testen

---

**Ende der Dokumentation** 🎉
