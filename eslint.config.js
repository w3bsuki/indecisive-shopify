import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ESLint 9 Flat Config with Next.js compatibility
const eslintConfig = [
  // Apply to all JS, JSX, TS, TSX files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  
  // Extend Next.js configurations using FlatCompat
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript"
  ),
  
  // Global configuration
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  
  // Custom rules for production readiness
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn", // Allow any but warn
      
      // React specific rules
      "react/no-unescaped-entities": "warn", // Allow but warn for JSX entities
      
      // Performance optimizations
      "@next/next/no-img-element": "warn", // Encourage Image component usage
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "tailwind.config.ts", // Tailwind config can be less strict
    ],
  },
];

export default eslintConfig;