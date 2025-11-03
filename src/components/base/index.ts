/* ==================================================================================
   BASE COMPONENTS EXPORT - ZENTRALE WIEDERVERWENDBARE KOMPONENTEN
   ==================================================================================
   ✅ SafeIcon - CI-konforme Icons (erzwingt text-foreground)
   ✅ EnhancedCard - Konsistente Cards mit Design-Tokens
   ✅ Typography - Deutsche Standards (Heading, Body, Label, Metric)
   ✅ MetricDisplay - Zahlen-Anzeige (ersetzt Badge-Missbrauch)
   ✅ Skeleton - Einheitliche Loading-States
   ✅ ErrorBoundary - Fehlerbehandlung
   ✅ EmptyState - Standardisierte Empty-States
   ================================================================================== */

// Icon Component
export { SafeIcon, createSafeIcon, validateIconElement } from './SafeIcon';

// Card Components
export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
} from './EnhancedCard';

// Typography Components
export {
  Heading,
  Body,
  Label,
  Caption,
  Metric,
  Link,
} from './Typography';

// Metric Display
export {
  MetricDisplay,
  MetricGrid,
} from './MetricDisplay';

// Loading States
export {
  Skeleton,
  SkeletonGroup,
  SkeletonCard,
  SkeletonTable,
} from './Skeleton';

// Error Handling
export {
  ErrorBoundary,
  ErrorFallback,
} from './ErrorBoundary';

// Empty States
export {
  EmptyState,
  EmptyTableState,
} from './EmptyState';
