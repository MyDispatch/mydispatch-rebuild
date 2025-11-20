import { Home, FileText, Users, Car, MoreHorizontal } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DESIGN_TOKENS } from "@/lib/design-system/design-tokens";
import { designTokens } from "@/config/design-tokens";

const navItems = [
  { label: "Home", url: "/dashboard", icon: Home },
  { label: "Aufträge", url: "/auftraege", icon: FileText },
  { label: "Kunden", url: "/kunden", icon: Users },
  { label: "Fahrer", url: "/fahrer", icon: Car },
  { label: "Mehr", url: "/mobile-menu", icon: MoreHorizontal },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      style={{
        height: "64px",
        backgroundColor: DESIGN_TOKENS.colors.background,
        borderTop: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
      }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.url ||
            (item.url === "/dashboard" && location.pathname === "/");
          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center touch-manipulation",
                "transition-all"
              )}
              style={{
                gap: DESIGN_TOKENS.spacing.xs,
                padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.md}`,
                borderRadius: DESIGN_TOKENS.radius.md,
                minWidth: "60px",
                minHeight: "44px", // WCAG Touch Target
                backgroundColor: isActive ? `${designTokens.colors.slate[100]}` : "transparent",
                transitionDuration: DESIGN_TOKENS.motion.duration.default,
              }}
              onTouchStart={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = `${designTokens.colors.slate[50]}`;
                }
              }}
              onTouchEnd={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <IconComponent
                className="transition-colors"
                style={{
                  width: "20px",
                  height: "20px",
                  color: isActive
                    ? designTokens.colors.slate[900]
                    : DESIGN_TOKENS.colors.text.tertiary,
                }}
              />
              <span
                className="font-medium transition-colors"
                style={{
                  fontSize: "10px",
                  color: isActive
                    ? designTokens.colors.slate[900]
                    : DESIGN_TOKENS.colors.text.tertiary,
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
