import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { X, Mail, Loader2, AlertCircle } from "lucide-react";
import { useUser, type User } from "../../context/UserContext";
import { toast } from "sonner@2.0.3";
import { loginWithEmail, signupWithEmail, requestPasswordReset } from "../../utils/api";
import usdaLogo from "figma:asset/fe46ba86f87cfc9f9ab97c58bcc60686524f146d.png";

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
  const [authSuccess, setAuthSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        throw new Error("Please enter both email and password");
      }

      // Call backend login API
      const response = await loginWithEmail({
        email: formData.email,
        password: formData.password,
      });

      // Update user context with backend data
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        displayName: response.user.name,
      };

      // Store backend user data
      localStorage.setItem("userData", JSON.stringify({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
      }));

      // Mark authentication as successful to disable form
      setAuthSuccess(true);
      
      // Update user context
      setUser(userData);
      
      // Close modal immediately with smooth animation
      onClose();
      
      // Show success toast with 2-second duration after modal starts closing
      setTimeout(() => {
        toast.success(`Welcome back, ${response.user.name}!`);
      }, 100);

      // Navigate to dashboard after modal closes
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 350); // Wait for 300ms close animation + 50ms buffer
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.message || "Sign in failed. Please check your credentials.");
      toast.error(error.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error("Please fill in all fields");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Call backend signup API
      const response = await signupWithEmail({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      // Update user context with backend data
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        displayName: response.user.name,
      };

      // Store backend user data
      localStorage.setItem("userData", JSON.stringify({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
      }));

      // Mark authentication as successful to disable form
      setAuthSuccess(true);
      
      // Update user context
      setUser(userData);
      
      // Close modal immediately with smooth animation
      onClose();
      
      // Show success toast with 2-second duration after modal starts closing
      setTimeout(() => {
        toast.success(`Welcome to USDA AI Red Team, ${response.user.name}!`);
      }, 100);

      // Navigate to dashboard after modal closes
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 350); // Wait for 300ms close animation + 50ms buffer
    } catch (error: any) {
      console.error("Sign up error:", error);
      setError(error.message || "Sign up failed. Please try again.");
      toast.error(error.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.email) {
        throw new Error("Please enter your email address");
      }

      await requestPasswordReset(formData.email);
      toast.success(`Password reset link sent to ${formData.email}`);
      setAuthState("signin");
      setFormData({ ...formData, password: "", confirmPassword: "" });
    } catch (error: any) {
      console.error("Password reset error:", error);
      setError(error.message || "Failed to send reset link. Please try again.");
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset all state after modal animation completes
      const resetTimer = setTimeout(() => {
        setAuthState("signin");
        setError(null);
        setAuthSuccess(false);
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }, 300); // Wait for close animation
      
      return () => clearTimeout(resetTimer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    if (authState === "signin") {
      handleSignIn(e);
    } else if (authState === "signup") {
      handleSignUp(e);
    } else if (authState === "forgot") {
      handleForgotPassword(e);
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
            className="absolute right-4 top-4 rounded-full p-1.5 text-[#E2E8F0] hover:text-teal hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2342] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close authentication modal"
            title="Close"
            disabled={loading || authSuccess}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/10 rounded-lg p-2 transition-colors duration-200" aria-hidden="true">
              <img 
                src={usdaLogo} 
                alt="USDA – United States Department of Agriculture"
                className="drop-shadow-md"
                style={{ 
                  width: '32px', 
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
            <DialogTitle className="text-white text-2xl">{getTitle()}</DialogTitle>
          </div>
          <DialogDescription className="text-white/90 text-sm">{getSubtitle()}</DialogDescription>
        </div>

        {/* Content */}
        <div className="p-6 bg-card transition-colors duration-200">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4" role="alert" aria-live="assertive">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form 
            onSubmit={handleSubmit} 
            className={`space-y-4 transition-opacity duration-300 ${authSuccess ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
            aria-label="Authentication form"
          >
            {/* Sign In Form */}
            {authState === "signin" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your.email@usda.gov"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading || authSuccess}
                    required
                    autoComplete="email"
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
                    disabled={loading || authSuccess}
                    required
                    autoComplete="current-password"
                  />
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setAuthState("forgot")}
                    className="text-sm text-teal hover:underline transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 rounded px-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || authSuccess}
                    aria-label="Forgot password? Click to reset"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={loading || authSuccess}
                  className="w-full bg-teal hover:bg-teal/90 text-white dark:text-white transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : authSuccess ? (
                    "Success! Redirecting..."
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthState("signup");
                      setError(null);
                    }}
                    className="text-teal hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 rounded px-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || authSuccess}
                    aria-label="Sign up for a new account"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}

            {/* Sign Up Form */}
            {authState === "signup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={loading || authSuccess}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@usda.gov"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading || authSuccess}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading || authSuccess}
                    required
                    autoComplete="new-password"
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={loading || authSuccess}
                    required
                    autoComplete="new-password"
                  />
                </div>

                {/* Sign Up Button */}
                <Button
                  type="submit"
                  disabled={loading || authSuccess}
                  className="w-full bg-teal hover:bg-teal/90 text-white dark:text-white transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : authSuccess ? (
                    "Success! Redirecting..."
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthState("signin");
                      setError(null);
                    }}
                    className="text-teal hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 rounded px-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || authSuccess}
                    aria-label="Sign in to existing account"
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
                    disabled={loading || authSuccess}
                    required
                    autoComplete="email"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || authSuccess}
                  className="w-full bg-teal hover:bg-teal/90 text-white dark:text-white transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reset Link
                    </>
                  )}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthState("signin");
                      setError(null);
                    }}
                    className="text-teal hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 rounded px-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || authSuccess}
                    aria-label="Go back to sign in"
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
