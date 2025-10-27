import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  type UserProgress, 
  loadProgressFromStorage, 
  saveProgressToStorage,
  updateModuleSection,
  completeModuleQuiz,
  calculateTotalScore
} from "../lib/userProgress";
import { toast } from "sonner@2.0.3";
import { onAuthChanged, signOut as firebaseSignOut, type User as FirebaseUser } from "../firebase";
import { clearAuthToken, getAuthToken } from "../utils/api";

// Extended User Type with backend user ID
export interface User {
  uid: string; // Firebase UID
  id?: number; // Backend user ID
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  userProgress: UserProgress;
  updateProgress: (moduleId: number, section: keyof UserProgress['moduleProgress'][number]['sectionsCompleted']) => void;
  completeQuiz: (moduleId: number, score: number) => void;
  resetProgress: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // User progress state with real-time updates
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const stored = loadProgressFromStorage();
    if (stored) {
      return stored;
    }
    // Default initial state
    return {
      completedModules: [],
      totalScore: 0,
      rank: 0,
      lastActivityDate: new Date().toISOString(),
      moduleProgress: {},
      quizScores: {},
    };
  });

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Check if we have a valid backend token
        const token = getAuthToken();
        if (token) {
          // Load user data from localStorage if available
          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            try {
              const userData = JSON.parse(storedUserData);
              setUser({
                uid: firebaseUser.uid,
                id: userData.id,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                emailVerified: firebaseUser.emailVerified,
                isAnonymous: firebaseUser.isAnonymous,
              });
            } catch (error) {
              console.error("Failed to parse stored user data:", error);
            }
          } else {
            // Set Firebase user without backend ID
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
              isAnonymous: firebaseUser.isAnonymous,
            });
          }
        } else {
          // User is signed in with Firebase but no backend token
          // This will be handled by the login flow
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            isAnonymous: firebaseUser.isAnonymous,
          });
        }
      } else {
        setUser(null);
        clearAuthToken();
        localStorage.removeItem("userData");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Persist progress to localStorage whenever it changes
  useEffect(() => {
    saveProgressToStorage(userProgress);
  }, [userProgress]);

  // Calculate total score whenever completed modules change
  useEffect(() => {
    const score = calculateTotalScore(userProgress.completedModules);
    setUserProgress(prev => ({ ...prev, totalScore: score }));
  }, [userProgress.completedModules.length]);

  // Logout function
  const logout = async () => {
    try {
      await firebaseSignOut();
      clearAuthToken();
      localStorage.removeItem("userData");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  // Update module section progress
  const updateProgress = (
    moduleId: number, 
    section: keyof UserProgress['moduleProgress'][number]['sectionsCompleted']
  ) => {
    setUserProgress(prev => {
      const updated = updateModuleSection(prev, moduleId, section);
      return updated;
    });
  };

  // Complete quiz with score
  const completeQuiz = (moduleId: number, score: number) => {
    setUserProgress(prev => {
      const wasCompleted = prev.completedModules.includes(moduleId);
      const updated = completeModuleQuiz(prev, moduleId, score);
      const nowCompleted = updated.completedModules.includes(moduleId);
      
      // Show toast notification if module just completed
      if (!wasCompleted && nowCompleted && score >= 80) {
        setTimeout(() => {
          toast.success(`✅ Module completed! Progress: ${updated.completedModules.length}/10 modules (${Math.round((updated.completedModules.length / 10) * 100)}%)`, {
            duration: 4000,
          });
        }, 500);
      }
      
      return updated;
    });
  };

  // Reset progress (for testing or user request)
  const resetProgress = () => {
    const initial: UserProgress = {
      completedModules: [],
      totalScore: 0,
      rank: 0,
      lastActivityDate: new Date().toISOString(),
      moduleProgress: {},
      quizScores: {},
    };
    setUserProgress(initial);
    saveProgressToStorage(initial);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      setUser,
      logout, 
      userProgress, 
      updateProgress, 
      completeQuiz,
      resetProgress 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
