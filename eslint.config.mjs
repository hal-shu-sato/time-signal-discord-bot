import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "commonjs",
    },
  },
  {
    files: ["*.mjs"],
    languageOptions: {
      sourceType: "module",
    },
  },
  eslintConfigPrettier,
];
