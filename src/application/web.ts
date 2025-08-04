import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorMiddleware } from "@/middleware/error-middleware";
import { privateRouter } from "@/router/private-router";
import { limiter } from "@/application/limiter";
import { karangTarunaRouter } from "@/router/karang-taruna-router";
import { bpdRouter } from "@/router/bpd-router";
import { bumdesRouter } from "@/router/bumdes-router";
import { pkkRouter } from "@/router/pkk-router";
import { contributorRouter } from "@/router/contributor-router";
import { publicRouter } from "@/router/public-router";
import { adminRouter } from "@/router/admin-router";
import { i18nMiddleware } from "@/middleware/i18n-middleware";
import path from "node:path";
import cookieParser from "cookie-parser";

export const web = express();

web.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

web.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

web.use(i18nMiddleware);
web.use(express.json());
web.use(cookieParser());

web.use(
  "/api/public/images",
  cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
  }),
  express.static(path.join(__dirname, "..", "..", "public", "images"))
);

web.use("/api/public/images", (req, res, next) => {
  console.log(">> Mengirim gambar:", req.url);
  next();
});

web.use("/api", publicRouter);
web.use("/api/private", privateRouter);
web.use("/api/admin", adminRouter);
// web.use("/api/karang-taruna", karangTarunaRouter);
// web.use("/api/bpd", bpdRouter);
// web.use("/api/bumdes", bumdesRouter);
// web.use("/api/pkk", pkkRouter);
// web.use("/api/contributor", contributorRouter);

web.use((req, res) => {
  res.status(404).json({ errors: "Not Found" });
});

web.use(errorMiddleware);
