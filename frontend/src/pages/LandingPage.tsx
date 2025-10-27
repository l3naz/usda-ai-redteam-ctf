import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Shield,
  Target,
  Award,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { signInWithGoogle, signOut as firebaseSignOut, getFirebaseIdToken } from "../firebase";
import { loginWithFirebase } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAuthModal?: () => void;
}

export function LandingPage({
  onNavigate,
  isDarkMode,
  onToggleTheme,
  onOpenAuthModal,
}: LandingPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("usda_token") : null;
    setIsAuthenticated(!!token);
  }, []);

  // Login handler - Direct Google OAuth
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Step 1: Sign in with Google via Firebase
      const firebaseUser = await signInWithGoogle();
      
      if (!firebaseUser) {
        throw new Error("Firebase authentication failed");
      }

      // Step 2: Get Firebase ID token
      const firebaseToken = await getFirebaseIdToken();
      
      if (!firebaseToken) {
        throw new Error("Failed to get Firebase ID token");
      }

      // Step 3: Exchange Firebase token with backend
      const response = await loginWithFirebase(firebaseToken);

      // Step 4: Store JWT token
      localStorage.setItem("usda_token", response.token);
      
      // Step 5: Store user data
      localStorage.setItem("userData", JSON.stringify({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
      }));

      // Update auth state
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${response.user.name}!`);

      // Step 6: Redirect to leaderboard
      setTimeout(() => {
        window.location.href = "/";
        onNavigate("leaderboard");
      }, 500);

    } catch (error: any) {
      console.error("Login failed:", error);
      
      // Handle specific error cases
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-in was cancelled. Please try again.");
      } else if (error.code === "auth/unauthorized-domain") {
        // More helpful error message with instructions
        const currentDomain = window.location.hostname;
        toast.error(
          `Domain Authorization Required: "${currentDomain}" must be added to Firebase Console. ` +
          `Go to Firebase Console → Authentication → Settings → Authorized Domains and add "${currentDomain}".`,
          { duration: 10000 }
        );
        console.error(
          `\n🔧 FIREBASE CONFIGURATION REQUIRED:\n` +
          `1. Go to: https://console.firebase.google.com/project/usda-d6adb/authentication/settings\n` +
          `2. Scroll to "Authorized domains"\n` +
          `3. Click "Add domain"\n` +
          `4. Add: "${currentDomain}"\n` +
          `5. Save and refresh this page\n`
        );
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    setLoading(true);
    try {
      // Sign out from Firebase
      await firebaseSignOut();
      
      // Clear localStorage
      localStorage.removeItem("usda_token");
      localStorage.removeItem("userData");
      
      // Update auth state
      setIsAuthenticated(false);
      
      toast.success("Logged out successfully");
      
      // Redirect to home
      setTimeout(() => {
        window.location.href = "/";
      }, 500);

    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="transition-colors duration-200">
      {/* Pre-Login Header with Theme Toggle */}
      <header className="sticky top-0 z-50 bg-[#0A2342] dark:bg-[#0B1120] border-b border-white/10 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="bg-white rounded-lg p-2">
                <Shield className="h-6 w-6 text-[#0A2342]" />
              </div>
              <div className="text-left">
                <h1 className="text-white text-xl">
                  USDA AI Red Team Training Game
                </h1>
                <p className="text-xs text-white/70">
                  AI Center of Excellence
                </p>
              </div>
            </button>

            {/* Right side - Theme Toggle + Get Started */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={onToggleTheme}
                className="rounded-full p-2 transition-all duration-200 hover:bg-white/10"
                aria-label={
                  isDarkMode
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
                title={
                  isDarkMode
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-teal transition-all" />
                ) : (
                  <Moon className="h-5 w-5 text-white transition-all" />
                )}
              </button>

              {/* Conditional Login/Logout Button */}
              {isAuthenticated ? (
                /* Logout Button - Outline style with USDA green */
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="bg-transparent border-2 border-[#007A33] hover:bg-[#007A33] text-[#007A33] hover:text-white px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              ) : (
                /* Login Button - Solid USDA green */
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="bg-[#007A33] hover:bg-[#00612A] text-white px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#00274C] dark:bg-[#1E293B] py-20 transition-colors duration-200">
        {/* Optional overlay - very subtle to keep background visible */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20 transition-opacity duration-200"></div>
        
        {/* Content with proper z-index to ensure text is above overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl mb-6 text-white">
            Test. Break. Defend. Strengthen AI Systems.
          </h1>
          <p className="text-xl text-gray-200 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            An interactive training platform from the USDA AI
            Center of Excellence designed to teach federal
            employees AI red teaming through hands-on
            Capture-the-Flag challenges.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => onOpenAuthModal && onOpenAuthModal()}
              className="text-lg px-8 transition-colors duration-200"
              style={{
                backgroundColor: '#007A33',
                color: '#FFFFFF',
                fontWeight: 600,
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00612A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#007A33';
              }}
            >
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-8 text-center border-2 border-border bg-card hover:border-teal hover:shadow-lg transition-all duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
                <Target className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-card-foreground mb-3">
                Discover AI Vulnerabilities
              </h3>
              <p className="text-muted-foreground">
                Explore 10 critical AI security vulnerabilities
                through interactive simulations and real-world
                scenarios relevant to federal systems.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 text-center border-2 border-border bg-card hover:border-teal hover:shadow-lg transition-all duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal/10 mb-6">
                <Shield className="h-8 w-8 text-teal" />
              </div>
              <h3 className="text-card-foreground mb-3">
                Simulate Real-World Attacks
              </h3>
              <p className="text-muted-foreground">
                Practice offensive and defensive techniques in
                safe sandbox environments designed to mirror
                USDA AI systems and agricultural applications.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 text-center border-2 border-border bg-card hover:border-teal hover:shadow-lg transition-all duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-6">
                <Award className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-card-foreground mb-3">
                Earn Completion Certificates
              </h3>
              <p className="text-muted-foreground">
                Track your progress, compete on the leaderboard,
                and receive official USDA certificates upon
                completing each training module.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-card-foreground mb-12">
            Training by the Numbers
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl p-6 text-center shadow-sm border border-border transition-colors duration-200">
              <p className="text-4xl text-teal mb-2">10</p>
              <p className="text-sm text-muted-foreground">
                Vulnerability Modules
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center shadow-sm border border-border transition-colors duration-200">
              <p className="text-4xl mb-2 text-teal">250+</p>
              <p className="text-sm text-muted-foreground">
                Federal Employees Trained
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center shadow-sm border border-border transition-colors duration-200">
              <p className="text-4xl text-success mb-2">95%</p>
              <p className="text-sm text-muted-foreground">
                Completion Rate
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center shadow-sm border border-border transition-colors duration-200">
              <p className="text-4xl text-teal mb-2">~4h</p>
              <p className="text-sm text-muted-foreground">
                Average Training Time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-card-foreground mb-4">
            Ready to Begin Your AI Security Training?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join federal employees across USDA in building
            expertise to secure AI systems and protect critical
            agricultural infrastructure.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate("learn")}
            className="bg-teal hover:bg-teal/90 text-white dark:text-white text-lg px-8 transition-colors duration-200"
          >
            Get Started
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}