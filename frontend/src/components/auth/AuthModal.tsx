import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { Shield, X, Mail, Loader2, AlertCircle } from "lucide-react";
import { useUser, type User } from "../../context/UserContext";
import { toast } from "sonner@2.0.3";
import { signInWithGoogle, signInWithMicrosoft, getFirebaseIdToken } from "../../firebase";
import { loginWithFirebase } from "../../utils/api";

type AuthState = "signin" | "signup" | "forgot";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const { setUser } = useUser();
  const [authState, setAuthState] = useState<AuthState>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });

  // Handle Firebase + Backend Authentication
  const handleFirebaseAuth = async (provider: 'google' | 'microsoft') => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Sign in with Firebase
      const firebaseUser = provider === 'google' 
        ? await signInWithGoogle()
        : await signInWithMicrosoft();

      if (!firebaseUser) {
        throw new Error("Firebase authentication failed");
      }

      // Step 2: Get Firebase ID token
      const idToken = await getFirebaseIdToken();
      if (!idToken) {
        throw new Error("Failed to get Firebase ID token");
      }

      // Step 3: Send token to backend
      const response = await loginWithFirebase(idToken);

      // Step 4: Update user context with backend data
      const userData: User = {
        uid: firebaseUser.uid,
        id: response.user.id,
        email: response.user.email,
        displayName: response.user.name,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        isAnonymous: false,
      };

      // Store backend user data
      localStorage.setItem("userData", JSON.stringify({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
      }));

      setUser(userData);
      toast.success(`Welcome back, ${response.user.name}!`);
      onClose();

      // Call success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      // Handle specific error cases
      if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled. Please try again.");
      } else if (error.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized for authentication. Please contact support.");
      } else if (error.message?.includes("Network")) {
        setError("Unable to connect to the server. Please check your internet connection.");
      } else {
        setError(error.message || "Authentication failed. Please try again.");
      }
      
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authState === "signin") {
      // Email/password sign in (would need backend implementation)
      toast.info("Email/password sign-in not yet implemented. Please use Google or Microsoft.");
    } else if (authState === "signup") {
      // Email/password signup (would need backend implementation)
      toast.info("Email/password sign-up not yet implemented. Please use Google or Microsoft.");
    } else if (authState === "forgot") {
      toast.success(`Password reset link sent to ${formData.email}`);
      setAuthState("signin");
    }
  };

  const getTitle = () => {
    switch (authState) {
      case "signin": return "Welcome Back";
      case "signup": return "Create Your Account";
      case "forgot": return "Reset Your Password";
    }
  };

  const getSubtitle = () => {
    switch (authState) {
      case "signin": return "Sign in to continue your AI Red Team training";
      case "signup": return "Join USDA AI Center of Excellence training program";
      case "forgot": return "Enter your email to receive a password reset link";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showClose={false}
        className="sm:max-w-md p-0 gap-0 overflow-hidden bg-card border-2 border-border transition-colors duration-200"
      >
        {/* Header */}
        <div className="bg-[#0A2342] dark:bg-[#1E293B] text-white p-6 pb-8 transition-colors duration-200 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-[#E2E8F0] hover:text-teal hover:bg-white/10 transition-all duration-200"
            aria-label="Close"
            title="Close"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/10 rounded-lg p-2 transition-colors duration-200">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-white text-2xl">{getTitle()}</DialogTitle>
          </div>
          <DialogDescription className="text-white/90 text-sm">{getSubtitle()}</DialogDescription>
        </div>

        {/* Content */}
        <div className="p-6 bg-card transition-colors duration-200">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sign In Form */}
            {authState === "signin" && (
              <>
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={() => handleFirebaseAuth('google')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-card border-2 border-border rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 dark:focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Sign in with Google"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span className="text-foreground">Continue with Google</span>
                      </>
                    )}
                  </button>

                  {/* Microsoft Button */}
                  <button
                    type="button"
                    onClick={() => handleFirebaseAuth('microsoft')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-card border-2 border-border rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 dark:focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Sign in with Microsoft"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                          <path fill="#f35325" d="M1 1h10v10H1z"/>
                          <path fill="#81bc06" d="M12 1h10v10H12z"/>
                          <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                          <path fill="#ffba08" d="M12 12h10v10H12z"/>
                        </svg>
                        <span className="text-foreground">Continue with Microsoft</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or sign in with email</span>
                  </div>
                </div>

                {/* Email + Password Fields */}
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your.email@usda.gov"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setAuthState("forgot")}
                    className="text-sm text-teal hover:underline transition-colors duration-200"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Regular Sign In */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal hover:bg-teal/90 text-white dark:text-white transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthState("signup")}
                    className="text-teal hover:underline"
                    disabled={loading}
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}

            {/* Sign Up Form */}
            {authState === "signup" && (
              <>
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={() => handleFirebaseAuth('google')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-card border-2 border-border rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 dark:focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Sign up with Google"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span className="text-foreground">Continue with Google</span>
                      </>
                    )}
                  </button>

                  {/* Microsoft Button */}
                  <button
                    type="button"
                    onClick={() => handleFirebaseAuth('microsoft')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-card border-2 border-border rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 dark:focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Sign up with Microsoft"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                          <path fill="#f35325" d="M1 1h10v10H1z"/>
                          <path fill="#81bc06" d="M12 1h10v10H12z"/>
                          <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                          <path fill="#ffba08" d="M12 12h10v10H12z"/>
                        </svg>
                        <span className="text-foreground">Continue with Microsoft</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthState("signin")}
                    className="text-teal hover:underline"
                    disabled={loading}
                  >
                    Sign In
                  </button>
                </div>
              </>
            )}

            {/* Forgot Password Form */}
            {authState === "forgot" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email Address</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="your.email@usda.gov"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-teal hover:bg-teal/90 text-white dark:text-white transition-colors duration-200"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => setAuthState("signin")}
                    className="text-teal hover:underline"
                    disabled={loading}
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </>
            )}

            <div className="pt-2 text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="#" className="text-teal hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-teal hover:underline">
                Privacy Policy
              </a>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
