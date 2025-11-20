/* ==================================================================================
   DIALOG LAYOUT UTILS V18.3.24 - ZENTRALE LÖSUNG GEGEN ABSCHNEIDEN
   ==================================================================================
   Verhindert abgeschnittene Dialoge durch konsistente Layout-Patterns
   ================================================================================== */

/**
 * Standard Dialog-Layout-Klassen (IMMER verwenden!)
 * Verhindert Abschneiden durch korrektes Flexbox-Layout
 */
export const DIALOG_LAYOUT = {
  // Dialog Content (Outer Container)
  content: "flex flex-col max-h-[90vh]", // ZWINGEND: flex-col + max-h

  // Dialog Header (Fixed Top)
  header: "flex-shrink-0 px-6 pt-6 pb-4", // NIEMALS flex-1 oder flex-grow

  // Dialog Body (Scrollable Middle)
  body: "flex-1 overflow-y-auto px-6 py-4", // ZWINGEND: flex-1 + overflow-y-auto

  // Dialog Footer (Fixed Bottom)
  footer: "flex-shrink-0 px-6 py-4", // NIEMALS flex-1 oder flex-grow
} as const;

/**
 * ScrollArea-Wrapper für Dialog-Body (Alternative zu overflow-y-auto)
 * ⚠️ WARNUNG: ScrollArea funktioniert nicht zuverlässig mit Flexbox-Layouts!
 * EMPFEHLUNG: Verwende DIALOG_LAYOUT.body (natives overflow-y-auto) statt ScrollArea
 */
export const DIALOG_SCROLL_AREA = {
  wrapper: "flex-1", // ZWINGEND: flex-1 damit es Platz nimmt
  viewport: "px-6 py-4", // Padding hier, nicht auf ScrollArea
} as const;

/**
 * Validiert Dialog-Layout (Dev-Only)
 */
export const validateDialogLayout = (element: HTMLElement): boolean => {
  if (!import.meta.env.DEV) return true;

  const content = element.querySelector('[role="dialog"]');
  if (!content) return false;

  const styles = window.getComputedStyle(content);

  // Check: flex-col vorhanden?
  if (styles.flexDirection !== "column") {
    // Dev-only warning - no logger needed for layout checks
    return false;
  }

  // Check: max-height gesetzt?
  if (!styles.maxHeight || styles.maxHeight === "none") {
    // Dev-only info - no logger needed
  }

  return true;
};

/**
 * Anti-Pattern-Checkliste (NIEMALS verwenden!)
 */
export const DIALOG_ANTI_PATTERNS = {
  // ❌ VERBOTEN auf DialogContent:
  forbiddenContentClasses: [
    "h-full", // → Verwende max-h-[90vh]
    "overflow-hidden", // → Nur wenn kein Scrolling nötig
  ],

  // ❌ VERBOTEN auf Header/Footer:
  forbiddenFixedClasses: [
    "flex-1", // → Verwende flex-shrink-0
    "flex-grow", // → Verwende flex-shrink-0
    "overflow-y-auto", // → Nur auf Body
  ],

  // ❌ VERBOTEN auf Body:
  forbiddenBodyClasses: [
    "flex-shrink-0", // → Verwende flex-1
    "h-full", // → Verwende flex-1
  ],
} as const;

/**
 * Beispiel-Usage (Copy-Paste-Template)
 */
export const DIALOG_TEMPLATE = `
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="${DIALOG_LAYOUT.content}">
    {/* Header (Fixed Top) */}
    <DialogHeader className="${DIALOG_LAYOUT.header}">
      <DialogTitle>Titel</DialogTitle>
      <DialogDescription>Beschreibung</DialogDescription>
    </DialogHeader>

    {/* Body (Scrollable) - EMPFOHLEN: Native Scroll */}
    <div className="${DIALOG_LAYOUT.body}">
      {/* Content hier */}
    </div>

    {/* Footer (Fixed Bottom) */}
    <div className="${DIALOG_LAYOUT.footer}">
      <Button>Action</Button>
    </div>
  </DialogContent>
</Dialog>

// ⚠️ ScrollArea NICHT EMPFOHLEN (funktioniert nicht zuverlässig mit Flexbox)
// Nur verwenden wenn unbedingt nötig
`;
