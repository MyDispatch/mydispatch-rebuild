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

      // ✅ CODEPILOT V33.4: TypeScript Quality Rules (PRODUCTION STRICT)
      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "error", // ⚠️ STRICT: Enforce proper types
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/ban-ts-comment": ["error", {
        "ts-expect-error": "allow-with-description",
        "ts-ignore": true,
        "ts-nocheck": true,
        "minimumDescriptionLength": 10
      }],
      "@typescript-eslint/consistent-type-imports": ["warn", {
        "prefer": "type-imports",
        "fixStyle": "separate-type-imports",
        "disallowTypeAnnotations": false
      }],
      "@typescript-eslint/no-non-null-assertion": "warn", // ⚠️ Discourage ! assertions
      "@typescript-eslint/no-unnecessary-condition": "off", // Requires parserOptions.project
      "@typescript-eslint/prefer-nullish-coalescing": "off", // Requires parserOptions.project
      "@typescript-eslint/prefer-optional-chain": "off", // Requires parserOptions.project

      // ✅ CODEPILOT V33.4: React Best Practices
      "react-hooks/exhaustive-deps": "error", // ⚠️ STRICT: Enforce dependency arrays
      "react-hooks/rules-of-hooks": "error",

      // ✅ CODEPILOT V33.4: Code Quality (Production Standards)
      "no-console": ["error", { "allow": ["warn", "error", "info"] }], // ⚠️ STRICT: No debug logs
      "no-debugger": "error", // ⚠️ STRICT: No debugger statements
      "prefer-const": "error", // ⚠️ STRICT: Immutability preference
      "no-var": "error",
      "eqeqeq": ["error", "always", { "null": "ignore" }], // ⚠️ STRICT: === only
      "no-throw-literal": "error", // ⚠️ STRICT: Only throw Error objects
      "no-return-await": "error", // ⚠️ STRICT: Avoid redundant return await

      // ✅ CODEPILOT V33.4: Design System Enforcement
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
  // ⚠️ CODEPILOT V33.4: Relaxed Rules for Test Files
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "tests/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Tests: error → warn (mocking needs any)
      "@typescript-eslint/no-unused-vars": "warn", // Tests: error → warn (test scaffolding)
      "@typescript-eslint/no-empty-function": "off", // Tests: Allow empty mocks
      "no-console": "off", // Tests: Allow console in tests
    }
  },
  // ⚠️ CODEPILOT V33.4: Relaxed Rules for Edge Functions (Deno Runtime)
  {
    files: ["supabase/functions/**/*.ts"],
    rules: {
      "no-console": "off", // Edge Functions: Allow console.log for Supabase logs
      "@typescript-eslint/no-explicit-any": "warn", // Edge Functions: Warn on any (external APIs)
      "@typescript-eslint/no-non-null-assertion": "off", // Edge Functions: Env vars often non-null
      "@typescript-eslint/no-unused-vars": "warn", // Edge Functions: Warn instead of error
    }
  }
);
