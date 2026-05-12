// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mean-blog-bd1dc.firebaseapp.com",
  projectId: "mean-blog-bd1dc",
  storageBucket: "mean-blog-bd1dc.firebasestorage.app",
  messagingSenderId: "670076440014",
  appId: "1:670076440014:web:2eb347bc81ee03b3372f9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }