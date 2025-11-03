import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  type UserProgress, 
  loadProgressFromStorage, 
  saveProgressToStorage,
  updateModuleSection,
  completeModuleQuiz,
  calculateTotalScore,
  addChallengeActivity
} from "../lib/userProgress";
import { toast } from "sonner@2.0.3";
import { clearAuthToken, getAuthToken, verifyToken } from "../utils/api";

// User Type
export interface User {
  id: number; // Backend user ID
  email: string;
  displayName: string;
  photoURL?: string | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  userProgress: UserProgress;
  updateProgress: (moduleId: number, section: keyof UserProgress['moduleProgress'][number]['sectionsCompleted']) => void;
  completeQuiz: (moduleId: number, score: number, moduleTitle?: string) => void;
  addActivity: (challengeTitle: string, score: number) => void;
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
      recentActivities: [],
    };
  });

  // Check authentication state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      
      if (token) {
        // Verify token with backend
        const isValid = await verifyToken();
        
        if (isValid) {
          // Load user data from localStorage
          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            try {
              const userData = JSON.parse(storedUserData);
              setUser({
                id: userData.id,
                email: userData.email,
                displayName: userData.name || userData.displayName,
                photoURL: userData.photoURL || null,
              });
            } catch (error) {
              console.error("Failed to parse stored user data:", error);
              clearAuthToken();
              localStorage.removeItem("userData");
            }
          } else {
            // Token exists but no user data - clear and require re-login
            clearAuthToken();
          }
        } else {
          // Token invalid - clear it
          clearAuthToken();
          localStorage.removeItem("userData");
        }
      }
      
      setLoading(false);
    };

    initAuth();
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
      clearAuthToken();
      localStorage.removeItem("userData");
      setUser(null);
      toast.success("Signed out successfully");
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
  const completeQuiz = (moduleId: number, score: number, moduleTitle?: string) => {
    setUserProgress(prev => {
      const wasCompleted = prev.completedModules.includes(moduleId);
      const updated = completeModuleQuiz(prev, moduleId, score, moduleTitle);
      const nowCompleted = updated.completedModules.includes(moduleId);
      
      // Show toast notification if module just completed
      if (!wasCompleted && nowCompleted && score >= 80) {
        setTimeout(() => {
          toast.success(`✅ Module completed! Progress: ${updated.completedModules.length}/10 modules (${Math.round((updated.completedModules.length / 10) * 100)}%)`);
        }, 500);
      }
      
      return updated;
    });
  };

  // Add challenge activity
  const addActivity = (challengeTitle: string, score: number) => {
    setUserProgress(prev => addChallengeActivity(prev, challengeTitle, score));
  };

  // Reset progress (for testing or user request)
  const resetProgress = () => {
    const initial: UserProgress = {
      completedModules: [],
      totalScore: 0,
      rank: 0,
      lastActivityDate: new Date().toISOString(),
      moduleProgress: {},
      recentActivities: [],
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
      addActivity,
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
