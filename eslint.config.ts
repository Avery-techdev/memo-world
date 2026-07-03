import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },
  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
  ...pluginVue.configs["flat/recommended"],
  ...vueTsEslintConfig(),
  {
    name: "app/rules",
    rules: {
      // Guidelines: `any` is forbidden
      "@typescript-eslint/no-explicit-any": "error",
      // Guidelines: no unused imports/variables
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  skipFormatting,
];
