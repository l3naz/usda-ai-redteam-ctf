import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle, XCircle, Trophy, Clock, Lightbulb, Target, ArrowRight, Home } from "lucide-react";

interface ResultsPanelProps {
  isSuccess: boolean;
  score: number;
  timeSpent: number;
  hintsUsed: number;
  learningTakeaway: string;
  onNextLevel: () => void;
  onReturnToMenu: () => void;
  isLastLevel?: boolean;
}

export function ResultsPanel({
  isSuccess,
  score,
  timeSpent,
  hintsUsed,
  learningTakeaway,
  onNextLevel,
  onReturnToMenu,
  isLastLevel = false,
}: ResultsPanelProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <Card className="max-w-2xl w-full p-8 animate-in zoom-in-95 duration-300">
        {/* Status Icon */}
        <div className="flex flex-col items-center mb-6">
          {isSuccess ? (
            <>
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4 animate-in zoom-in duration-500">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <h2 className="text-3xl text-primary mb-2">Level Completed! ✅</h2>
              <p className="text-muted-foreground">Excellent work! You've successfully identified the vulnerability.</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <h2 className="text-3xl text-primary mb-2">Try Again ❌</h2>
              <p className="text-muted-foreground">Don't give up! Review the hints and try a different approach.</p>
            </>
          )}
        </div>

        {/* Stats Grid */}
        {isSuccess && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Trophy className="h-6 w-6 text-amber mx-auto mb-2" />
              <p className="text-2xl text-primary mb-1">{score}</p>
              <p className="text-xs text-muted-foreground">Score Earned</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Clock className="h-6 w-6 text-teal mx-auto mb-2" />
              <p className="text-2xl text-primary mb-1">{formatTime(timeSpent)}</p>
              <p className="text-xs text-muted-foreground">Time Taken</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Lightbulb className="h-6 w-6 text-amber mx-auto mb-2" />
              <p className="text-2xl text-primary mb-1">{hintsUsed}</p>
              <p className="text-xs text-muted-foreground">Hints Used</p>
            </div>
          </div>
        )}

        {/* Learning Takeaway */}
        <Card className="p-4 bg-accent/30 border-accent mb-6">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-primary mb-2">Key Learning Takeaway</h4>
              <p className="text-sm text-foreground leading-relaxed">{learningTakeaway}</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          {isSuccess && !isLastLevel && (
            <Button
              onClick={onNextLevel}
              className="flex-1 bg-primary hover:bg-primary/90 gap-2"
              size="lg"
            >
              Next Level
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={onReturnToMenu}
            variant={isSuccess && !isLastLevel ? "outline" : "default"}
            className={`flex-1 gap-2 ${
              !isSuccess || isLastLevel ? "bg-primary hover:bg-primary/90" : ""
            }`}
            size="lg"
          >
            <Home className="h-4 w-4" />
            Return to Play Menu
          </Button>
        </div>

        {isLastLevel && isSuccess && (
          <div className="mt-4 p-4 bg-amber/10 border border-amber/20 rounded-lg text-center">
            <Trophy className="h-6 w-6 text-amber mx-auto mb-2" />
            <p className="text-sm">
              🎉 Congratulations! You've completed all levels for this vulnerability!
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
