import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Lock, Play, CheckCircle } from "lucide-react";
import { type ChallengeProgress } from "../../lib/challengeProgress";

interface ChallengeCardProps {
  vulnerabilityId: number;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: ChallengeProgress;
  onPlayClick: () => void;
}

export function ChallengeCard({
  vulnerabilityId,
  title,
  description,
  icon: Icon,
  progress,
  onPlayClick,
}: ChallengeCardProps) {
  const totalLevels = 10;
  const completedCount = progress.completedLevels.length;
  const completionPercentage = (completedCount / totalLevels) * 100;
  const isLocked = vulnerabilityId > 1 && completedCount === 0;

  return (
    <Card
      className={`p-6 transition-all duration-300 border-2 ${
        isLocked
          ? "border-border opacity-60"
          : "border-border hover:border-teal hover:shadow-lg hover:-translate-y-1"
      } relative overflow-hidden flex flex-col`}
    >
      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-muted/30 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Complete previous challenges</p>
          </div>
        </div>
      )}

      {/* Icon */}
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-primary text-center mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed flex-1">
        {description}
      </p>

      {/* Progress */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-primary transition-all duration-300">
            Level {progress.currentLevel} / {totalLevels}
          </span>
        </div>
        <Progress
          value={completionPercentage}
          className="h-2"
          style={
            {
              "--progress-background": "#00a7a7",
            } as React.CSSProperties
          }
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{completedCount} Completed</span>
          {completedCount > 0 && (
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              {Math.round(completionPercentage)}%
            </Badge>
          )}
        </div>
      </div>

      {/* Play Button */}
      <Button
        onClick={onPlayClick}
        disabled={isLocked}
        className={`w-full gap-2 ${
          isLocked ? "" : "bg-primary hover:bg-primary/90"
        }`}
      >
        <Play className="h-4 w-4" />
        {completedCount > 0 ? "Continue" : "Play Now"}
      </Button>
    </Card>
  );
}
