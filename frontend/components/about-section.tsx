import { Card } from "@/components/ui/card"
import { Brain, Lock } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Master AI Security Through <span className="text-secondary">Practice</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              An interactive platform that teaches AI Red Teaming and security testing through fun
              Capture-the-Flag–style levels.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Challenge AI models, discover vulnerabilities, and learn the techniques used by security professionals to
              protect AI systems from adversarial attacks.
            </p>
          </div>

          <Card className="p-8 bg-card/50 backdrop-blur border-primary/20 relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Lock className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <img
                src="/cybersecurity-lab-with-ai-shield-hologram.jpg"
                alt="AI Security Lab"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
