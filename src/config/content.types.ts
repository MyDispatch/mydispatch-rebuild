/* ==================================================================================
   CONTENT TYPES - Type Definitions für Content System
   ==================================================================================
   Zentrale Type-Definitionen für wiederverwendbare Content-Strukturen
   ================================================================================== */

import type { LucideIcon } from "lucide-react";

// ==================================================================================
// BASIC TYPES
// ==================================================================================

export interface ContentBlock {
  id: string;
  title: string;
  description?: string;
  content?: string;
}

export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

export interface Action {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

// ==================================================================================
// COMPONENT TYPES
// ==================================================================================

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: Link;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  quote: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  highlighted?: boolean;
  cta: Action;
}

// ==================================================================================
// SECTION TYPES
// ==================================================================================

export interface HeroSection {
  headline: string;
  subheadline: string;
  description: string;
  badges?: string[];
  primaryCTA: string;
  secondaryCTA?: string;
  image?: string;
  video?: string;
}

export interface CTASection {
  headline: string;
  description: string;
  primaryButton: string;
  secondaryButton?: string;
  background?: "primary" | "secondary" | "gradient";
}

export interface StatsSection {
  headline?: string;
  stats: Array<{
    label: string;
    value: string;
    suffix?: string;
  }>;
}

// ==================================================================================
// PAGE TYPES
// ==================================================================================

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface PageContent {
  meta: PageMeta;
  hero?: HeroSection;
  sections: ContentBlock[];
}
