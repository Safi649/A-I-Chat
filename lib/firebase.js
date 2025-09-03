// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo5288OvOtlQMKRP6wCGY-k2Z9FX7LMpE",
  authDomain: "a-i-chat.firebaseapp.com",
  projectId: "a-i-chat",
  storageBucket: "a-i-chat.firebasestorage.app",
  messagingSenderId: "166131304035",
  appId: "1:166131304035:web:a9b07ff887c9c341361a56",
  measurementId: "G-Z1D2R18F65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
