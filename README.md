# Unit-Chat

A production-ready real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js). Features secure JWT authentication, Socket.IO for instant messaging, image sharing via Cloudinary, and a polished responsive UI.

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO 4.x
- **Authentication**: JWT with cookie + Bearer token support
- **File Storage**: Cloudinary
- **Email**: Resend API
- **Security**: Arcjet (rate limiting, bot protection)

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.x
- **State Management**: Zustand 5.x
- **Routing**: React Router 7.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Key Features

- **Real-time Messaging**: Instant message delivery via WebSocket
- **Image Sharing**: Upload images with Cloudinary integration
- **Secure Authentication**: JWT tokens, bcrypt hashing, 7-day sessions
- **Online Presence**: Live status indicators and last seen timestamps
- **Contact Management**: Add friends and block unwanted users
- **Responsive Design**: Mobile-friendly interface
- **Smooth Animations**: Polished UX with Framer Motion
- **Skeleton Loading**: Professional loading states

## Project Structure

```
Unit-Chat/
├── backend/                 # Express.js server
│   └── src/
│       ├── controllers/     # Request handlers
│       ├── db/              # Database configurations
│       ├── emails/          # Email templates
│       ├── middleware/      # Auth, file upload, security
│       ├── models/          # Mongoose schemas
│       ├── routes/          # API routes
│       ├── socket/          # Socket.IO setup
│       └── server.js        # Entry point
├── frontend/                # React + TypeScript app
│   └── src/
│       ├── components/      # React components
│       │   ├── auth/        # Login/Signup
│       │   ├── Chat/        # Chat UI
│       │   └── ui/          # Reusable UI
│       ├── lib/             # Utilities
│       ├── store/           # Zustand state
│       └── types/           # TypeScript types
└── render.yaml              # Deployment config
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/profile` | Update profile |
| GET | `/api/auth/protected` | Protected route test |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/message/contacts` | Get chat partners |
| GET | `/api/message/:id` | Get conversation |
| POST | `/api/message/:id` | Send message/image |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Resend account (optional)

### Installation

```bash
# Root dependencies
npm install

# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Environment Variables

Backend (`.env` in `backend/`):
```env
PORT=5500
MONGODB_URI=mongodb://localhost:27017/unit-chat
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=chat@example.com
```

Frontend (`.env` in `frontend/`):
```env
VITE_API_BASE_URL=http://localhost:5500
```

### Running the App

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5500

## Deployment

The project includes `render.yaml` for Render.com deployment. Set environment variables in the Render dashboard.

## License

MIT
