// ✅ Firebase Configuration - Real Authentication
// 🔐 ENV PLACEHOLDER — Secrets must be stored in environment variables
// Configure these values in your .env file (see README.md for details)

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup, 
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  User
} from "firebase/auth";

// Firebase project configuration
// ⚠️ SECURITY NOTE: Firebase client-side API keys are safe to expose
// They are restricted by Firebase Security Rules and authorized domains
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyDOtCFH4IPbwDYOARbK0pmHbb5QaIV3CO8",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "usda-d6adb.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "usda-d6adb",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "usda-d6adb.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1008851857221",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:1008851857221:web:631ec2d26caa2db8b2d82c",
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-ZQ7051G247"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

// Configure Microsoft provider
microsoftProvider.setCustomParameters({
  tenant: 'common', // Use 'common' for multi-tenant or specific tenant ID
  prompt: 'select_account'
});

// Set persistence to keep user logged in
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Failed to set persistence:", error);
});

// Google Sign-In function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    // Suppress console errors for expected conditions
    if (error.code !== "auth/unauthorized-domain" && error.code !== "auth/popup-closed-by-user") {
      console.error("Google login error:", error);
    }
    throw error;
  }
};

// Microsoft Sign-In function
export const signInWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    return result.user;
  } catch (error: any) {
    // Suppress console errors for expected conditions
    if (error.code !== "auth/unauthorized-domain" && error.code !== "auth/popup-closed-by-user") {
      console.error("Microsoft login error:", error);
    }
    throw error;
  }
};

// Sign Out function
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// Get Firebase ID Token
export const getFirebaseIdToken = async (): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  } catch (error) {
    console.error("Error getting Firebase ID token:", error);
    return null;
  }
};

// Auth state observer
export const onAuthChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Export User type for TypeScript
export type { User };
