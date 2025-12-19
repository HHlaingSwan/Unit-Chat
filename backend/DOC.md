Access Token (JWT) — Documentation

Overview

This backend issues JSON Web Tokens (JWTs) as access tokens to authenticate users. Tokens contain the authenticated user's id and are signed using `process.env.JWT_SECRET`.

Where the token is provided

- Cookie: The server sets a cookie named `jwt` (httpOnly, sameSite=strict) when `generateToken(userId, res)` is called with an Express `res` object. Browsers will include this cookie automatically for same-site requests.
- JSON response: The controllers (`signUp` and `signIn`) return an `accessToken` in the JSON response. This is useful for non-browser clients or when the client prefers to store the token and send it in an `Authorization` header.

Token generation

- Helper: `src/db/util.js` -> `generateToken(userId, res = null)`
  - Signs a token containing `{ userId }` with expiry `15d`.
  - If `res` is provided, sets the `jwt` cookie with `httpOnly: true` and `sameSite: 'strict'`.
  - Always returns the token string so the caller can include it in responses or logs.

Token verification

- Middleware: `src/middleware/auth.middleware.js` -> `requireAuth`
  - Checks for token in this order:
    1. `req.cookies.jwt` (cookie-based)
    2. `Authorization` header with format `Bearer <token>` (header-based)
  - Verifies token with the JWT secret and loads the user from DB (excluding `password`).
  - Attaches `req.user` on success, otherwise returns `401 Unauthorized`.

Client usage examples

1. Using cookies (browser)

- After sign-in, the server sets a `jwt` cookie automatically. Subsequent requests from the browser will include the cookie for same-site routes.

2. Using Authorization header (API / mobile / fetch with manual header)

- Example fetch after receiving `accessToken` in JSON response:

```javascript
fetch("/api/protected", {
  method: "GET",
  headers: {
    Authorization: "Bearer " + accessToken,
  },
});
```

3. curl example (header-based)

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3000/api/protected
```

Security recommendations

- Prefer cookie-based auth with `httpOnly` cookies for browser clients to mitigate XSS.
- For single-page apps on a different domain than the API, you may need to adjust `sameSite` and set `secure` and `domain` flags. Be careful: cross-site cookies may require CSRF protections.
- For mobile or third-party clients, prefer header-based tokens (`Authorization: Bearer`) and avoid persisting tokens in insecure storage.
- Consider splitting tokens into short-lived access tokens and longer-lived refresh tokens for improved security.
- Always use HTTPS in production to protect tokens in transit.

Testing steps

1. Start backend:

```bash
cd backend
npm install
npm run dev
```

2. Sign up (example):

```bash
curl -i -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Alice","email":"alice@example.com","password":"secret123"}'
```

- Inspect response JSON for `accessToken` and check response `Set-Cookie` header for `jwt`.

3. Sign in (example):

```bash
curl -i -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

- Inspect `accessToken` and cookie as above.

Notes

- This documentation complements inline comments in `src/db/util.js`, `src/controllers/auth.controller.js`, and `src/middleware/auth.middleware.js`.
- If you want, I can add refresh token support, rotate secrets, or implement CSRF protections next.
