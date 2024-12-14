import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslint from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  eslint.configs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/consistent-type-definitions": "error",
      "react/react-in-jsx-scope": "off",
    },
  }
);
