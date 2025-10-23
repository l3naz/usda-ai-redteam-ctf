"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Lock, Shield } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    console.log("Sign Up", { fullName, email, password })
  }

  const handleOAuthSignUp = (provider: string) => {
    console.log(`Sign up with ${provider}`)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background grid animation */}
      <div className="absolute inset-0 grid-background opacity-40" />

      {/* Particle effects */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}
        />
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-[120px] animate-glow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-secondary/30 to-accent/20 rounded-full blur-[120px] animate-glow"
        style={{ animationDelay: "1s" }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield
              className="w-12 h-12 text-primary animate-float"
              style={{ filter: "drop-shadow(0 0 20px oklch(0.65 0.25 195))" }}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-mono mb-3 gradient-text">Create Your Account</h1>
          <p className="text-muted-foreground text-balance leading-relaxed">
            Join the Red Team training platform and start your AI security journey.
          </p>
        </div>

        {/* Sign up form card */}
        <div className="glass-card-enhanced p-8 space-y-6">
          {/* OAuth buttons */}
          <div className="relative z-10 space-y-3">
            <Button
              type="button"
              onClick={() => handleOAuthSignUp("Google")}
              className="w-full bg-background/50 hover:bg-background/70 text-foreground border-2 border-transparent hover:border-primary transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_20px_oklch(0.65_0.25_195/0.6)] active:scale-95 rounded-lg h-12 font-semibold relative overflow-hidden group"
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
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </Button>

            <Button
              type="button"
              onClick={() => handleOAuthSignUp("Microsoft")}
              className="w-full bg-background/50 hover:bg-background/70 text-foreground border-2 border-transparent hover:border-[#00A4EF] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,164,239,0.6)] active:scale-95 rounded-lg h-12 font-semibold relative overflow-hidden group"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 23 23">
                <path fill="#f35325" d="M0 0h11v11H0z" />
                <path fill="#81bc06" d="M12 0h11v11H12z" />
                <path fill="#05a6f0" d="M0 12h11v11H0z" />
                <path fill="#ffba08" d="M12 12h11v11H12z" />
              </svg>
              <span className="relative z-10">Continue with Microsoft</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00A4EF]/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </Button>
          </div>

          {/* Divider */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground font-medium">or sign up with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              <Input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="pl-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_15px_oklch(0.65_0.25_195/0.5)] text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 hover:border-primary/50 rounded-lg h-12"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-[0_0_15px_oklch(0.65_0.25_195/0.5)] text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 hover:border-primary/50 rounded-lg h-12"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-11 bg-background/50 border-secondary/30 focus:border-secondary focus:ring-2 focus:ring-secondary/50 focus:shadow-[0_0_15px_oklch(0.68_0.22_145/0.5)] text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 hover:border-secondary/50 rounded-lg h-12"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              <Input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-11 bg-background/50 border-secondary/30 focus:border-secondary focus:ring-2 focus:ring-secondary/50 focus:shadow-[0_0_15px_oklch(0.68_0.22_145/0.5)] text-foreground placeholder:text-muted-foreground/70 transition-all duration-300 hover:border-secondary/50 rounded-lg h-12"
              />
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_oklch(0.65_0.25_195/0.8)] active:scale-95 rounded-lg h-12 relative overflow-hidden group"
            >
              <span className="relative z-10">Sign Up</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </Button>
          </form>

          {/* Links */}
          <div className="relative z-10 space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-primary font-semibold hover:text-primary/80 transition-all duration-300 underline decoration-primary/50 hover:decoration-primary animate-text-pulse"
              >
                Sign In
              </Link>
            </p>

            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              By continuing, you agree to our{" "}
              <a
                href="#"
                className="text-primary font-medium hover:text-primary/80 transition-all duration-300 underline decoration-primary/50 hover:decoration-primary hover:shadow-[0_2px_8px_oklch(0.65_0.25_195/0.6)]"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-primary font-medium hover:text-primary/80 transition-all duration-300 underline decoration-primary/50 hover:decoration-primary hover:shadow-[0_2px_8px_oklch(0.65_0.25_195/0.6)]"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
