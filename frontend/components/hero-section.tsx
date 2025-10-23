"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Zap, Terminal, Mail, Lock, User, X, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [text, setText] = useState("")
  const fullText = "Initializing AI Defense System..."
  const [showCursor, setShowCursor] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [signUpFullName, setSignUpFullName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("")
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)

    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => {
      clearInterval(timer)
      clearInterval(cursorTimer)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "wrong") {
      setLoginError(true)
    } else {
      setLoginError(false)
      console.log("Sign In", { email, password })
    }
  }

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (signUpPassword !== signUpConfirmPassword) {
      alert("Passwords do not match!")
      return
    }
    console.log("Sign Up", { fullName: signUpFullName, email: signUpEmail, password: signUpPassword })
    setIsSignUpModalOpen(false)
  }

  const handleOAuthSignUp = (provider: string) => {
    console.log(`Sign up with ${provider}`)
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setIsResetting(true)
    console.log("Password reset requested for:", resetEmail)

    setTimeout(() => {
      setIsResetting(false)
      setShowResetConfirmation(true)
      setTimeout(() => {
        setIsForgotPasswordModalOpen(false)
        setShowResetConfirmation(false)
        setResetEmail("")
      }, 3000)
    }, 2000)
  }

  return (
    <section id="signin-section" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-40" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-[120px] animate-glow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-secondary/30 to-accent/20 rounded-full blur-[120px] animate-glow"
        style={{ animationDelay: "1s" }}
      />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Terminal className="w-8 h-8 text-secondary animate-pulse" />
          <div className="font-mono text-sm text-secondary terminal-cursor">{text}</div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6">
          <Shield
            className="w-16 h-16 text-primary animate-float"
            style={{ filter: "drop-shadow(0 0 20px oklch(0.65 0.25 195))" }}
          />
          <Zap className="w-10 h-10 text-secondary animate-glow" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-mono mb-6 text-balance group">
          <span className="gradient-text group-hover:animate-glitch">AI Red Team Training Game</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance leading-relaxed">
          Gamified platform to learn AI Red Teaming and exploit vulnerabilities in LLMs.
        </p>

        <div className="max-w-md mx-auto animate-slide-up">
          <form onSubmit={handleSubmit} className="glass-card-enhanced p-8 space-y-6">
            <div className="relative z-10 space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_15px_oklch(0.65_0.25_195/0.5)] text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 hover:border-primary/50 rounded-lg"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setLoginError(false)
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required
                  className="pl-11 bg-background/50 border-secondary/30 focus:border-secondary focus:ring-2 focus:ring-secondary/50 focus:shadow-[0_0_15px_oklch(0.68_0.22_145/0.5)] text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 hover:border-secondary/50 rounded-lg"
                />
              </div>

              {loginError && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
                  <p
                    className="text-sm text-red-500 font-medium"
                    style={{ textShadow: "0 0 10px rgba(239, 68, 68, 0.5)" }}
                  >
                    Incorrect email or password. Please try again.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordModalOpen(true)}
                    className="text-sm text-primary hover:text-primary/80 transition-all duration-300 underline decoration-primary/50 hover:decoration-primary hover:shadow-[0_2px_8px_oklch(0.65_0.25_195/0.6)]"
                    style={{ textShadow: "0 0 8px oklch(0.65 0.25 195 / 0.4)" }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {!loginError && isPasswordFocused && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordModalOpen(true)}
                    className="text-sm text-primary hover:text-primary/80 transition-all duration-300 underline decoration-primary/50 hover:decoration-primary hover:shadow-[0_0_25px_oklch(0.65_0.25_195/0.8)]"
                    style={{ textShadow: "0 0 8px oklch(0.65 0.25 195 / 0.4)" }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <div className="relative z-10 flex justify-center">
              <Button
                type="submit"
                className="px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_oklch(0.65_0.25_195/0.8)] active:scale-95 rounded-lg relative overflow-hidden group"
              >
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </Button>
            </div>

            <div className="relative z-10 text-center">
              <button
                type="button"
                onClick={() => setIsSignUpModalOpen(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Don't have an account? <span className="text-primary font-semibold animate-text-pulse">Sign Up</span>
              </button>
            </div>

            <p className="relative z-10 text-xs text-muted-foreground/70 text-center leading-relaxed">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-primary font-medium hover:text-primary/80 transition-all duration-300 underline decoration-primary/50 hover:decoration-primary hover:shadow-[0_0_2px_oklch(0.65_0.25_195/0.6)]"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-primary font-medium hover:text-primary/80 transition-all duration-300 underline decoration-primary/50 hover:decoration-primary hover:shadow-[0_0_2px_oklch(0.65_0.25_195/0.6)]"
              >
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>
      </div>
      {isSignUpModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsSignUpModalOpen(false)}
        >
          <div
            className="glass-card-enhanced max-w-md w-full mx-4 p-8 relative animate-scale-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSignUpModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <Shield
                className="w-12 h-12 text-primary animate-float mx-auto mb-4"
                style={{ filter: "drop-shadow(0 0 20px oklch(0.65 0.25 195))" }}
              />
              <h2 className="text-3xl font-bold font-mono gradient-text mb-2">Create Your Account</h2>
              <p className="text-sm text-muted-foreground">Join the Red Team training platform</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={() => handleOAuthSignUp("Google")}
                  className="w-full bg-background/50 hover:bg-background/70 text-foreground border-2 border-transparent hover:border-primary transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_20px_oklch(0.65_0.25_195/0.6)] active:scale-95 rounded-lg h-11 font-semibold relative overflow-hidden group"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="relative z-10">Continue with Google</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => handleOAuthSignUp("Microsoft")}
                  className="w-full bg-background/50 hover:bg-background/70 text-foreground border-2 border-transparent hover:border-[#00A4EF] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,164,239,0.6)] active:scale-95 rounded-lg h-11 font-semibold relative overflow-hidden group"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M0 0h11v11H0z" />
                    <path fill="#81bc06" d="M12 0h11v11H12z" />
                    <path fill="#05a6f0" d="M0 12h11v11H0z" />
                    <path fill="#ffba08" d="M12 12h11v11H12z" />
                  </svg>
                  <span className="relative z-10">Continue with Microsoft</span>
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">or sign up with email</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={signUpFullName}
                    onChange={(e) => setSignUpFullName(e.target.value)}
                    required
                    className="pl-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_15px_oklch(0.65_0.25_195/0.5)] text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 hover:border-primary/50 rounded-lg h-11"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    className="pl-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_15px_oklch(0.65_0.25_195/0.5)] text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 hover:border-primary/50 rounded-lg h-11"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    className="pl-11 bg-background/50 border-secondary/30 focus:border-secondary focus:ring-2 focus:ring-secondary/50 focus:shadow-[0_0_15px_oklch(0.68_0.22_145/0.5)] text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 hover:border-secondary/50 rounded-lg h-11"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    required
                    className="pl-11 bg-background/50 border-secondary/30 focus:border-secondary focus:ring-2 focus:ring-secondary/50 focus:shadow-[0_0_15px_oklch(0.68_0.22_145/0.5)] text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 hover:border-secondary/50 rounded-lg h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_oklch(0.65_0.25_195/0.8)] active:scale-95 rounded-lg h-11 relative overflow-hidden group"
                >
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </Button>
              </form>

              <p className="text-xs text-muted-foreground/70 text-center leading-relaxed">
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className="text-primary font-medium hover:text-primary/80 transition-all duration-300 underline"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-primary font-medium hover:text-primary/80 transition-all duration-300 underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}
      {isForgotPasswordModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            if (!isResetting) {
              setIsForgotPasswordModalOpen(false)
            }
          }}
        >
          <div
            className="glass-card-enhanced max-w-md w-full mx-4 p-8 relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                if (!isResetting) {
                  setIsForgotPasswordModalOpen(false)
                  setShowResetConfirmation(false)
                  setResetEmail("")
                }
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
              disabled={isResetting}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-mono mb-4">Reset Your Password</h3>

              {!showResetConfirmation ? (
                <>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Enter your registered email to receive a password reset link.
                  </p>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        disabled={isResetting}
                        className="pl-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_15px_oklch(0.65_0.25_195/0.5)] text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 hover:border-primary/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isResetting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_oklch(0.65_0.25_195/0.8)] active:scale-95 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                    >
                      {isResetting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <>
                          <span className="relative z-10">Send Reset Link</span>
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <p
                    className="text-secondary font-medium mb-2"
                    style={{ textShadow: "0 0 10px oklch(0.68 0.22 145)" }}
                  >
                    Password reset link sent!
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A password reset link has been sent to your email.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
