# Real-Time Chat Application

A modern, real-time chat application built with React, TypeScript, and Firebase. It features user authentication, live messaging, online presence indicators, and profile customization.

## Features

- **User Authentication**: Secure sign-up and sign-in with email, username, and password.
- **Real-Time Messaging**: Send and receive messages instantly with Firestore's real-time capabilities.
- **Message Management**: Edit and delete your own messages.
- **Online Presence**: See who's currently online.
- **Typing Indicators**: Know when another user is typing a message.
- **Profile Customization**: Change your display name and profile picture by uploading an image or generating a random avatar.
- **Session Management**: Automatic sign-out after a period of inactivity for enhanced security.
- **User-Friendly UI**: Built with Tailwind CSS, featuring:
  - Toast notifications for success and error messages.
  - Instant form validation with clear error messages.
  - A password strength meter during registration.
  - A show/hide password toggle.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router
- **Backend & Services**: Firebase (Authentication, Firestore, Cloud Storage)
- **UI Feedback**: React Toastify

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Web-Socket
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Firebase:**

    - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    - In your project, go to **Project Settings** and add a new **Web app**.
    - Copy the `firebaseConfig` object.
    - In your project, enable **Authentication** with the "Email/Password" provider.
    - Set up **Firestore Database** in test mode for now.
    - Set up **Storage** in test mode for now.

4.  **Configure Environment Variables:**

    - Create a `.env` file in the root of the project.
    - Add your Firebase configuration keys to the `.env` file. Vite requires environment variables to be prefixed with `VITE_`.

    ```env
    VITE_FIREBASE_API_KEY="your_api_key"
    VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
    VITE_FIREBASE_PROJECT_ID="your_project_id"
    VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
    VITE_FIREBASE_APP_ID="your_app_id"
    VITE_FIREBASE_MEASUREMENT_ID="your_measurement_id"
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173`.

## Deployment

This application is configured for easy deployment on platforms like Vercel or Netlify.

1.  Push your code to a GitHub repository.
2.  Import the repository into your hosting provider (e.g., Vercel).
3.  Configure the environment variables in your hosting provider's project settings. Use the same keys and values from your `.env` file.
4.  Deploy!

## License

This project is licensed under the MIT License.
