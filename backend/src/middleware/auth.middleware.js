import jwt from "jsonwebtoken";
import { envConfig } from "../db/env.js";
import User from "../models/user.model.js";

/*
  `requireAuth` middleware

  - Purpose: Protect routes by validating the access token and attaching the
    authenticated user to `req.user`.
  - Token sources checked (in order):
    1. `req.cookies.jwt` (cookie-based authentication)
    2. `Authorization` header in the form `Bearer <token>` (header-based auth)

  - If a valid token is present and corresponds to an existing user, the user object
    (without `password`) is attached to `req.user` and `next()` is called.
  - If the token is missing, invalid, expired, or the user cannot be found, a
    401 Unauthorized response is returned.

  Notes:
  - Using cookies with `httpOnly` is safer against XSS, but requires CSRF protections
    (or SameSite settings) for cross-site requests. Header-based tokens avoid some
    CSRF issues but need secure client storage to avoid XSS risks.
*/
export const requireAuth = async (req, res, next) => {
  // Prefer cookie (browser flows), fallback to Authorization header for API clients
  const cookieToken = req.cookies && req.cookies.jwt;
  const authHeader = req.headers && req.headers.authorization;
  const headerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  const token = cookieToken || headerToken;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET); // Verify token
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Unauthorized - User not found" });
    }
    // Attach user to request object for further use in protected routes
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in requireAuth:", error);
    next();
  }
};
