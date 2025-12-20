import { isSpoofedBot } from "@arcjet/inspect";
import aj from "../db/arcjet.js";

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);
    // If the decision indicates the request is denied, return the proper response
    if (decision.isDenied()) {
      // Rate limit denial -> 429
      if (
        decision.reason &&
        typeof decision.reason.isRateLimit === "function" &&
        decision.reason.isRateLimit()
      ) {
        return res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
      }

      // Bot denial -> 403
      if (
        decision.reason &&
        typeof decision.reason.isBot === "function" &&
        decision.reason.isBot()
      ) {
        return res.status(403).json({ message: "Bot Access denied." });
      }

      // Any other denial -> 403
      return res.status(403).json({
        message: "Access denied due to suspicious activity.",
      });
    }

    // If not denied, continue but still check for spoofed bot signals in results
    if (decision.results && decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed Bot Detected",
        message: "Malicious bot activity detected. Access denied.",
      });
    }

    // Allowed: proceed to next middleware/handler
    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
