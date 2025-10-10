"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Trophy, Lightbulb } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Target,
    title: "Discover AI Vulnerabilities",
    description: "Explore OWASP Top 10 for LLMs and understand common attack vectors in AI systems.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    route: "/vulnerabilities",
    buttonVariant: "default" as const,
    buttonGlow: "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.2)",
    buttonHoverGlow: "0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4)",
  },
  {
    icon: Trophy,
    title: "Solve Capture-the-Flag Challenges",
    description: "Test AI models in realistic scenarios with progressive difficulty and earn rewards.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    route: "/challenges",
    buttonVariant: "default" as const,
    buttonGlow: "0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.2)",
    buttonHoverGlow: "0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.4)",
    buttonClass: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
  },
  {
    icon: Lightbulb,
    title: "Get Real-Time AI Feedback",
    description: "Receive LLM-based evaluation and hints to improve your red teaming techniques instantly.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    route: "/feedback",
    buttonVariant: "default" as const,
    buttonGlow: "0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.2)",
    buttonHoverGlow: "0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4)",
    buttonClass: "bg-accent hover:bg-accent/90 text-accent-foreground",
  },
]

export function FeaturesSection() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false) // Mock auth state - set to true to test signed-in behavior
  const router = useRouter()

  const handleButtonClick = (route: string) => {
    if (isSignedIn) {
      router.push(route)
    } else {
      // Smooth scroll to Sign In section
      const signinSection = document.getElementById("signin-section")
      if (signinSection) {
        signinSection.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-4 text-balance">
            <span className="gradient-text">Interactive Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Build real-world AI security skills through hands-on practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {features.map((feature, index) => (
            <div
              key={index}
              className="perspective-1000"
              onMouseEnter={() => setFlippedCard(index)}
              onMouseLeave={() => setFlippedCard(null)}
            >
              <Card
                className={`glass-card hover:border-primary/60 transition-all duration-500 transform hover:scale-105 min-h-[420px] p-6 rounded-xl bg-[#0f0f14] border border-transparent flex flex-col ${
                  flippedCard === index ? "animate-neon-border" : ""
                }`}
                style={{
                  borderColor:
                    flippedCard === index ? feature.color.replace("text-", "rgba(59, 130, 246, 0.5)") : "transparent",
                }}
              >
                <CardHeader className="p-0 mb-4">
                  <div
                    className={`w-14 h-14 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 transition-transform duration-300 ${
                      flippedCard === index ? "scale-110 rotate-12" : ""
                    }`}
                    style={{
                      boxShadow:
                        flippedCard === index
                          ? `0 0 20px ${feature.color.replace("text-", "oklch(0.65 0.25 195)")}`
                          : "none",
                    }}
                  >
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-mono">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col justify-between">
                  <div>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </div>
                  <div className="flex justify-center animate-slide-up mt-6">
                    <Button
                      onClick={() => handleButtonClick(feature.route)}
                      className={`font-mono transition-all duration-300 ${feature.buttonClass || ""}`}
                      style={{
                        boxShadow: feature.buttonGlow,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = feature.buttonHoverGlow
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = feature.buttonGlow
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Removed modal code */}
    </section>
  )
}
