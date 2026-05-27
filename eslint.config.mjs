import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Downgrade stylistic Next.js rules to warnings so CI gates on real bugs only.
    // These flag legitimate patterns (static <a href="/">, setState inside an
    // effect for localStorage restore, in-component comments). Documented here
    // rather than silently in code.
    rules: {
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react/no-unescaped-entities": "warn",
      "react/jsx-no-comment-textnodes": "warn",
    },
  },
]);

export default eslintConfig;
