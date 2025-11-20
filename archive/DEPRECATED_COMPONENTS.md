# DEPRECATED COMPONENTS (V32.0)

## Archiviert am: 2025-10-31

### Hero-Komponenten

| Komponente               | Grund              | Ersatz                     |
| ------------------------ | ------------------ | -------------------------- |
| V28HeroWithLiveDashboard | Wrapper, redundant | V28HeroPremium             |
| HeroIpadShowcase         | Alte Architektur   | V28HeroPremium             |
| HeroBackgroundOrbs       | Custom BG          | V28Hero3DBackgroundPremium |

### Background-Komponenten

| Komponente                    | Grund     | Ersatz                     |
| ----------------------------- | --------- | -------------------------- |
| V28Hero3DBackground           | Redundant | V28Hero3DBackgroundPremium |
| V28Hero3DBackgroundClean      | Redundant | V28Hero3DBackgroundPremium |
| V28Hero3DBackgroundWhiteZones | Redundant | V28Hero3DBackgroundPremium |
| V28HeroBackground             | Zu simpel | V28Hero3DBackgroundPremium |

### CSS-Utilities

- `.bg-gradient-radial` → Tailwind `bg-gradient-to-r` etc.
- `.text-gradient` → Tailwind Gradients
- `.hero-dark-overlay` → Entfernt (doppelt definiert)

## Migration-Beispiel

### Alt (V28HeroWithLiveDashboard)

```tsx
<V28HeroWithLiveDashboard pageType="terms" customTitle="Titel" />
```

### Neu (V28HeroPremium)

```tsx
<V28HeroPremium
  variant="features"
  backgroundVariant="3d-premium"
  title="Titel"
  visual={<PremiumDashboardContent pageType="terms" />}
/>
```
