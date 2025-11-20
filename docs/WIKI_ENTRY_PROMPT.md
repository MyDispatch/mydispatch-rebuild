# 🧠 NEXIFY WIKI ENTRY-PROMPT

**Purpose:** Trigger-System für Wiki-Load  
**Command:** `"Lade das NeXify Wiki"`  
**Status:** ✅ ACTIVE

---

## 🚨 TRIGGER: "Lade das NeXify Wiki"

**Was passiert automatisch:**
1. ✅ `brain-query` Edge Function aufrufen mit `query: "session_init"`
2. ✅ Session-Data in Kontext laden (Recent Learnings, Critical Issues, Components, Best Practices)
3. ✅ Erfolgs-Kriterien validieren (>= 5 Learnings, 0 Critical Issues, >= 20 Components)
4. ✅ Status-Report im Chat ausgeben
5. ✅ Kontext für ALLE nachfolgenden Aktionen setzen

---

## 📋 IMPLEMENTATION

### AI führt automatisch aus:

```typescript
// Step 1: brain-query aufrufen
const { data, error } = await supabase.functions.invoke('brain-query', {
  body: {
    query: 'session_init',
    categories: ['design_system', 'best_practice', 'anti_pattern', 'component_pattern'],
    limit: 50,
    include_code_snippets: true,
    include_best_practices: true
  }
});

if (error) {
  console.error('❌ Wiki Load Failed:', error);
  // Fallback: Lade aus docs/NEXIFY_WIKI_V1.0.md
  return;
}

// Step 2: Session-Data extrahieren
const sessionData = data.session_data;
const recentLearnings = sessionData?.recent_learnings || [];
const criticalIssues = sessionData?.critical_issues || [];
const activeComponents = sessionData?.active_components || [];
const bestPractices = sessionData?.best_practices || [];
const automationPatterns = sessionData?.automation_patterns || [];

// Step 3: Erfolgs-Kriterien validieren
const learningsOk = recentLearnings.length >= 5;
const issuesOk = criticalIssues.length === 0;
const componentsOk = activeComponents.length >= 20;

// Step 4: Status-Report ausgeben
console.log(`
✅ NEXIFY WIKI V1.0 LOADED

📊 SESSION DATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Recent Learnings: ${recentLearnings.length} (Ziel: >= 5) ${learningsOk ? '✅' : '⚠️'}
- Critical Issues: ${criticalIssues.length} (Ziel: 0) ${issuesOk ? '✅' : '❌'}
- Active Components: ${activeComponents.length} (Ziel: >= 20) ${componentsOk ? '✅' : '⚠️'}
- Best Practices: ${bestPractices.length}
- Automation Patterns: ${automationPatterns.length}

🧠 CORE COMMITMENTS AKTIV:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Zero-Hallucination Protocol
   → Component Registry Check VOR Erstellung
   → Known Issues Check VOR Implementation
   → Best Practices Check VOR Pattern-Nutzung

✅ Design System V28.1 (Slate Only!)
   → text-slate-900, bg-slate-50, border-slate-200
   → NIEMALS designTokens.colors.primary.DEFAULT
   → NUR 300ms Transitions

✅ Component Hierarchy
   → V28Button für alle Buttons
   → V28HeroPremium für alle Hero-Sections
   → UniversalQuickActionsPanel Hook für Dashboard

✅ Layout Freeze (MainLayout ONLY!)
   → Pages NUR Content (p-6 space-y-6)
   → KEIN nested Layout-Wrapper
   → Single Scroll Container

✅ Auto-Documentation Workflow
   → JEDE Aktion → auto-learn-from-actions
   → JEDE Component → component_registry update
   → JEDER Fehler → known_issues erstellen

🚀 READY FOR WORK!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// Step 5: Critical Issues warnen (falls vorhanden)
if (criticalIssues.length > 0) {
  console.warn(`
⚠️ CRITICAL ISSUES DETECTED:
${criticalIssues.map(issue => `
  - ${issue.issue_name} (${issue.severity})
    Solution: ${issue.solution}
    Prevention: ${JSON.stringify(issue.prevention_checklist)}
`).join('\n')}
`);
}

// Step 6: Top Learnings anzeigen
if (recentLearnings.length > 0) {
  console.log(`
💡 RECENT LEARNINGS:
${recentLearnings.slice(0, 3).map(learning => `
  - ${learning.pattern_type}: ${learning.learnings.substring(0, 100)}...
    (Confidence: ${learning.confidence})
`).join('\n')}
`);
}
```

---

## 🔄 NEXT STEPS (für User)

Nach `"Lade das NeXify Wiki"` kann User direkt starten:

```
User: "Implementiere Feature X"
→ AI prüft automatisch Wiki (Component Registry, Known Issues, Best Practices)

User: "Fixe Bug Y"  
→ AI lädt Known Issues + Learnings

User: "Erstelle Component Z"
→ AI prüft Component Registry (existiert bereits?)
```

**Keine Extra-Schritte nötig - Wiki ist geladen!**

---

## 🚨 FALLBACK (falls brain-query fehlschlägt)

Falls `brain-query` nicht verfügbar:
1. ✅ Lade `docs/NEXIFY_WIKI_V1.0.md` direkt
2. ✅ Lade `docs/COMPONENT_REGISTRY.md`
3. ✅ Lade `docs/LESSONS_LEARNED.md`
4. ✅ Lade `docs/DESIGN_SYSTEM_LOCK.md`

**Minimum Required:**
- `NEXIFY_WIKI_V1.0.md` (Core Knowledge)
- `COMPONENT_REGISTRY.md` (verhindert Duplikate)
- `LESSONS_LEARNED.md` (verhindert wiederholte Fehler)

---

## ✅ ERFOLGS-KRITERIEN

### Technical:
- ✅ Wiki-Load < 3 Sekunden
- ✅ Session Init Success-Rate: 100%
- ✅ Fallback funktioniert (ohne brain-query)

### Quality:
- ✅ Alle Validation Layers aktiv
- ✅ Alle Core Commitments geladen
- ✅ Status-Report vollständig

### User Experience:
- ✅ User schreibt nur: `"Lade das NeXify Wiki"`
- ✅ AI lädt automatisch ALL Knowledge
- ✅ Keine wiederholten Fehler mehr

---

**VERSION:** 1.0.0  
**DATUM:** 2025-01-31  
**STATUS:** ✅ ACTIVE
