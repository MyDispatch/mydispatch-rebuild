/* ==================================================================================
   USE CONTENT HOOK - ZUGRIFF AUF ZENTRALE TEXTE
   ==================================================================================
   ✅ Type-Safe Content-Zugriff
   ✅ Autocomplete in IDE
   ==================================================================================
   NUTZUNG: const { nav, buttons } = useContent();
   ================================================================================== */

import { content } from "@/lib/content/de-DE";
import type { Content } from "@/lib/content/types";

export function useContent(): Content {
  return content;
}

// Helper: Direkter Zugriff auf Subcategories
export function useNav() {
  return content.nav;
}

export function useStatus() {
  return content.status;
}

export function useMetrics() {
  return content.metrics;
}

export function useButtons() {
  return content.buttons;
}

export function useForm() {
  return content.form;
}

export function useErrors() {
  return content.errors;
}

export function useSuccess() {
  return content.success;
}

export function useEmptyStates() {
  return content.emptyStates;
}

export function useTime() {
  return content.time;
}

export function useCommon() {
  return content.common;
}

export function useDashboard() {
  return content.dashboard;
}

export function useComingSoon() {
  return content.comingSoon;
}
