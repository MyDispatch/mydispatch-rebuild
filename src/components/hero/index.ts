/* ==================================================================================
   HERO COMPONENTS INDEX V32.0 - LOCKED
   ==================================================================================
   ✅ NUR V28HeroPremium erlaubt
   ✅ NUR V28Hero3DBackgroundPremium für Backgrounds
   ✅ Design-System V32.0: Gesperrt und validiert
   ================================================================================== */

// V32.0: EINZIGE erlaubte Hero-Komponente
export { V28HeroPremium } from './V28HeroPremium';

// V32.0: EINZIGER erlaubter Background (wird automatisch von V28HeroPremium verwendet)
export { V28Hero3DBackgroundPremium } from './V28Hero3DBackgroundPremium';

// Device Mockups (behalten, werden intern verwendet)
export { V28iPadMockup } from './V28iPadMockup';
export { V28iPadMockupHD } from './V28iPadMockupHD';
export { IPhoneMockupHD } from './IPhoneMockupHD';
export { DualDeviceMockup } from './DualDeviceMockup';

// Types
export type { RenderingResolution } from '@/lib/rendering-quality';

/* ==================================================================================
   ARCHIVIERTE KOMPONENTEN (V32.0)
   ==================================================================================
   Die folgenden Komponenten wurden archiviert und sollten nicht mehr verwendet werden:
   - V28HeroWithLiveDashboard → Nutze V28HeroPremium
   - HeroIpadShowcase → Nutze V28HeroPremium
   - V28Hero3DBackground → Nutze V28Hero3DBackgroundPremium
   - V28Hero3DBackgroundClean → Nutze V28Hero3DBackgroundPremium
   - V28Hero3DBackgroundWhiteZones → Nutze V28Hero3DBackgroundPremium
   - V28HeroBackground → Nutze V28Hero3DBackgroundPremium
   - HeroBackgroundOrbs → Nutze V28Hero3DBackgroundPremium
   
   Siehe: docs/DESIGN_SYSTEM_LOCK.md
   ================================================================================== */
