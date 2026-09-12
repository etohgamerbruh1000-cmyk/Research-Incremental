import js from "@eslint/js";
import globals from "globals";

export default [
  {
    // These paths are now relative to the tools/ directory
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

  {
    files: ["**/*.js", "**/*.mjs"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node, // Added Node.js globals so 'process', 'module', etc. don't error out
      },
    },

    rules: {
      // Variables and declarations
      "no-var": "error",
      "prefer-const": "error",
      "no-const-assign": "error",
      "no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],

      // Common bug prevention
      "no-undef": "error",
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

      // Modern JavaScript
      "prefer-template": "warn",
      "prefer-arrow-callback": "warn",
      "arrow-spacing": ["error", { before: true, after: true }],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],

      // Semicolons and quotes
      semi: ["error", "always"],
      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],

      // Formatting kept relatively light
      indent: [
        "warn",
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: "first",
          outerIIFEBody: 0,
          MemberExpression: 1,
        },
      ],
    },
  },
];
