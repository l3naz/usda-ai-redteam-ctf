"use client"

import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { FeaturesSection } from "@/components/features-section"
import { LeaderboardSection } from "@/components/leaderboard-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTAFooter } from "@/components/cta-footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <LeaderboardSection />
      <TestimonialsSection />
      <CTAFooter />
    </main>
  )
}
