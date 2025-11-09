import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      
      // ✅ PHASE 17: Pragmatische ESLint-Konfiguration
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn", // Warning statt Error
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      
      "no-restricted-imports": ["error", {
        "patterns": [
          {
            "group": ["**/unified-design-tokens*"],
            "message": "⛔ UNIFIED_DESIGN_TOKENS ist deprecated!\n   Nutze Tailwind slate-* classes.\n   Migration Guide: docs/V28_MIGRATION_GUIDE.md"
          },
          {
            "group": ["**/*V26*", "**/*v26*"],
            "message": "⛔ V26-Components sind deprecated!\n   Nutze V28-Components aus @/components/ui/*.\n   Ausnahme nur für explizite Backward Compatibility.\n   Migration Guide: docs/V28_MIGRATION_GUIDE.md"
          }
        ]
      }]
    },
  },
);
