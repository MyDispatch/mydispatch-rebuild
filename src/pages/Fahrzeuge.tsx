/* ==================================================================================
   REDIRECT: Fahrzeuge → Fahrer (Tab)
   ==================================================================================
   Fahrzeuge sind jetzt in Fahrer integriert (Tab-Navigation)
   Diese Seite leitet automatisch auf /fahrer?tab=fahrzeuge um
   
   ✅ V5.0 OPT 2: Validation-Hooks entfernt (nur Redirect, kein Rendering)
   ================================================================================== */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Fahrzeuge() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/fahrer?tab=fahrzeuge", { replace: true });
  }, [navigate]);

  return null; // Kein UI nötig für Redirect
}
