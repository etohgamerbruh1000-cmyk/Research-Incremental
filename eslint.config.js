import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
// import eslintConfigPrettier from "eslint-config-prettier/flat"; // Optional safety net

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "*.min.js",
      "vendor/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["*.{js,mjs,cjs,ts}", "**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },

    rules: {
      // Turn off core ESLint rules that conflict with TypeScript
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
      "no-undef": "off",

      // Variables and declarations
      "no-var": "error",
      "prefer-const": "error",
      "no-const-assign": "error",

      // Common bug prevention
      "no-unreachable": "error",
      "no-constant-condition": "warn",
      "no-self-assign": "error",
      "no-self-compare": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-fallthrough": "error",
      "no-redeclare": "error",
      "no-shadow": "warn",

      // Safer comparisons and conditions
      eqeqeq: ["error", "always"],
      "no-implicit-coercion": "warn",
      "no-unsafe-negation": "error",
      "valid-typeof": "error",

      // Functions and control flow
      "consistent-return": "warn",
      "no-return-await": "error",
      "no-useless-return": "warn",
      "no-useless-call": "warn",
      "no-useless-concat": "warn",

      // Objects and arrays
      "no-prototype-builtins": "error",
      "no-array-constructor": "error",
      "no-new-object": "error",
      "object-shorthand": "warn",

      // Debugging
      "no-debugger": "error",
      "no-alert": "warn",
      "no-console": "off",

      // Modern JavaScript (non-formatting)
      "prefer-template": "warn",
      "prefer-arrow-callback": "warn",
    },
  },
  // eslintConfigPrettier,
);
