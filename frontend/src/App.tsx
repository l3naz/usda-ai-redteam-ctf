import { useState, useEffect } from "react";
import { Header } from "./components/shared/Header";
import { Footer } from "./components/shared/Footer";
import { AuthModal } from "./components/auth/AuthModal";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LearnPage } from "./pages/LearnPage";
import { ModulePage } from "./pages/ModulePage";
import { PlayPage } from "./pages/PlayPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SimulationPage } from "./pages/SimulationPage";
import { VulnerabilitiesPage } from "./pages/VulnerabilitiesPage";
import { UserProvider, useUser } from "./context/UserContext";
import { Toaster } from "./components/ui/sonner";

type Page = "home" | "learn" | "modules" | "play" | "leaderboard" | "profile" | "simulation" | "vulnerabilities";

function AppContent() {
  const { user, loading, userProgress, updateProgress, completeQuiz } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [moduleData, setModuleData] = useState<any>(null);
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark";
  });

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Add keyboard support for dismissing toasts with Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Find and dismiss visible toasts
        const toasts = document.querySelectorAll('[data-sonner-toast]');
        toasts.forEach(toast => {
          const closeButton = toast.querySelector('button[data-close-button]');
          if (closeButton instanceof HTMLElement) {
            closeButton.click();
          }
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Protected pages that require authentication
  const protectedPages: Page[] = ["learn", "modules", "play", "leaderboard", "profile", "simulation", "vulnerabilities"];

  // Check authentication state
  const isAuthenticated = user !== null;

  const handleNavigate = (page: string, data?: any) => {
    const targetPage = page as Page;
    
    // Check if page is protected and user is not authenticated
    if (protectedPages.includes(targetPage) && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setCurrentPage(targetPage);
    if (data) {
      setModuleData(data);
    }
    // Smooth scroll to top with a slight delay for page transition
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleOpenAuthModal = () => {
    setShowAuthModal(true);
  };

  const handleLoginSuccess = () => {
    // After successful login, redirect to leaderboard
    setShowAuthModal(false)
    handleNavigate("home");
  };

  const handleLogout = () => {
    // Close auth modal if it's open
    setShowAuthModal(false);
    // Navigate to landing page
    setCurrentPage("home");
  };

  const handleModuleComplete = (moduleId: number, score: number) => {
    // This is handled by completeQuiz in the context
  };

  const handleModuleSectionUpdate = (
    moduleId: number,
    section: 'overview' | 'quickExplainer' | 'mitigation' | 'interactiveLab' | 'quiz'
  ) => {
    updateProgress(moduleId, section);
  };

  const handleQuizComplete = (moduleId: number, score: number) => {
    completeQuiz(moduleId, score);
  };

  // Show auth modal if trying to access protected page without auth
  // But don't show modal when user just logged out (redirecting to home)
  useEffect(() => {
    if (protectedPages.includes(currentPage) && !isAuthenticated && currentPage !== "home") {
      setShowAuthModal(true);
    } else if (currentPage === "home" && !isAuthenticated) {
      // Explicitly close modal when on landing page
      setShowAuthModal(false);
    }
  }, [currentPage, isAuthenticated]);

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Toaster for notifications */}
      <Toaster position="top-right" />

      {/* Enhanced Professional Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Diagonal accent lines - subtle tech aesthetic */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagonal-light" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-border" />
              </pattern>
              <pattern id="hexagon-light" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <path d="M30 0 L45 13 L45 39 L30 52 L15 39 L15 13 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border opacity-20" />
              </pattern>
            </defs>
            <rect className="hidden dark:block" width="100%" height="100%" fill="url(#diagonal-light)" />
            <rect className="block dark:hidden" width="100%" height="100%" fill="url(#hexagon-light)" />
          </svg>
        </div>
      </div>

      {/* Header - Only show when authenticated */}
      {isAuthenticated && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onOpenAuthModal={handleOpenAuthModal}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {!isAuthenticated && currentPage === "home" && (
          <LandingPage 
            onNavigate={handleNavigate}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}
        
        {isAuthenticated && currentPage === "home" && user && (
          <DashboardPage
            user={{ name: user.displayName || "User", email: user.email || "" }}
            onNavigate={handleNavigate}
          />
        )}
        
        {isAuthenticated && currentPage === "learn" && (
          <LearnPage 
            onNavigate={handleNavigate}
          />
        )}
        
        {isAuthenticated && currentPage === "modules" && (
          <ModulePage
            onNavigate={handleNavigate}
            vulnerabilityId={moduleData?.vulnerabilityId}
            onModuleComplete={handleModuleComplete}
            onSectionUpdate={handleModuleSectionUpdate}
            onQuizComplete={handleQuizComplete}
            userProgress={userProgress}
          />
        )}
        
        {isAuthenticated && currentPage === "play" && (
          <PlayPage onNavigate={handleNavigate} />
        )}
        
        {isAuthenticated && currentPage === "leaderboard" && (
          <LeaderboardPage onNavigate={handleNavigate} />
        )}
        
        {isAuthenticated && currentPage === "profile" && user && (
          <ProfilePage 
            onNavigate={handleNavigate}
          />
        )}
        
        {isAuthenticated && currentPage === "simulation" && (
          <SimulationPage onNavigate={handleNavigate} />
        )}
        
        {isAuthenticated && currentPage === "vulnerabilities" && (
          <VulnerabilitiesPage 
            onNavigate={handleNavigate}
            completedModules={userProgress.completedModules}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseAuthModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

// Main App component wrapped with UserProvider
export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
