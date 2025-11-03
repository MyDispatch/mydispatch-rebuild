-- ============================================================================
-- SUPABASE BEST PRACTICES: V28 HERO DESIGN RULES
-- ============================================================================
-- Datum: 2025-01-30
-- Kategorie: Design System, Hero Components
-- Priorität: CRITICAL
-- ============================================================================

-- INSERT INTO best_practices (category, practice, code_example, tags, rationale)
-- VALUES (...)

-- ============================================================================
-- BEST PRACTICE #1: MAX 2 BUTTONS PRO HERO
-- ============================================================================

INSERT INTO best_practices (
  category,
  practice,
  code_example,
  tags,
  rationale
) VALUES (
  'hero_max_2_buttons',
  'V28HeroPremium: MAX 2 BUTTONS pro Hero! Primary CTA + ENTWEDER Secondary CTA ODER PWA Button. NIEMALS beide gleichzeitig! UX Best Practice: Zu viele CTAs verwirren User und reduzieren Conversion.',
  E'<!-- ✅ RICHTIG -->\n<V28HeroPremium\n  primaryCTA={{ label: "Jetzt starten", onClick: ... }}\n  showPWAButton={true}\n/>\n\n<!-- ❌ FALSCH - 3 Buttons! -->\n<V28HeroPremium\n  primaryCTA={...}\n  secondaryCTA={...}\n  showPWAButton={true}\n/>',
  ARRAY['hero', 'buttons', 'ux', 'conversion', 'v28'],
  'UX Best Practice: 2 CTAs = klare Hierarchie. 3+ CTAs = Verwirrung, reduzierte Click-Through-Rate. Studien zeigen: Jeder zusätzliche Button reduziert Conversion um ~15%.'
);

-- ============================================================================
-- BEST PRACTICE #2: EINHEITLICHE ICON-BACKGROUNDS (bg-slate-50)
-- ============================================================================

INSERT INTO best_practices (
  category,
  practice,
  code_example,
  tags,
  rationale
) VALUES (
  'hero_icon_background_standard',
  'Dashboard KPI-Cards: ALLE Icon-Container MÜSSEN bg-slate-50 verwenden! Keine bunten Backgrounds (bg-blue-50, bg-green-50, etc.) außer für Status-Badges. Icon-Color: text-slate-700 (Standard).',
  E'<!-- ✅ RICHTIG - Einheitlich -->\n<div className="p-1.5 rounded-lg bg-slate-50">\n  <FileText className="w-4 h-4 text-slate-700" />\n</div>\n\n<!-- ❌ FALSCH - Bunte Backgrounds -->\n<div className="p-1.5 rounded-lg bg-blue-50">\n  <FileText className="w-4 h-4 text-blue-600" />\n</div>',
  ARRAY['hero', 'dashboard', 'icons', 'design_system', 'v28'],
  'V28.1 Design System: Professional Minimalism mit Slate-Palette. Bunte Icon-Backgrounds wirken unprofessionell und lenken ab. Einheitliche bg-slate-50 = Fokus auf Inhalte, nicht auf Farben. Exception: Status-Badges (Live/Erledigt/Geplant) dürfen Farben haben.'
);

-- ============================================================================
-- KNOWN ISSUE #1: 3 BUTTONS IM HERO (GELÖST)
-- ============================================================================

INSERT INTO known_issues (
  issue_type,
  description,
  severity,
  tags,
  solution,
  prevention_checklist,
  resolved
) VALUES (
  'hero_3_buttons_violation',
  'V28HeroPremium erlaubte gleichzeitig secondaryCTA + showPWAButton, was zu 3 Buttons im Hero führte. Home.tsx hatte: Primary CTA + Secondary CTA + PWA Button = UX-Chaos, reduzierte Conversion.',
  'critical',
  ARRAY['hero', 'buttons', 'ux', 'conversion'],
  E'✅ MAX 2 BUTTONS Regel etabliert:\n- V28HeroPremium Interface mit Warnkommentaren versehen\n- Home.tsx, Features.tsx, Demo.tsx: secondaryCTA entfernt\n- Dokumentation: docs/V28_HERO_DESIGN_RULES.md erstellt\n- Validation-Checklisten definiert',
  ARRAY[
    '✅ grep -A 5 "secondaryCTA" src/pages/*.tsx | grep -A 2 "showPWAButton" → MUSS 0 Treffer haben!',
    '✅ Jeder Hero hat max 2 Buttons (Primary + PWA ODER Secondary)',
    '✅ Interface V28HeroPremiumProps hat Warnkommentare bei secondaryCTA und showPWAButton',
    '✅ Dokumentation V28_HERO_DESIGN_RULES.md existiert und ist aktuell'
  ],
  true  -- ✅ GELÖST am 2025-01-30
);

-- ============================================================================
-- KNOWN ISSUE #2: INKONSISTENTE ICON-BACKGROUNDS (GELÖST)
-- ============================================================================

INSERT INTO known_issues (
  issue_type,
  description,
  severity,
  tags,
  solution,
  prevention_checklist,
  resolved
) VALUES (
  'hero_inconsistent_icon_backgrounds',
  'V28TaxiDashboardPreview: KPI-Cards hatten verschiedenfarbige Icon-Backgrounds (Aufträge: bg-blue-50, Umsatz: bg-green-50, Fahrer/Fahrzeuge: bg-slate-50). Inkonsistent, nicht V28.1-konform, zu bunt.',
  'high',
  ARRAY['hero', 'dashboard', 'icons', 'design_system', 'v28'],
  E'✅ Einheitlicher Standard etabliert: bg-slate-50 für ALLE Icon-Container\n- V28TaxiDashboardPreview: Aufträge/Umsatz Icon-BG → bg-slate-50\n- Icon-Colors standardisiert: text-slate-700\n- Dokumentation: V28_HERO_DESIGN_RULES.md - Section "Icon-Background-Standard"\n- Exception definiert: Status-Badges dürfen Farben haben',
  ARRAY[
    '✅ grep -r "bg-blue-50\\|bg-green-50\\|bg-red-50" src/components/hero/V28TaxiDashboardPreview.tsx → MUSS 0 Treffer haben (außer Status-Badges)!',
    '✅ grep -r "bg-slate-50" src/components/hero/V28TaxiDashboardPreview.tsx → MUSS 4 Treffer haben (KPI-Cards)',
    '✅ Alle KPI-Icon-Colors sind text-slate-700',
    '✅ Exception-Regel dokumentiert: Status-Badges dürfen bg-green-100, bg-slate-200, bg-blue-50 nutzen'
  ],
  true  -- ✅ GELÖST am 2025-01-30
);

-- ============================================================================
-- VALIDATION QUERIES
-- ============================================================================

-- Prüfen: Wurden die Best Practices korrekt eingefügt?
-- SELECT * FROM best_practices WHERE category LIKE 'hero_%' ORDER BY created_at DESC LIMIT 5;

-- Prüfen: Wurden die Known Issues korrekt dokumentiert?
-- SELECT * FROM known_issues WHERE resolved = true AND issue_type LIKE 'hero_%' ORDER BY created_at DESC LIMIT 5;

-- ============================================================================
-- ENDE DER BEST PRACTICES & KNOWN ISSUES DOKUMENTATION
-- ============================================================================
