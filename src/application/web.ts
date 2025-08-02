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

export const web = express();

// Optional, boleh aktifkan helmet tapi longgarkan untuk gambar
web.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS global (boleh tetap ada)
web.use(
  cors({
    origin: "*", // frontend kamu
    credentials: true,
  })
);

web.use(i18nMiddleware);
web.use(express.json());
// web.use(limiter); // boleh aktifkan kalau perlu

// ✅ CORS KHUSUS UNTUK GAMBAR
web.use(
  "/api/public/images",
  cors({
    origin: "*",
    methods: ["GET"],
  }),
  express.static(path.join(__dirname, "..", "..", "public", "images"))
);

// ✅ Cek di terminal kalau gambar diminta
web.use("/api/public/images", (req, res, next) => {
  console.log(">> Mengirim gambar:", req.url);
  next();
});

// ROUTER
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
