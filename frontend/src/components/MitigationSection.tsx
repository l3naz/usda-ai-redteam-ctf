import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Download, CheckCircle2, Shield } from "lucide-react";

const mitigationItems = [
  {
    id: "input-validation",
    title: "Implement Input Validation",
    description: "Validate and sanitize all user inputs before processing",
  },
  {
    id: "context-separation",
    title: "Separate Instructions from User Content",
    description: "Maintain clear boundaries between system prompts and user inputs",
  },
  {
    id: "output-filtering",
    title: "Filter Model Outputs",
    description: "Monitor and filter AI responses for potential information leakage",
  },
  {
    id: "rate-limiting",
    title: "Apply Rate Limiting",
    description: "Limit request frequency to prevent automated attack attempts",
  },
  {
    id: "audit-logging",
    title: "Enable Comprehensive Logging",
    description: "Log all interactions for security monitoring and incident response",
  },
  {
    id: "privilege-control",
    title: "Enforce Least Privilege Access",
    description: "Limit AI system permissions to only necessary resources",
  },
];

interface MitigationSectionProps {
  onComplete?: () => void;
}

export function MitigationSection({ onComplete }: MitigationSectionProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const hasMarkedComplete = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasMarkedComplete.current && onComplete) {
            // Mark complete after user views section for 3 seconds
            setTimeout(() => {
              if (!hasMarkedComplete.current) {
                onComplete();
                hasMarkedComplete.current = true;
              }
            }, 3000);
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

  const toggleItem = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDownload = () => {
    // Simulate PDF download
    alert("Downloading Mitigation Checklist PDF...");
  };

  return (
    <section ref={sectionRef}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-primary">Mitigation & Best Practices</h2>
        <Button 
          variant="outline" 
          onClick={handleDownload}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="p-6 shadow-sm border-border">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-primary">Implementation Checklist</h3>
          </div>

          <div className="space-y-3">
            {mitigationItems.map((item) => {
              const isChecked = checkedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => toggleItem(item.id)}
                >
                  <Checkbox
                    id={item.id}
                    checked={isChecked}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={item.id}
                      className={`cursor-pointer transition-colors ${
                        isChecked ? "text-muted-foreground line-through" : "text-card-foreground"
                      }`}
                    >
                      {item.title}
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                  {isChecked && (
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Completed: {checkedItems.length} / {mitigationItems.length}
              </span>
              {checkedItems.length === mitigationItems.length && (
                <div className="flex items-center gap-2 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>All practices reviewed!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
