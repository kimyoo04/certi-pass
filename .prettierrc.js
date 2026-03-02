/** @type {import("prettier").Config} */
export default {
  trailingComma: "all",
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  printWidth: 100,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  // Import 정렬 설정
  importOrder: [
    "^react(-dom)?$",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/components/(.*)$",
    "^@/pages/(.*)$",
    "^@/stores/(.*)$",
    "^@/hooks/(.*)$",
    "^@/utils/(.*)$",
    "^@/lib/(.*)$",
    "^@/data/(.*)$",
    "^@/types/(.*)$",
    "^@/constants$",
    "",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx"],
  importOrderTypeScriptVersion: "5.9.3",
  tailwindFunctions: ["clsx", "cva", "cn"],
  tailwindAttributes: ["class", "className"],
};
