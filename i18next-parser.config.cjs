module.exports = {
  locales: ["id", "en"],
  defaultNamespace: "translation",
  output: "src/locales/$LOCALE/translation.json",
  input: ["src/**/*.{js,jsx,ts,tsx}"],
  useKeysAsDefaultValue: true,
  createOldCatalogs: false,
  lexers: {
    jsx: ["JsxLexer"],
    tsx: ["JsxLexer"],
  },
};
