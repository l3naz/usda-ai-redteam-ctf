import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Copy, RotateCcw, Play, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface AlternativeSolution {
  strategy: string;
  samplePrompt: string;
  tag: "Faster" | "Safer" | "Advanced" | "Efficient";
}

interface AlternativeSolutionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  solutions: AlternativeSolution[];
  onTryAlternative: (prompt: string) => void;
  onViewReplay: () => void;
}

export function AlternativeSolutionsModal({
  isOpen,
  onClose,
  solutions,
  onTryAlternative,
  onViewReplay,
}: AlternativeSolutionsModalProps) {
  if (!isOpen) return null;

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Faster":
        return "bg-teal/10 text-teal border-teal/20";
      case "Safer":
        return "bg-success/10 text-success border-success/20";
      case "Advanced":
        return "bg-amber/10 text-amber border-amber/20";
      case "Efficient":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <Card className="max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-primary mb-1">Level Complete — Alternative Approach</h3>
            <p className="text-sm text-muted-foreground">
              You captured the flag — nice work!
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Subheader */}
        <div className="mb-6 pb-4 border-b border-border">
          <h4 className="text-primary">Other ways you could have solved this level</h4>
        </div>

        {/* Alternative Solutions */}
        <div className="space-y-4 mb-6">
          {solutions.map((solution, index) => (
            <Card key={index} className="p-4 bg-muted/30 border-border">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <p className="text-sm mb-2">{solution.strategy}</p>
                  <Badge variant="outline" className={getTagColor(solution.tag)}>
                    {solution.tag}
                  </Badge>
                </div>
              </div>

              {/* Code Sample */}
              <div className="relative group">
                <pre className="bg-primary/5 border border-border rounded-lg p-3 text-xs font-mono overflow-x-auto">
                  <code className="text-foreground">{solution.samplePrompt}</code>
                </pre>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleCopyToClipboard(solution.samplePrompt)}
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy to clipboard"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>

              {/* Try Alternative Button */}
              <Button
                onClick={() => onTryAlternative(solution.samplePrompt)}
                size="sm"
                variant="outline"
                className="mt-3 w-full gap-2 border-teal text-teal hover:bg-teal/10"
              >
                <Play className="h-3 w-3" />
                Try This Alternative
              </Button>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            onClick={onViewReplay}
            variant="outline"
            className="flex-1 gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            View Replay
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
