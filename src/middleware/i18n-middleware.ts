import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "id",
    preload: ["en", "id"], // bahasa yang tersedia
    backend: {
      loadPath: path.join(__dirname, "../locale/{{lng}}/translation.json"),
    },
    detection: {
      order: ["header", "query"],
      caches: false,
    },
  });

export const i18nMiddleware = middleware.handle(i18next);
