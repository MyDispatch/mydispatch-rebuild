/* ==================================================================================
   I18N CONFIGURATION - MULTI-LANGUAGE SUPPORT
   ==================================================================================
   Phase 3.3: Multi-Sprach-Support für Fahrer
   - Sprachen: DE, TR (Türkisch), AR (Arabisch), RO (Rumänisch)
   - Fallback auf Deutsch
   ================================================================================== */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import de from "./translations/de.json";
import tr from "./translations/tr.json";
import ar from "./translations/ar.json";
import ro from "./translations/ro.json";

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    tr: { translation: tr },
    ar: { translation: ar },
    ro: { translation: ro },
  },
  lng: "de", // Default language
  fallbackLng: "de",
  interpolation: {
    escapeValue: false, // React already escapes
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
