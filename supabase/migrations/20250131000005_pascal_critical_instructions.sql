-- ==================================================================================
-- PASCAL'S KRITISCHE ANWEISUNGEN - ABSOLUTE VORGABE
-- ==================================================================================
-- Erstellt: 2025-01-31
-- Zweck: Kritische Anweisungen von Pascal dauerhaft speichern
-- Autor: NeXify AI MASTER
-- ==================================================================================

-- Speichere Pascal's kritische Anweisungen in Master Memory

INSERT INTO nexify_master_memory (
  category,
  key,
  value,
  importance_score,
  confidence_score,
  source,
  tags
) VALUES
-- Anweisung 1: "Schließe meine Lücken"
(
  'rule',
  'pascal_close_gaps_instruction',
  '{
    "instruction": "Schließe meine Lücken",
    "meaning": "Schließe alle noch in Pascal''s Vorgaben gelassenen Lücken vollumfänglich. Bedenke autonom alle Abhängigkeiten. Finde schnellere und effektivere Gesamtlösungen. Denke systemweit, nicht nur bezogen auf Projektteile.",
    "rules": [
      "Vollumfänglich alle Lücken schließen",
      "Autonom alle Abhängigkeiten bedenken",
      "Schnellere/effektivere Gesamtlösungen finden",
      "Systemweit denken"
    ]
  }'::jsonb,
  1.0, -- KRITISCH
  1.0,
  'user',
  ARRAY['pascal', 'critical', 'rule', 'gap-closing']
),
-- Anweisung 2: Systemweites Denken
(
  'rule',
  'pascal_systemwide_thinking',
  '{
    "instruction": "Systemweites Denken",
    "meaning": "Stets systemweit denken, nicht nur bezogen auf Projektteile. Pascal und ich haben stets und zu jeder Zeit den Gesamtüberblick. Gesamt-Verständnis ist immer erforderlich.",
    "rules": [
      "Stets systemweit denken",
      "Gesamtüberblick stets behalten",
      "Gesamt-Verständnis immer haben",
      "Auswirkungen auf andere Bereiche prüfen"
    ]
  }'::jsonb,
  1.0, -- KRITISCH
  1.0,
  'user',
  ARRAY['pascal', 'critical', 'rule', 'systemwide']
),
-- Anweisung 3: Feste Werte aus Vorgaben
(
  'rule',
  'pascal_fixed_values',
  '{
    "instruction": "Feste Werte aus Vorgaben/Regeln/Verboten",
    "meaning": "Alle Aufgaben, Vorgaben, Regeln werden ausnahmslos mit den immer gleichen und festen Werten aus bekannten Vorgaben, Regeln und Verboten betrachtet. Logisch und vorausschauend. Bereits heute, dauerhaft auf hohem Anspruch.",
    "rules": [
      "Ausnahmslos feste Werte einhalten",
      "Design-System V28.1 / V32.1 immer einhalten",
      "DIN 5008 Formatierung immer einhalten",
      "Defensive Coding Standards immer einhalten",
      "RLS Policies immer einhalten",
      "Feature-Gating immer einhalten",
      "Alle Verbote immer einhalten",
      "Logisch und vorausschauend",
      "Hoher Anspruch, dauerhaft"
    ]
  }'::jsonb,
  1.0, -- KRITISCH
  1.0,
  'user',
  ARRAY['pascal', 'critical', 'rule', 'standards']
),
-- Anweisung 4: Eigenständige Vorschläge
(
  'rule',
  'pascal_autonomous_suggestions',
  '{
    "instruction": "Eigenständige Vorschläge ohne Nachfrage",
    "meaning": "Wichtige und Pascal aktuell entfallende und/oder noch wichtige Arbeiten eigenständig, ohne Nachfrage, in Präsentationen als optionale Lösung einbringen.",
    "rules": [
      "Wichtige entfallende Arbeiten finden",
      "Eigenständig vorschlagen, ohne Nachfrage",
      "In Präsentationen als optionale Lösung einbringen",
      "Direkt implementieren ODER als optionale Lösung vorschlagen"
    ]
  }'::jsonb,
  1.0, -- KRITISCH
  1.0,
  'user',
  ARRAY['pascal', 'critical', 'rule', 'autonomous']
)
ON CONFLICT (category, key) DO UPDATE SET
  value = EXCLUDED.value,
  importance_score = EXCLUDED.importance_score,
  updated_at = NOW();

-- Speichere auch in AI Agents Memory (für zukünftige Agenten)
INSERT INTO ai_agents_memory (
  agent_id,
  agent_name,
  memory_key,
  memory_value,
  category,
  importance_score
)
SELECT
  'nexify-master',
  'NeXify AI MASTER',
  key,
  value,
  category,
  importance_score
FROM nexify_master_memory
WHERE key IN (
  'pascal_close_gaps_instruction',
  'pascal_systemwide_thinking',
  'pascal_fixed_values',
  'pascal_autonomous_suggestions'
)
ON CONFLICT (agent_id, memory_key) DO UPDATE SET
  memory_value = EXCLUDED.memory_value,
  importance_score = EXCLUDED.importance_score,
  updated_at = NOW();

-- Kommentar
COMMENT ON TABLE nexify_master_memory IS 'Pascal''s kritische Anweisungen sind in Master Memory gespeichert mit importance_score = 1.0';






