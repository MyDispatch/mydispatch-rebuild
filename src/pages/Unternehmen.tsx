/* ==================================================================================
   V18.3: Unternehmen-Seite - REDIRECT ZU EINSTELLUNGEN
   ==================================================================================
   Diese Seite wurde in /einstellungen konsolidiert (Tab "Unternehmen")
   Redirect für bestehende Bookmarks und Links
   ================================================================================== */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unternehmen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect zu Einstellungen-Tab "Unternehmen"
    navigate("/einstellungen?tab=company", { replace: true });
  }, [navigate]);

  return null;
};

export default Unternehmen;
