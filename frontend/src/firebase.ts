// ✅ Firebase Configuration - Real Authentication
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
const firebaseConfig = {
  apiKey: "AIzaSyDOtCFH4IPbwDYOARbK0pmHbb5QaIV3CO8",
  authDomain: "usda-d6adb.firebaseapp.com",
  projectId: "usda-d6adb",
  storageBucket: "usda-d6adb.firebasestorage.app",
  messagingSenderId: "1008851857221",
  appId: "1:1008851857221:web:631ec2d26caa2db8b2d82c",
  measurementId: "G-ZQ7051G247"
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
