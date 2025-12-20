Message Controller — Documentation

Overview

This file documents the public endpoints implemented by `src/controllers/message.controller.js`.
All routes expect the `requireAuth` middleware to run earlier so `req.user` is available.

Endpoints

1. GET /api/messages/contents

- Handler: `getAllContents`
- Purpose: Return a list of all users except the logged-in user (useful for listing chat targets).
- Auth: Required
- Response: 200 JSON array of users (fields exclude `password`).

2. GET /api/messages/:id

- Handler: `getMessageByUserId`
- Purpose: Return messages exchanged between the logged-in user and the user specified by `:id`.
- Params: `id` = the other user's id
- Auth: Required
- Response: 200 JSON array of `Message` documents, sorted chronologically.
- Notes: Use `.populate('senderId', 'fullName profileImage')` if you want sender details inline.

3. POST /api/messages/:id

- Handler: `sendMessage`
- Purpose: Send a message from the logged-in user to `:id`.
- Params: `id` = receiver id
- Body: JSON
  - `text` (optional): string message body
  - `image` (optional): data URL or remote URL accepted by Cloudinary
- Auth: Required
- Behavior:
  - If `image` present, uploads to Cloudinary and stores the returned `secure_url` in the `image` field of `Message`.
  - The message document stores `senderId`, `receiverId`, `text`, and `image`.
- Response: 201 with the created message document.

4. GET /api/messages/partners

- Handler: `getChatPartners`
- Purpose: Return a list of users that the logged-in user has exchanged messages with.
- Auth: Required
- Response: 200 JSON array of user documents (exclude `password`).

Implementation notes & tips

- `Message` model fields `senderId` and `receiverId` are ObjectId references to the `User` model. Use `populate()` to fetch full user objects.
- Cloudinary uploads expect the `image` body value to be a format supported by Cloudinary (data URL, remote URL, or file path). For direct file uploads from browsers, consider accepting `multipart/form-data` with `multer` and streaming to Cloudinary.
- Consider adding input validation (e.g. maximum text length, allowed image size/type) to prevent abuse.
- For real-time chat, integrate WebSockets (Socket.IO) to push new messages to connected clients rather than polling.

Examples

Send message (with text):

```bash
curl -X POST http://localhost:3000/api/messages/{RECEIVER_ID} \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello"}'
```

Get conversation:

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3000/api/messages/{OTHER_USER_ID}
```

Get chat partners:

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3000/api/messages/partners
```
