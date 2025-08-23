import dotenv from "dotenv";
import { web } from "@/application/web";
import { logger } from "./application/logging";

dotenv.config();

web.listen(3001, "0.0.0.0", () => {
  logger.info(`Server running on http://localhost:3001`);
});
