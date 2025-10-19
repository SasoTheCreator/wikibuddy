import express from "express";
import { AnthropicService } from "../services/anthropic";

const router = express.Router();

// Create service instance lazily to ensure environment variables are loaded
let anthropicService: AnthropicService | null = null;

const getAnthropicService = () => {
  if (!anthropicService) {
    anthropicService = new AnthropicService();
  }
  return anthropicService;
};

// POST /api/chat/message - Send a message to Anthropic
router.post("/message", async (req, res) => {
  try {
    const { messages, context } = req.body;

    // Validate request body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Bad request",
        message: "Messages array is required",
      });
    }

    // Get service instance
    const service = getAnthropicService();

    // Call Anthropic API through our service
    const response = await service.sendMessage(messages, context);

    res.json(response);
  } catch (error: any) {
    console.error("Chat API error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    // Handle specific Anthropic API errors
    if (error.message.includes("API key")) {
      return res.status(401).json({
        error: "Authentication failed",
        message: "Invalid API key",
      });
    }

    if (
      error.message.includes("quota") ||
      error.message.includes("rate limit")
    ) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
      });
    }

    if (error.message.includes("model")) {
      return res.status(400).json({
        error: "Invalid model",
        message: "The specified model is not available",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Failed to process chat message",
    });
  }
});

// GET /api/chat/health - Check if Anthropic service is working
router.get("/health", async (req, res) => {
  try {
    const service = getAnthropicService();
    const isHealthy = await service.checkHealth();
    res.json({
      status: isHealthy ? "healthy" : "unhealthy",
      service: "anthropic",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      service: "anthropic",
      error: "Service unavailable",
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as chatRouter };
