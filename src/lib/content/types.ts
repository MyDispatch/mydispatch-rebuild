/* ==================================================================================
   CONTENT TYPES - TYPESCRIPT-TYPEN FÜR CONTENT-MANAGEMENT
   ==================================================================================
   ✅ Type-Safe Content-Zugriff
   ✅ Autocomplete in IDE
   ==================================================================================*/

import { content } from "./de-DE";

export type Content = typeof content;

export type ContentKey = keyof Content;

export type NavKey = keyof Content["nav"];
export type StatusKey = keyof Content["status"];
export type MetricsKey = keyof Content["metrics"];
export type ButtonsKey = keyof Content["buttons"];
export type FormKey = keyof Content["form"];
export type ErrorsKey = keyof Content["errors"];
export type SuccessKey = keyof Content["success"];
export type EmptyStatesKey = keyof Content["emptyStates"];
export type TimeKey = keyof Content["time"];
export type CommonKey = keyof Content["common"];
export type DashboardKey = keyof Content["dashboard"];
export type ComingSoonKey = keyof Content["comingSoon"];
