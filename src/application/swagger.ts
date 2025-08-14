import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "node:path";

export const setupSwagger = (app: Express) => {
  const swaggerDocument = YAML.load(
    path.join(__dirname, "..", "..", "docs", "open-api.yaml")
  );

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
