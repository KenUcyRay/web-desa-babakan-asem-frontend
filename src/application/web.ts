// web.ts - Perbaikan konfigurasi CORS dan middleware
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorMiddleware } from "@/middleware/error-middleware";
import { privateRouter } from "@/router/private-router";
import { limiter } from "@/application/limiter";
import { karangTarunaRouter } from "@/router/karang-taruna-router";
import { bpdRouter } from "@/router/bpd-router";
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
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Pastikan cookieParser dipasang SEBELUM CORS dan middleware lain
web.use(cookieParser());
web.use(express.json());

web.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, postman, etc.)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4000",
        "http://192.168.1.6:3000",
        "http://192.168.1.6:4000",
        "http://192.168.1.6:5173",
        "http://192.168.1.6:5500",
        "http://192.168.1.6:8080",
        "http://127.0.0.1:5500",
        "http://192.168.1.21:3000",
        "http://192.168.1.21:5173",
        "http://192.168.1.21:8080",
        "http://192.168.1.21:4000",
      ];

      if (allowedOrigins.indexOf(origin) !== -1) {
        console.log(`✅ CORS allowed for origin: ${origin}`);
        callback(null, true);
      } else {
        console.log(`❌ CORS blocked for origin: ${origin}`);
        callback(null, true); // Allow for development
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "Accept-Language",
      "X-Requested-With",
    ],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

web.use(i18nMiddleware);

// Middleware untuk debug requests
web.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} from ${req.get("origin")}`);
  console.log(`🍪 Cookies received:`, req.cookies);
  console.log(`📋 Headers - Cookie:`, req.headers.cookie);
  console.log(`📋 Headers - Origin:`, req.headers.origin);

  // Set headers yang diperlukan untuk cookie cross-origin
  res.header("Access-Control-Allow-Credentials", "true");

  // Untuk preflight requests
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,PATCH,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,Cookie,Accept-Language,X-Requested-With"
    );
    return res.status(204).end();
  }

  next();
});

web.use(
  "/api/public/images",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://192.168.1.6:3000",
      "http://192.168.1.6:4000",
      "http://192.168.1.21:3000",
      "http://192.168.1.21:5173",
    ],
    credentials: true,
    methods: ["GET"],
  }),
  express.static(path.join(__dirname, "..", "..", "public", "images"))
);

web.use("/api/public/images", (req, res, next) => {
  console.log(">> Mengirim gambar:", req.url);
  next();
});

// Serve test file
web.get("/test-cookie.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "test-cookie.html"));
});

// Test endpoint untuk cookie
web.get("/api/test-cookie", (req, res) => {
  console.log("🧪 Test cookie endpoint accessed");
  console.log("🍪 Cookies received:", req.cookies);

  // Set test cookie
  res.cookie("test", "value123", {
    httpOnly: false, // false untuk testing
    secure: false,
    sameSite: "lax",
    maxAge: 60000, // 1 menit
    path: "/",
  });

  res.json({
    message: "Cookie test",
    cookiesReceived: req.cookies,
    origin: req.headers.origin,
  });
});

web.use("/api", publicRouter);
web.use("/api/private", privateRouter);
web.use("/api/admin", adminRouter);

web.use((req, res) => {
  res.status(404).json({ errors: "Not Found" });
});

web.use(errorMiddleware);
