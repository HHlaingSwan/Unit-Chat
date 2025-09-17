import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "unitchat-30322.firebaseapp.com",
	projectId: "unitchat-30322",
	storageBucket: "unitchat-30322.firebasestorage.app",
	messagingSenderId: "1032540102818",
	appId: "1:1032540102818:web:dc3bb68864b06333aaf7fb",
	measurementId: "G-RCXGYHJ4NZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage();
