import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { chatRouter } from "./routes/chat";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const frontendPort = process.env.VITE_DEV_SERVER_PORT || "8080";
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  `http://localhost:${frontendPort}`,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use("/api/chat", chatRouter);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);

    if (err.message === "Not allowed by CORS") {
      return res.status(403).json({
        error: "CORS policy violation",
        message: "Origin not allowed",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

export default app;
