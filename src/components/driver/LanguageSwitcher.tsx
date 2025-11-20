/* ==================================================================================
   LANGUAGE SWITCHER - DRIVER APP
   ==================================================================================
   Phase 3.3: Multi-Sprach-Support
   - Sprachen: DE, TR, AR, RO
   - Dropdown mit Flaggen
   - RTL-Support für Arabisch
   ================================================================================== */

import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/compat";
import { Globe } from "lucide-react";
import { useEffect } from "react";

const LANGUAGES = [
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // Apply RTL for Arabic
  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("preferred-language", langCode);
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue>
          {currentLanguage.flag} {currentLanguage.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
