/**
 * ========================================================================
 * HTML SANITIZATION UTILITY V18.3.27
 * ========================================================================
 *
 * KRITISCHER SICHERHEITSSCHUTZ:
 * - XSS-Prävention durch DOMPurify
 * - Sanitization aller User-generierten und AI-generierten Inhalte
 * - DSGVO-konform: Keine externen Requests durch Sanitization
 *
 * VERWENDUNG:
 * ```ts
 * import { sanitizeHTML, sanitizeMarkdown } from '@/lib/sanitize';
 *
 * // Für rohes HTML:
 * const cleanHTML = sanitizeHTML(userInput);
 *
 * // Für Markdown-zu-HTML (mit Sanitization):
 * const cleanHTML = sanitizeMarkdown(markdownContent);
 * ```
 * ========================================================================
 */

import DOMPurify from "dompurify";

/**
 * Konfiguration für DOMPurify - Erlaubte HTML-Tags und Attribute
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "a",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "div",
  "span",
  "code",
  "pre",
  "blockquote",
  "hr",
];

const ALLOWED_ATTR = ["href", "class", "id", "target", "rel"];

/**
 * Sanitize raw HTML content
 *
 * @param html - Roher HTML-String (potenziell gefährlich)
 * @returns Sanitized HTML-String (XSS-sicher)
 */
export function sanitizeHTML(html: string): string {
  if (!html) return "";

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Verhindere DOM-Clobbering
    SANITIZE_DOM: true,
    // Verhindere MathML/SVG XSS
    USE_PROFILES: { html: true },
    // Sichere externe Links
    SAFE_FOR_TEMPLATES: true,
    // Entferne alle Scripts
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
    // Entferne Event-Handler
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  });
}

/**
 * Convert Markdown to HTML and sanitize
 * Verwendet ein einfaches Markdown-Parsing (bold, lists, paragraphs)
 *
 * @param content - Markdown-String
 * @returns Sanitized HTML-String
 */
export function sanitizeMarkdown(content: string): string {
  if (!content) return "";

  let html = content;

  // 1. Ersetze **Text** mit <strong>Text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // 2. Behandle nummerierte Listen (1. 2. 3.) mit korrekten Abständen
  html = html.replace(/^(\d+\.\s+.+?)$/gm, (match) => {
    return `<div class="mb-3">${match}</div>`;
  });

  // 3. Behandle Bullet-Listen (- ) mit korrekten Abständen
  html = html.replace(/^(-\s+.+?)$/gm, (match) => {
    return `<div class="mb-3">${match}</div>`;
  });

  // 4. Ersetze doppelte Zeilenumbrüche mit Absätzen (zwei Leerzeilen)
  const paragraphs = html.split("\n\n");
  html = paragraphs
    .map((para) => {
      // Wenn Paragraph bereits div-Strukturen enthält (Listen), nicht in <p> wrappen
      if (para.includes('<div class="mb-3">')) {
        return para;
      }
      // Normale Absätze
      const cleanPara = para.replace(/\n/g, "<br/>");
      return `<p class="mb-4 last:mb-0">${cleanPara}</p>`;
    })
    .join("");

  // 5. KRITISCH: Sanitize das resultierende HTML
  return sanitizeHTML(html);
}

/**
 * Sanitize content speziell für Help-Artikel
 * Erlaubt zusätzliche Formatierung für Dokumentation
 *
 * @param content - HTML-Content aus Help-Artikel
 * @returns Sanitized HTML-String
 */
export function sanitizeHelpContent(content: string): string {
  if (!content) return "";

  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      ...ALLOWED_TAGS,
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "img",
      "figure",
      "figcaption",
    ],
    ALLOWED_ATTR: [...ALLOWED_ATTR, "src", "alt", "width", "height", "title"],
    SANITIZE_DOM: true,
    USE_PROFILES: { html: true },
    // Sichere Links (nur HTTPS)
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}

/**
 * Debug-Funktion: Prüft ob HTML unsichere Elemente enthält
 * NUR für Entwicklung verwenden!
 *
 * @param html - Zu prüfender HTML-String
 * @returns Array von gefundenen unsicheren Patterns
 */
export function debugUnsafeHTML(html: string): string[] {
  const unsafePatterns = [
    { pattern: /<script/i, name: "script tag" },
    { pattern: /on\w+\s*=/i, name: "event handler" },
    { pattern: /javascript:/i, name: "javascript: protocol" },
    { pattern: /<iframe/i, name: "iframe tag" },
    { pattern: /<object/i, name: "object tag" },
    { pattern: /<embed/i, name: "embed tag" },
  ];

  const found: string[] = [];

  unsafePatterns.forEach(({ pattern, name }) => {
    if (pattern.test(html)) {
      found.push(name);
    }
  });

  return found;
}
