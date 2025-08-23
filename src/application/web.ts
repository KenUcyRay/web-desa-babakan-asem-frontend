// src/application/web.ts - Perbaikan untuk akses lintas perangkat
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorMiddleware } from "@/middleware/error-middleware";
import { privateRouter } from "@/router/private-router";
import { limiter } from "@/application/limiter";
import { publicRouter } from "@/router/public-router";
import { adminRouter } from "@/router/admin-router";
import { i18nMiddleware } from "@/middleware/i18n-middleware";
import path from "node:path";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./swagger";

export const web = express();

// web.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//     crossOriginOpenerPolicy: false,
//     crossOriginEmbedderPolicy: false,
//   })
// );

// Pastikan cookieParser dipasang SEBELUM CORS dan middleware lain
web.use(
  cors({
    origin: ["http://192.168.1.10:3000", "http://localhost:3000"],
    credentials: true,
  })
);
web.use(cookieParser());
web.use(express.json());

// Middleware untuk validasi bahasa dan i18n
web.use(i18nMiddleware);

// Static files dengan CORS yang lebih permissive
web.use(
  "/api/public/images",
  express.static(path.join(__dirname, "..", "..", "public", "images"))
);

// API routes
web.use("/api", publicRouter);
web.use("/api/private", privateRouter);
web.use("/api/admin", adminRouter);

if (process.env.NODE_ENV === "development") {
  setupSwagger(web);
}

// 404 handler
web.use((req, res) => {
  res.status(404).json({ errors: "Not Found" });
});

// Error handler
web.use(errorMiddleware);
