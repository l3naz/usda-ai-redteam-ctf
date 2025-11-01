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
import { getHybridCurrentUser, verifyHybridToken, clearHybridAuth } from "../lib/hybridAuth";
import { getUserData, clearAuth } from "../lib/auth";

// User Type with backend user ID
export interface User {
  uid: string; // Backend user ID (used as UID)
  id?: number; // Backend user ID (parsed as number if possible)
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

  // Check authentication state on mount and when token changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify token using hybrid auth (tries backend first, falls back to frontend)
        const isValid = await verifyHybridToken();
        if (isValid) {
          // Get current user using hybrid auth
          const currentUser = await getHybridCurrentUser();
          if (currentUser) {
            // Get user ID from result or localStorage token
            const userId = currentUser.id || localStorage.getItem('usda_token') || '';
            
            setUser({
              uid: userId,
              id: undefined,
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email.split('@')[0],
              photoURL: null,
              emailVerified: true,
              isAnonymous: false,
            });
          } else {
            // No user found, clear auth
            clearHybridAuth();
            setUser(null);
          }
        } else {
          // Token invalid, clear auth
          clearHybridAuth();
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        clearHybridAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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
      // Clear hybrid auth (handles both backend and frontend)
      clearHybridAuth();
      
      // Clear local state
      setUser(null);
      
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      clearHybridAuth();
      clearAuth();
      setUser(null);
      toast.success("Logged out successfully");
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
