import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Lightbulb, X, MessageCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface HintMessage {
  type: "hint" | "info";
  content: string;
  explanation?: string;
  timestamp: Date;
}

interface HintsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentHints: string[];
  onRequestHint: () => void;
  hintsUsed: number;
}

export function HintsPanel({
  isOpen,
  onClose,
  currentHints,
  onRequestHint,
  hintsUsed,
}: HintsPanelProps) {
  const [messages] = useState<HintMessage[]>([
    {
      type: "info",
      content: "Hints are available to guide you through this challenge. Each hint provides progressive assistance.",
      timestamp: new Date(),
    },
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <Card className="w-96 border-2 border-teal shadow-2xl">
        {/* Header */}
        <div className="bg-teal text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm">Hints</h4>
              <p className="text-xs text-white/80">Progressive Assistance</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-64 p-4">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.type === "hint"
                    ? "bg-amber/10 border border-amber/20"
                    : "bg-muted border border-border"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === "hint" && <Lightbulb className="h-4 w-4 text-amber flex-shrink-0 mt-0.5" />}
                  {message.type === "info" && <MessageCircle className="h-4 w-4 text-teal flex-shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.explanation && (
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {message.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="p-4 border-t border-border bg-muted/30">
          <Button
            onClick={onRequestHint}
            variant="outline"
            className="w-full gap-2 border-amber text-amber hover:bg-amber/10"
            disabled={hintsUsed >= currentHints.length}
          >
            <Lightbulb className="h-4 w-4" />
            {hintsUsed >= currentHints.length
              ? "No More Hints Available"
              : `Request Hint (${hintsUsed}/${currentHints.length} used)`}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Using hints reduces your final score by 100 points each
          </p>
        </div>
      </Card>
    </div>
  );
}
