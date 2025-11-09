import js from "@eslint/js";
import ts from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default ts.config(
  {
    ignores: ["dist", "node_modules"],
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...ts.configs.recommendedTypeChecked, prettier],
    languageOptions: {
      parserOptions: {
        project: true,
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": hooks,
      import: importPlugin
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",
      "import/order": [
        "warn",
        {
          groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"], "object"],
          "newlines-between": "always"
        }
      ]
    }
  }
);
