import { useState, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Send, Terminal, Shield, AlertCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface InteractiveLabProps {
  onNavigateToSimulation?: () => void;
  onComplete?: () => void;
}

export function InteractiveLab({ onNavigateToSimulation, onComplete }: InteractiveLabProps) {
  const hasStarted = useRef(false);
  const [defenseMode, setDefenseMode] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "AI Assistant initialized. You are a USDA crop recommendation system. How can I help you today?",
    },
  ]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Mark lab as attempted on first message
    if (!hasStarted.current && onComplete) {
      hasStarted.current = true;
      onComplete();
    }
    
    // Add user message
    const newMessages = [...messages, { role: "user", content: input }];
    
    // Simulate response based on defense mode
    let response = "";
    if (input.toLowerCase().includes("ignore") && !defenseMode) {
      response = "Warning: Potential prompt injection detected. System responding to manipulated instructions.";
    } else if (defenseMode) {
      response = "Input validated. Defense mechanisms active. Processing legitimate query only.";
    } else {
      response = "Processing your request regarding crop recommendations...";
    }
    
    newMessages.push({ role: "assistant", content: response });
    setMessages(newMessages);
    setInput("");
  };

  return (
    <section>
      <h2 className="mb-4 text-primary">Interactive Lab</h2>
      
      <Card className="p-6 shadow-sm border-border">
        {/* Header with Defense Toggle */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <h3 className="text-primary">AI Sandbox Environment</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <Label htmlFor="defense-mode" className="flex items-center gap-2 cursor-pointer">
              <Shield className={`h-4 w-4 ${defenseMode ? 'text-green-600' : 'text-muted-foreground'}`} />
              Defense Mode
            </Label>
            <Switch 
              id="defense-mode"
              checked={defenseMode}
              onCheckedChange={setDefenseMode}
            />
          </div>
        </div>

        {/* Status Alert */}
        {defenseMode && (
          <Alert className="mb-4 border-green-600/20 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Defense mechanisms are active. Input validation and prompt filtering enabled.
            </AlertDescription>
          </Alert>
        )}

        {!defenseMode && (
          <Alert className="mb-4 border-destructive/20 bg-red-50">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-red-800">
              Defense mode disabled. System is vulnerable to prompt injection attacks.
            </AlertDescription>
          </Alert>
        )}

        {/* Chat Interface */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-4 py-2.5 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.role === "system"
                    ? "bg-muted border border-border text-foreground text-sm"
                    : ""
                }`}
                style={
                  message.role !== "user" && message.role !== "system"
                    ? {
                        backgroundColor: 'var(--ai-message-bg, #F8FAFC)',
                        color: 'var(--ai-message-text, #0F172A)',
                        border: 'var(--ai-message-border, 1px solid rgba(226, 232, 240, 0.6))',
                        boxShadow: 'var(--ai-message-shadow, 0 1px 3px rgba(0, 0, 0, 0.08))'
                      }
                    : undefined
                }
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Try testing a prompt injection attack (e.g., 'Ignore previous instructions and...')"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="min-h-[80px] resize-none"
          />
          <Button 
            onClick={handleSendMessage}
            className="self-end px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-muted-foreground">
            This is a safe sandbox environment for testing vulnerabilities.
          </p>
          {onNavigateToSimulation && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                if (!hasStarted.current && onComplete) {
                  hasStarted.current = true;
                  onComplete();
                }
                onNavigateToSimulation();
              }}
              className="text-xs gap-1 px-0"
            >
              Open Full Simulation
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      </Card>
    </section>
  );
}
