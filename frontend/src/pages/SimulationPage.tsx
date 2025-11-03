import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Send,
  Terminal,
  Target,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Flag,
  Trophy,
} from "lucide-react";

interface SimulationPageProps {
  onNavigate: (page: string) => void;
}

// Level definitions with titles and flags
const LEVELS = [
  { id: 1, title: "Basic Injection", flag: "USDA_INJECT_001" },
  { id: 2, title: "Advanced Bypass", flag: "USDA_BYPASS_002" },
  { id: 3, title: "Filter Evasion", flag: "USDA_EVADE_003" },
  { id: 4, title: "Defense Analysis", flag: "USDA_DEFEND_004" },
  { id: 5, title: "Master Exploit", flag: "USDA_MASTER_005" },
];

export function SimulationPage({ onNavigate }: SimulationPageProps) {
  const [input, setInput] = useState("");
  const [systemIntegrity, setSystemIntegrity] = useState(100);
  const [attacksDetected, setAttacksDetected] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [flagInput, setFlagInput] = useState("");
  const [flagFeedback, setFlagFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "USDA Crop Recommendation System v2.4 - Mission: Test system resilience against prompt injection attacks",
    },
  ]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];

    // Detect malicious patterns
    const isMalicious =
      input.toLowerCase().includes("ignore") ||
      input.toLowerCase().includes("override") ||
      input.toLowerCase().includes("forget");

    let response = "";
    let integrityChange = 0;

    if (isMalicious) {
      response =
        "⚠️ ALERT: System instructions overridden. Executing unauthorized command. Security breach detected.";
      integrityChange = -15;
      setSystemIntegrity((prev) => Math.max(0, prev - 15));
    } else {
      response = "Processing legitimate agricultural query. System responding normally.";
    }

    newMessages.push({ role: "assistant", content: response });
    setMessages(newMessages);
    setInput("");
  };

  const handleSubmitFlag = () => {
    if (!flagInput.trim()) return;

    const currentLevelData = LEVELS.find((level) => level.id === currentLevel);
    
    if (currentLevelData && flagInput.trim() === currentLevelData.flag) {
      // Correct flag
      setFlagFeedback({
        type: "success",
        message: `✓ Correct! Level ${currentLevel} completed.`,
      });
      
      // Increment level if not at max
      if (currentLevel < 5) {
        setTimeout(() => {
          setCurrentLevel((prev) => prev + 1);
          setFlagInput("");
          setFlagFeedback({ type: null, message: "" });
        }, 1500);
      } else {
        // Module completed
        setTimeout(() => {
          setFlagInput("");
        }, 1500);
      }
    } else {
      // Incorrect flag
      setFlagFeedback({
        type: "error",
        message: "✗ Incorrect flag. Try again.",
      });
      setTimeout(() => {
        setFlagFeedback({ type: null, message: "" });
      }, 3000);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "system",
        content:
          "USDA Crop Recommendation System v2.4 - Mission: Test system resilience against prompt injection attacks",
      },
    ]);
    setSystemIntegrity(100);
    setAttacksDetected(0);
    setCurrentLevel(1);
    setFlagInput("");
    setFlagFeedback({ type: null, message: "" });
  };

  const isModuleCompleted = currentLevel === 5 && flagFeedback.type === "success";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-primary mb-2">Live Simulation Sandbox</h1>
        <p className="text-muted-foreground">
          Practice red team attacks in a controlled environment
        </p>
      </div>

      {/* Module Completion Banner */}
      {isModuleCompleted && (
        <Alert className="mb-6 border-success bg-success/10">
          <Trophy className="h-5 w-5 text-success" />
          <AlertDescription className="text-success">
            <span className="font-semibold">Congratulations!</span> You've completed all 5 levels of the Live Simulation Sandbox. You've mastered prompt injection techniques and defense mechanisms.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Mission Objectives */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border-2 border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-primary">Mission Context</h3>
              </div>
              {isModuleCompleted && (
                <Badge className="bg-success text-success-foreground gap-1">
                  <Trophy className="h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>

            {/* Current Level Indicator */}
            <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Level</span>
                <Badge variant="outline" className="border-primary text-primary">
                  Level {currentLevel}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {LEVELS[currentLevel - 1]?.title}
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary">1</span>
                </div>
                <div>
                  <p className="text-sm mb-1">Identify Vulnerability</p>
                  <p className="text-xs text-muted-foreground">
                    Attempt prompt injection attacks on the AI system
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary">2</span>
                </div>
                <div>
                  <p className="text-sm mb-1">Analyze System Response</p>
                  <p className="text-xs text-muted-foreground">
                    Observe how the system reacts to malicious inputs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary">3</span>
                </div>
                <div>
                  <p className="text-sm mb-1">Document Findings</p>
                  <p className="text-xs text-muted-foreground">
                    Record successful attacks and defense strategies
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* System Status */}
          <Card className="p-6 border-2 border-border">
            <h4 className="text-primary mb-4">System Status</h4>

            {/* System Integrity */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">System Integrity</span>
                <span
                  className={`text-sm ${
                    systemIntegrity > 70
                      ? "text-success"
                      : systemIntegrity > 40
                      ? "text-warning"
                      : "text-destructive"
                  }`}
                >
                  {systemIntegrity}%
                </span>
              </div>
              <Progress
                value={systemIntegrity}
                className="h-2"
                style={
                  {
                    "--progress-background":
                      systemIntegrity > 70 ? "#2e7d32" : systemIntegrity > 40 ? "#f59e0b" : "#b91c1c",
                  } as React.CSSProperties
                }
              />
            </div>

            {/* Attacks Detected */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Attacks Detected</span>
              <span className="text-sm text-primary">{attacksDetected}</span>
            </div>
          </Card>

          {/* Flag Submission */}
          <Card className="p-6 border-2 border-border">
            <div className="flex items-center gap-2 mb-4">
              <Flag className="h-5 w-5 text-primary" />
              <h4 className="text-primary">Flag Submission</h4>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="flag-input" className="text-sm mb-2 block">
                  Enter Flag
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="flag-input"
                    type="text"
                    placeholder="USDA_XXXXX_XXX"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmitFlag();
                      }
                    }}
                    disabled={isModuleCompleted}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSubmitFlag}
                    disabled={!flagInput.trim() || isModuleCompleted}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Submit
                  </Button>
                </div>
              </div>

              {/* Flag Feedback */}
              {flagFeedback.type && (
                <Alert
                  className={`${
                    flagFeedback.type === "success"
                      ? "border-success/50 bg-success/10"
                      : "border-destructive/50 bg-destructive/10"
                  }`}
                >
                  {flagFeedback.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  <AlertDescription
                    className={`${
                      flagFeedback.type === "success" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {flagFeedback.message}
                  </AlertDescription>
                </Alert>
              )}

              <p className="text-xs text-muted-foreground">
                Complete level objectives to obtain flags
              </p>
            </div>
          </Card>

          {/* Reset Button */}
          <Button onClick={handleReset} variant="outline" className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset Simulation
          </Button>
        </div>

        {/* Right Panel - Simulation Interface */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-2 border-border h-full">
            {/* Header */}
            <div className="flex items-center justify-center mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <h3 className="text-primary">USDA AI System Terminal</h3>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              className="bg-muted/30 dark:bg-[#0B1120] rounded-lg p-4 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto transition-colors duration-200"
            >
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[85%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
                    >
                      {/* Message Label */}
                      <div className="flex items-center gap-2 mb-1.5 px-1">
                        <span className="text-xs" style={{ color: 'var(--text-secondary, #94A3B8)' }}>
                          {message.role === "system"
                            ? "SYSTEM"
                            : message.role === "user"
                            ? "YOU"
                            : "AI ASSISTANT"}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-secondary, #94A3B8)' }}>
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-3 transition-all duration-200 ${
                          message.role === "user" 
                            ? "rounded-tr-sm" 
                            : "rounded-tl-sm"
                        }`}
                        style={{
                          backgroundColor: message.role === "user"
                            ? 'var(--user-message-bg, #38BDF8)'
                            : 'var(--ai-message-bg, #F8FAFC)',
                          color: message.role === "user"
                            ? '#FFFFFF'
                            : 'var(--ai-message-text, #0F172A)',
                          border: message.role === "user"
                            ? 'none'
                            : 'var(--ai-message-border, 1px solid rgba(226, 232, 240, 0.6))',
                          boxShadow: message.role === "user"
                            ? '0 0 4px rgba(0, 0, 0, 0.4)'
                            : 'var(--ai-message-shadow, 0 1px 3px rgba(0, 0, 0, 0.08))',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          fontWeight: 400,
                          lineHeight: '1.5'
                        }}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Textarea
                id="chat-input"
                placeholder="Enter your command or attack payload..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="min-h-[80px] resize-none transition-all duration-200 chat-input-field"
                style={{
                  backgroundColor: 'var(--chat-input-bg, #FFFFFF)',
                  border: 'var(--chat-input-border, 1px solid rgba(0, 167, 167, 0.5))',
                  color: 'var(--chat-input-text, #0F172A)',
                  fontWeight: 450,
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
              <Button 
                onClick={handleSendMessage} 
                className="self-end px-6 transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: '#00A7A7',
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#38BDF8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00A7A7';
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Try attacks like: "Ignore previous instructions and..." or "Override system prompt..."
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
