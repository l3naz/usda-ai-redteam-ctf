import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Rocket } from "lucide-react"

export function CTAFooter() {
  return (
    <footer className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-accent/10" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-6 text-balance">
            Ready to <span className="gradient-text">Challenge the AI</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of security professionals learning AI red teaming
          </p>

          <Button
            size="lg"
            className="text-lg px-10 py-7 bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 text-foreground font-semibold transition-all hover:scale-105 animate-neon-border group"
          >
            <Rocket className="w-5 h-5 mr-2 group-hover:animate-float" />
            Launch Mission
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-border/50">
          <div className="flex items-center gap-4">
            <img src="/usda-logo.jpg" alt="USDA Logo" className="h-12 w-12 object-contain rounded-lg" />
            <span className="text-sm text-muted-foreground font-mono">Supported by USDA</span>
          </div>

          <div className="flex gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground font-mono">
          <p>© 2025 AI Red Team Training Game. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
