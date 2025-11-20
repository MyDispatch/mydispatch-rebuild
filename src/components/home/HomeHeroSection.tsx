/* ==================================================================================
   HOME HERO SECTION V28.1
   ================================================================================== */

import { Rocket, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { V28HeroPremium } from "@/components/hero/V28HeroPremium";
import { PremiumDashboardContent } from "@/components/dashboard/PremiumDashboardContent";
import { BRANCHEN_TEXTS } from "@/lib/content/branchen-texts";

export const HomeHeroSection = () => {
  const navigate = useNavigate();
  const commonTexts = BRANCHEN_TEXTS.common;

  return (
    <V28HeroPremium
      variant="home"
      backgroundVariant="3d-premium"
      badge={{ text: commonTexts.hero.badge, icon: Rocket }}
      title={commonTexts.hero.headline}
      subtitle={commonTexts.hero.subheadline}
      description={`${commonTexts.hero.description} MyDispatch – simply arrive.`}
      primaryCTA={{
        label: "Jetzt starten",
        onClick: () => navigate("/auth?mode=signup"),
        icon: BadgeCheck,
      }}
      showPWAButton={true}
      visual={<PremiumDashboardContent pageType="home" />}
      businessMetrics={[
        { label: "Unternehmen", value: "450+", sublabel: "vertrauen uns" },
        { label: "Fahrzeuge", value: "12.000+", sublabel: "täglich online" },
        { label: "Effizienz", value: "+35%", sublabel: "durchschnittlich" },
      ]}
      trustElements={true}
    />
  );
};

export default HomeHeroSection;
