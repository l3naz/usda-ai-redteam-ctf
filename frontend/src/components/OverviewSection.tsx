import { Card } from "./ui/card";
import { Play, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef } from "react";

interface OverviewSectionProps {
  onComplete?: () => void;
}

export function OverviewSection({ onComplete }: OverviewSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hasMarkedComplete = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasMarkedComplete.current && onComplete) {
            // Mark complete after user views section for 2 seconds
            setTimeout(() => {
              if (!hasMarkedComplete.current) {
                onComplete();
                hasMarkedComplete.current = true;
              }
            }, 2000);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [onComplete]);

  return (
    <section ref={sectionRef}>
      <h2 className="mb-4 text-primary">Overview</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Text Content */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-6 shadow-sm border-border">
            <div className="flex gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-primary mb-2">What is Prompt Injection?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Prompt injection is a vulnerability where malicious users manipulate AI system inputs 
                  to override original instructions, bypass safety controls, or access restricted 
                  functionality. This attack vector can lead to unauthorized data access, content 
                  manipulation, or system compromise.
                </p>
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mt-4">
              <h4 className="mb-2 text-primary">Impact on USDA Systems</h4>
              <p className="text-muted-foreground leading-relaxed">
                In agricultural AI systems, prompt injection attacks could result in incorrect 
                recommendations to farmers, unauthorized access to sensitive crop data, or 
                manipulation of automated decision-making processes affecting food safety and 
                supply chain operations.
              </p>
            </div>
          </Card>
        </div>

        {/* Video Placeholder */}
        <div className="md:col-span-1">
          <Card className="p-6 shadow-sm border-border h-full">
            <h4 className="mb-3 text-primary">Quick Explainer</h4>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
              <Button 
                size="lg" 
                className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90"
              >
                <Play className="h-8 w-8 fill-current" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              1-minute overview of prompt injection vulnerabilities
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
