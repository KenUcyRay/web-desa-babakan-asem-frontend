import dotenv from "dotenv";
import { web } from "@/application/web";
import { logger } from "./application/logging";

dotenv.config();

const port = process.env.PORT ?? "3000";

web.listen(port, () => {
  logger.info(`Litening at port ${port}`);
});
