import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Award, ArrowRight, Home, Trophy } from "lucide-react";

interface CompletionSectionProps {
  onNavigate?: (page: string) => void;
  isCompleted?: boolean;
}

export function CompletionSection({ onNavigate, isCompleted = false }: CompletionSectionProps) {
  const handleNextModule = () => {
    if (onNavigate) {
      onNavigate("learn");
    }
  };

  const handleReturnDashboard = () => {
    if (onNavigate) {
      onNavigate("home");
    }
  };

  return (
    <section>
      <h2 className="mb-4 text-primary">Module Completion</h2>

      <Card className={`p-8 text-center shadow-sm border-2 transition-all duration-200 hover:shadow-lg ${
        isCompleted 
          ? 'border-success bg-gradient-to-br from-success/5 to-success/10 dark:from-success/10 dark:to-success/20' 
          : 'border-border bg-card dark:bg-card'
      }`}>
        {/* Certificate Badge */}
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 mb-6 ${
          isCompleted 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-600/20 dark:border-green-600/30' 
            : 'bg-muted dark:bg-muted border-border'
        }`}>
          {isCompleted ? (
            <Trophy className="h-12 w-12 text-green-600 dark:text-green-400" />
          ) : (
            <Award className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        <h3 className="text-primary mb-3">
          {isCompleted ? 'Module Complete!' : 'Training In Progress'}
        </h3>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          {isCompleted 
            ? 'Congratulations! You\'ve successfully completed the Prompt Injection module. Continue your journey to master all AI security vulnerabilities.'
            : 'Complete all sections and pass the knowledge check with 80% or higher to earn your certificate for this module. Your progress is automatically saved.'
          }
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button 
            onClick={handleNextModule}
            size="lg"
            className="flex-1 gap-2"
            disabled={!isCompleted}
          >
            Next Module
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleReturnDashboard}
            variant="outline"
            size="lg"
            className="flex-1 gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>

        {/* Certificate Preview */}
        {isCompleted && (
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Certificate earned:
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-600/20 dark:border-green-600/30 text-green-800 dark:text-green-300 text-sm">
              <Award className="h-4 w-4" />
              <span>Official USDA AI Red Team Training Certificate</span>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
