import jwt from "jsonwebtoken";

/*
  Access token helper

  - Purpose: Create a signed JWT containing the `userId` and return it to callers.
  - Behavior: When a `res` (Express response) object is provided, the helper will
    set a `jwt` cookie with secure flags. The token is always returned so callers
    can also include it in JSON responses or set an Authorization header.

  Security notes:
  - The cookie is set with `httpOnly: true` to make it inaccessible to JS (mitigates XSS).
  - `sameSite: 'strict'` reduces CSRF risk for cross-site requests. Adjust if your
    frontend is on a different domain and you need to allow cross-site cookies.
  - Consider using a short-lived access token + refresh token setup for stronger security.
*/
export const generateToken = (userId, res = null) => {
  // Create JWT payload and sign it using secret from env
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // If an Express response object is provided, set the token as a cookie.
  // Returning the token allows the controller to also send it in JSON responses
  // when clients prefer to store it in memory or `localStorage` (not recommended).
  if (res) {
    res.cookie("jwt", token, {
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
  }
  return token;
};
