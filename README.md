# Unit-Chat

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) featuringSocket.IO for instant messaging, JWT authentication, and image sharing capabilities.

## Project Structure

```
Unit-Chat/
├── backend/                 # Express.js server
│   └── src/
│       ├── controllers/     # Request handlers
│       ├── db/              # Database & service configurations
│       ├── emails/          # Email templates & handlers
│       ├── middleware/      # Auth, file upload, security middleware
│       ├── models/          # Mongoose schemas
│       ├── routes/          # API route definitions
│       ├── socket/          # Socket.IO configuration
│       └── server.js        # Entry point
├── frontend/                # React + TypeScript application
│   └── src/
│       ├── components/      # React components
│       │   ├── auth/        # Authentication pages
│       │   ├── Chat/        # Chat UI components
│       │   └── ui/          # Reusable UI components
│       ├── lib/             # Utilities & fetch wrapper
│       ├── store/           # Zustand state management
│       └── types/           # TypeScript definitions
├── package.json
└── render.yaml              # Deployment configuration
```

## Backend

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO 4.x
- **Authentication**: JWT (jsonwebtoken) with cookie + Bearer token support
- **File Storage**: Cloudinary (profile images, message attachments)
- **Email**: Resend API (welcome emails)
- **Security**: Arcjet (rate limiting, bot protection)
- **Middleware**: Multer (multipart/form-data), cookie-parser, cors

### API Endpoints

#### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |
| POST | `/auth/profile` | Update profile (requires auth, supports image upload) |
| GET | `/auth/protected` | Protected route test |

#### Messages (`/api/message`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/message/contacts` | Get all chat partners |
| GET | `/message/:id` | Get conversation with user |
| POST | `/message/:id` | Send message (supports image upload) |

#### Users (`/api/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/accept/:id` | Accept/add user to contacts |
| POST | `/user/block/:id` | Block a user |

### Database Models

#### User
```javascript
{
  username: String,          // Required
  email: String,             // Required, unique
  password: String,          // Required, min 6 chars
  profileImage: String,      // URL from Cloudinary
  lastSeen: Date,            // Auto-updated on disconnect
  contacts: [ObjectId],      // Array of user IDs
  blocked: [ObjectId]        // Array of blocked user IDs
}
```

#### Message
```javascript
{
  senderId: ObjectId,        // Reference to User
  receiverId: ObjectId,      // Reference to User
  text: String,              // Max 1000 chars
  image: String,             // URL from Cloudinary
}
```

### Authentication Flow

1. **Signup**: Creates user, sends welcome email via Resend, returns JWT in cookie + response body
2. **Login**: Validates credentials, issues JWT token
3. **Protected Routes**: Validates `jwt` cookie or `Authorization: Bearer <token>` header
4. **Logout**: Clears JWT cookie (expires immediately)

### Socket.IO Events

**Client → Server:**
- `sendMessage`: Send text/image to a user
- `disconnect`: User goes offline (handled automatically)

**Server → Client:**
- `getOnlineUsers`: List of online user IDs
- `newMessage`: Incoming message notification

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5500) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing | Yes |
| `CLIENT_URL` | Frontend origin (CORS) | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `RESEND_API_KEY` | Resend API key | Yes (prod) |
| `RESEND_FROM_EMAIL` | Sender email address | Yes (prod) |
| `RESEND_FROM_NAME` | Sender display name | Yes (prod) |
| `ARCJET_API_KEY` | Arcjet security key | No |
| `ARCJET_ENV` | Arcjet environment | No |

---

## Frontend

### Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.x
- **State Management**: Zustand 5.x
- **Routing**: React Router 7.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI (Dialog, Slot)
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **Notifications**: React Hot Toast
- **Real-time**: Socket.IO Client
- **HTTP Client**: Custom fetch wrapper with auth

### Key Components

#### Chat Layout
- `ChatLayout.tsx`: Main container with responsive design
- `Sidebar.tsx`: User profile, online status, conversation list
- `ChatArea.tsx`: Message display and input
- `MessageList.tsx`: Scrollable message history with skeletons
- `Message.tsx`: Individual message bubble
- `MessageInput.tsx`: Text input with image attachment
- `ChatHeader.tsx`: Current chat partner info
- `ProfileView.tsx`: User profile display
- `MobileLayout.tsx`: Mobile-specific chat interface
- `EmptyState.tsx`: Empty chat placeholder
- `ContactRequestDialog.tsx`: Contact management dialog

#### Auth Components
- `Login.tsx`: User sign-in form
- `SignUp.tsx`: User registration form
- `AuthLayout.tsx`: Shared auth page layout
- `ProtectedRoute.tsx`: Route guard for authenticated users
- `GuestRoute.tsx`: Route guard for guest users

### State Management

#### useAuthStore
Manages authentication state and user operations:
- `authUser`: Current logged-in user
- `isCheckingAuth`: Initial auth check status
- `login(data)`: User login
- `signup(data)`: User registration
- `logout()`: User logout
- `updateUser()`: Profile updates with image
- `checkAuth()`: Validates 7-day session from localStorage

#### useChatStore
Manages chat state and real-time communication:
- `socket`: Socket.IO connection instance
- `users`: List of chat partners
- `selectedUser`: Currently viewed conversation
- `messages`: Current conversation messages
- `onlineUsers`: Array of online user IDs
- `isContact`: Contact status with selected user
- `getUsers()`: Fetch chat partners
- `getMessages(userId)`: Fetch conversation history
- `sendMessage(message)`: Emit socket event
- `connectSocket()`: Establish WebSocket connection
- `disconnectSocket()`: Close WebSocket connection
- `acceptContact(userId)`: Add user to contacts
- `blockContact(userId)`: Block a user

### API Client (`fetch.ts`)

Custom fetch wrapper providing:
- Automatic base URL configuration
- JWT token injection from localStorage
- FormData support for file uploads
- Error handling with response parsing
- Methods: `get`, `post`, `put`, `del`

### Routing

```
/          - Chat interface (Protected)
/login     - Login page (Guest)
/signup    - Signup page (Guest)
/signup    - Signup page (Guest)
/profile   - Profile view (Protected)
```

### Utility Functions (`lib/utils.ts`)

- `cn()`: Tailwind class name merger (clsx + tailwind-merge)
- `formatLastSeen()`: Format last seen timestamp for display

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | Yes |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Resend account (optional, for emails)

### Installation

1. **Clone and install dependencies:**
```bash
# Root level
npm install

# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

2. **Configure environment variables:**

Backend (`.env` in `backend/`):
```env
PORT=5500
MONGODB_URI=mongodb://localhost:27017/unit-chat
JWT_SECRET=your-super-secret-key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=chat@example.com
RESEND_FROM_NAME=Unit Chat
ARCJET_API_KEY=aj_xxxxxxxx
```

Frontend (`.env` in `frontend/`):
```env
VITE_API_BASE_URL=http://localhost:5500
```

3. **Start development servers:**

```bash
# Backend (from backend/ directory)
npm run dev

# Frontend (from frontend/ directory)
npm run dev
```

4. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5500
   - Health check: http://localhost:5500/health

---

## Features

- **Real-time Messaging**: Instant message delivery via Socket.IO
- **Image Sharing**: Upload images via Cloudinary
- **User Authentication**: JWT-based with cookie/header options
- **Online Status**: Live presence indicators
- **Last Seen**: Timestamp display for offline users
- **Contact Management**: Add users to contacts list
- **User Blocking**: Block unwanted users
- **Profile Management**: Update username and profile image
- **Session Management**: 7-day persistent sessions
- **Responsive Design**: Works on desktop and mobile
- **Animations**: Smooth transitions with Framer Motion
- **Skeleton Loading**: Skeleton screens during data fetch
- **Security**: Arcjet protection against bots/abuse

---

## Production Deployment

The project includes `render.yaml` for Render.com deployment:

1. **Web Service**: Backend server
2. **Environment**: Set all required environment variables in Render dashboard

For other platforms:
- Build frontend: `cd frontend && npm run build`
- Serve static files from `backend/public` or deploy separately
