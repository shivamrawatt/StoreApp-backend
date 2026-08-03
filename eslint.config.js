const js = require("@eslint/js");
const globals = require("globals");
const jest = require("eslint-plugin-jest");

module.exports = [
  js.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
  {
  files: ["tests/**/*.test.js"],

  plugins: {
    jest,
  },

  languageOptions: {
    globals: {
      ...jest.environments.globals.globals,
    },
  },

  rules: {},
},
];