const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = [
  {
    ignores: ["**/__tests__/"],
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        ...globals.node, // Add Node.js globals
        ...globals.jest, // Add Jest globals
      },
    },
  },
  pluginJs.configs.recommended,
];
