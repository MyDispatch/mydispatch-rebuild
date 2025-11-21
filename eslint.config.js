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

      // ✅ CODEPILOT TASK 1: TypeScript Quality Rules
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn", // Warn on 'any' usage
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/consistent-type-imports": ["warn", {
        "prefer": "type-imports",
        "fixStyle": "separate-type-imports"
      }],

      // ✅ CODEPILOT TASK 1: React Best Practices
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // ✅ CODEPILOT TASK 1: Code Quality
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "warn",
      "prefer-const": "warn",
      "no-var": "error",

      // ✅ CODEPILOT TASK 2: Design System Enforcement
      "no-restricted-imports": ["error", {
        "patterns": [
          {
            "group": ["**/*V26*", "**/*v26*"],
            "message": "⛔ V26-Components sind deprecated!\n   Nutze V28-Components aus @/components/ui/*.\n   Ausnahme nur für explizite Backward Compatibility.\n   Migration Guide: docs/V28_MIGRATION_GUIDE.md"
          }
        ]
      }]
    },
  },
);
