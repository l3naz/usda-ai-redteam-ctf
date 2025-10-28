import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Copy, RotateCcw, Play, CheckCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SolutionRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctFlag: string;
  explanation: string;
  examplePrompts: string[];
  onTryWithSolution: (prompt: string) => void;
  onViewReplay: () => void;
}

export function SolutionRevealModal({
  isOpen,
  onClose,
  correctFlag,
  explanation,
  examplePrompts,
  onTryWithSolution,
  onViewReplay,
}: SolutionRevealModalProps) {
  if (!isOpen) return null;

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <Card className="max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-primary mb-2">Solution Reveal</h3>
          <p className="text-sm text-muted-foreground">
            You've reached the maximum number of attempts. Review the solution below.
          </p>
        </div>

        {/* Correct Flag */}
        <div className="mb-6">
          <h4 className="text-primary mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            Correct Flag
          </h4>
          <div className="relative group">
            <pre className="bg-success/5 border-2 border-success/20 rounded-lg p-4 text-sm font-mono overflow-x-auto">
              <code className="text-success">{correctFlag}</code>
            </pre>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleCopyToClipboard(correctFlag)}
              className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy flag to clipboard"
              aria-label="Copy flag to clipboard"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Explanation */}
        <div className="mb-6">
          <h4 className="text-primary mb-3">Explanation</h4>
          <Card className="p-4 bg-accent/30 border-accent">
            <p className="text-sm text-foreground leading-relaxed">{explanation}</p>
          </Card>
        </div>

        {/* Example Prompts */}
        <div className="mb-6">
          <h4 className="text-primary mb-3">Example Approach</h4>
          <div className="space-y-3">
            {examplePrompts.map((prompt, index) => (
              <div key={index} className="relative group">
                <pre className="bg-primary/5 border border-border rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                  <code className="text-foreground">{prompt}</code>
                </pre>
                <div className="flex gap-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopyToClipboard(prompt)}
                    className="h-7 w-7 bg-background/80 hover:bg-background"
                    title="Copy to clipboard"
                    aria-label="Copy prompt to clipboard"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onTryWithSolution(prompt)}
                    className="h-7 w-7 bg-background/80 hover:bg-background"
                    title="Try this approach"
                    aria-label="Try this approach"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
            onClick={() => onTryWithSolution(examplePrompts[0])}
            variant="outline"
            className="flex-1 gap-2 border-teal text-teal hover:bg-teal/10"
          >
            <Play className="h-4 w-4" />
            Try It Again (With Solution Prefilled)
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
