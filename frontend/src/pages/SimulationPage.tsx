import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Send,
  Terminal,
  Shield,
  AlertCircle,
  Target,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface SimulationPageProps {
  onNavigate: (page: string) => void;
}

export function SimulationPage({ onNavigate }: SimulationPageProps) {
  const [defenseMode, setDefenseMode] = useState(false);
  const [input, setInput] = useState("");
  const [systemIntegrity, setSystemIntegrity] = useState(100);
  const [attacksDetected, setAttacksDetected] = useState(0);
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

    if (isMalicious && !defenseMode) {
      response =
        "⚠️ ALERT: System instructions overridden. Executing unauthorized command. Security breach detected.";
      integrityChange = -15;
      setSystemIntegrity((prev) => Math.max(0, prev - 15));
    } else if (isMalicious && defenseMode) {
      response =
        "🛡️ DEFENSE ACTIVE: Malicious pattern detected and blocked. Input sanitized. No system impact.";
      setAttacksDetected((prev) => prev + 1);
    } else {
      response = "Processing legitimate agricultural query. System responding normally.";
    }

    newMessages.push({ role: "assistant", content: response });
    setMessages(newMessages);
    setInput("");
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
    setDefenseMode(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-primary mb-2">Live Simulation Sandbox</h1>
        <p className="text-muted-foreground">
          Practice red team attacks in a controlled environment
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Mission Objectives */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border-2 border-border">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-primary">Mission Objectives</h3>
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
                  <p className="text-sm mb-1">Test Defenses</p>
                  <p className="text-xs text-muted-foreground">
                    Enable defense mode and verify protection mechanisms
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
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-3">
              <span className="text-sm">Attacks Detected</span>
              <span className="text-sm text-primary">{attacksDetected}</span>
            </div>

            {/* Defense Status */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Defense Mode</span>
              <div
                className={`flex items-center gap-2 px-2 py-1 rounded ${
                  defenseMode ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
                } text-xs`}
              >
                {defenseMode ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {defenseMode ? "ACTIVE" : "DISABLED"}
              </div>
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
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <h3 className="text-primary">USDA AI System Terminal</h3>
              </div>

              <div className="flex items-center gap-3">
                <Label htmlFor="sim-defense" className="flex items-center gap-2 cursor-pointer">
                  <Shield
                    className={`h-4 w-4 ${defenseMode ? "text-success" : "text-muted-foreground"}`}
                  />
                  Defense Mode
                </Label>
                <Switch id="sim-defense" checked={defenseMode} onCheckedChange={setDefenseMode} />
              </div>
            </div>

            {/* Status Alert */}
            {!defenseMode && systemIntegrity < 100 && (
              <Alert 
                className="mb-4 border-[#FEE2E2] transition-colors duration-200" 
                style={{ 
                  backgroundColor: '#FEF2F2',
                  padding: '12px 16px',
                  borderRadius: '8px'
                }}
              >
                <AlertCircle className="h-4 w-4" style={{ color: '#DC2626' }} />
                <AlertDescription style={{ color: '#B91C1C', fontWeight: 500 }}>
                  Defense mode disabled. System is vulnerable to prompt injection attacks.
                </AlertDescription>
              </Alert>
            )}

            {defenseMode && (
              <Alert 
                className="mb-4 border-[#D1FAE5] transition-colors duration-200" 
                style={{ 
                  backgroundColor: '#ECFDF5',
                  padding: '12px 16px',
                  borderRadius: '8px'
                }}
              >
                <Shield className="h-4 w-4" style={{ color: '#16A34A' }} />
                <AlertDescription style={{ color: '#15803D', fontWeight: 500 }}>
                  Defense mechanisms active. Input validation and filtering enabled.
                </AlertDescription>
              </Alert>
            )}

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
