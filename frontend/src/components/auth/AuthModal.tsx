// 🔐 ENV PLACEHOLDER — Authentication Configuration
// Firebase OAuth is configured via environment variables (see README.md)
// Secrets must be stored in .env file, NEVER in this code

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
import { hybridSignup, hybridSignin } from "../../lib/hybridAuth";

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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (authState === "signin") {
        // Email/password sign in
        if (!formData.email || !formData.password) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }

        const result = await hybridSignin(formData.email, formData.password);

        if (!result.success || !result.user) {
          setError(result.error || "Sign in failed. Please try again.");
          toast.error(result.error || "Sign in failed");
          setLoading(false);
          return;
        }

        // Get user ID from localStorage token or from result
        const userId = result.user.id || localStorage.getItem('usda_token') || '';
        
        const userData: User = {
          uid: userId,
          id: undefined,
          email: result.user.email,
          displayName: result.user.displayName || result.user.email.split('@')[0],
          photoURL: null,
          emailVerified: true,
          isAnonymous: false,
        };

        setUser(userData);
        toast.success(`Welcome back, ${result.user.displayName || result.user.email}!`);
        
        // Reset form data
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          mobileNumber: "",
        });
        setError(null);
        setLoading(false);
        
        // Close modal first
        onClose();

        // Call success callback after a brief delay to ensure modal closes
        if (onLoginSuccess) {
          setTimeout(() => {
            onLoginSuccess();
          }, 100);
        }
      } else if (authState === "signup") {
        // Email/password signup
        if (!formData.email || !formData.password) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }

        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long");
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const result = await hybridSignup(
          formData.email,
          formData.password,
          formData.fullName || undefined,
          formData.email.split("@")[0] // Auto-generate username
        );

        if (!result.success || !result.user) {
          setError(result.error || "Sign up failed. Please try again.");
          toast.error(result.error || "Sign up failed");
          setLoading(false);
          return;
        }

        // Get user ID from result or localStorage
        const userId = result.user.id || localStorage.getItem('usda_token') || '';
        
        const userData: User = {
          uid: userId,
          id: undefined,
          email: result.user.email,
          displayName: result.user.displayName || result.user.email.split('@')[0],
          photoURL: null,
          emailVerified: true,
          isAnonymous: false,
        };

        setUser(userData);
        toast.success(`Welcome, ${result.user.displayName || result.user.email}! Account created successfully.`);
        
        // Reset form data
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          mobileNumber: "",
        });
        setError(null);
        setLoading(false);
        
        // Close modal first
        onClose();

        // Call success callback after a brief delay to ensure modal closes
        if (onLoginSuccess) {
          setTimeout(() => {
            onLoginSuccess();
          }, 100);
        }
      } else if (authState === "forgot") {
        // Forgot password (mock for now)
        toast.success(`Password reset link sent to ${formData.email}`);
        setAuthState("signin");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(error.message || "Authentication failed. Please try again.");
      toast.error(error.message || "Authentication failed");
      setLoading(false);
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
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
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
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname">Full Name (Optional)</Label>
                  <Input
                    id="signup-fullname"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={loading}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@usda.gov"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={loading}
                    required
                  />
                </div>

                {/* Sign Up Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal hover:bg-teal/90 text-white dark:text-white transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
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
