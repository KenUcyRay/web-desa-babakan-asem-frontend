import dotenv from "dotenv";
import { web } from "@/application/web";
import { logger } from "./application/logging";

dotenv.config();

web.listen(4000, "0.0.0.0", () => {
  logger.info(`Server running on http://192.168.1.6:4000`);
  logger.info(`Accessible from network: http://192.168.1.6:4000`);
});
