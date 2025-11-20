/* ==================================================================================
   DUAL DEVICE MOCKUP V31.0 - IPAD + IPHONE SIDE-BY-SIDE
   ==================================================================================
   ✅ Zeigt Dashboard-Content in 2 Devices gleichzeitig
   ✅ Responsive: side-by-side (Desktop) → stacked (Tablet) → hidden (Mobile)
   ✅ Ultra-HD rendering support
   ================================================================================== */

import { ReactNode } from "react";
import { V28iPadMockupHD } from "./V28iPadMockupHD";
import { IPhoneMockupHD } from "./IPhoneMockupHD";
import { cn } from "@/lib/utils";
import type { RenderingResolution } from "@/lib/rendering-quality";

interface DualDeviceMockupProps {
  dashboardContent: ReactNode;
  ipadTilt?: "left" | "right";
  iphoneTilt?: "left" | "right";
  layout?: "side-by-side" | "stacked";
  resolution?: RenderingResolution;
  className?: string;
}

export function DualDeviceMockup({
  dashboardContent,
  ipadTilt = "left",
  iphoneTilt = "right",
  layout = "side-by-side",
  resolution = "retina",
  className,
}: DualDeviceMockupProps) {
  return (
    <div
      className={cn(
        "hidden md:flex gap-8 items-center justify-center",
        layout === "side-by-side" ? "lg:flex-row flex-col" : "flex-col",
        className
      )}
    >
      {/* iPad Mockup (größer) */}
      <div className="w-full lg:w-[60%] md:w-[80%] max-w-2xl">
        <V28iPadMockupHD tiltDirection={ipadTilt} resolution={resolution}>
          {dashboardContent}
        </V28iPadMockupHD>
      </div>

      {/* iPhone Mockup (kleiner, rechts daneben) */}
      <div className="w-full lg:w-[35%] md:w-[50%] max-w-md">
        <IPhoneMockupHD tiltDirection={iphoneTilt} resolution={resolution}>
          <div className="scale-[0.8] origin-top">{dashboardContent}</div>
        </IPhoneMockupHD>
      </div>
    </div>
  );
}
