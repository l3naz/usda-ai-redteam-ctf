import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "Built for USDA AI Security Training - Empowering the next generation of AI security professionals.",
    author: "USDA Partnership",
    role: "Government Initiative",
  },
  {
    quote: "An innovative approach to teaching AI red teaming through gamification and hands-on challenges.",
    author: "Security Researcher",
    role: "Cybersecurity Expert",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-4 text-balance">
            <span className="gradient-text">Trusted & Endorsed</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Recognized by industry leaders and government agencies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-card hover:border-primary/40 transition-all group">
              <CardContent className="p-8">
                <Quote className="w-10 h-10 text-primary mb-4 opacity-50" />
                <p className="text-lg text-foreground mb-6 leading-relaxed italic">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-bold font-mono text-lg">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold font-mono text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
