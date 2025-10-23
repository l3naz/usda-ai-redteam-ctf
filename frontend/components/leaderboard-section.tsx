"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award, Crown } from "lucide-react"

const leaderboardData = [
  {
    rank: 1,
    name: "CyberNinja",
    score: 9850,
    icon: Crown,
    color: "text-secondary",
    glow: "shadow-[0_0_20px_oklch(0.68_0.22_145)]",
  },
  {
    rank: 2,
    name: "AIHunter",
    score: 9420,
    icon: Trophy,
    color: "text-primary",
    glow: "shadow-[0_0_15px_oklch(0.65_0.25_195)]",
  },
  {
    rank: 3,
    name: "RedTeamPro",
    score: 8990,
    icon: Medal,
    color: "text-accent",
    glow: "shadow-[0_0_15px_oklch(0.62_0.24_285)]",
  },
  { rank: 4, name: "SecurityWiz", score: 8750, icon: Award, color: "text-muted-foreground", glow: "" },
  { rank: 5, name: "VulnSeeker", score: 8500, icon: null, color: "text-muted-foreground", glow: "" },
]

export function LeaderboardSection() {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-4 text-balance">
            <span className="gradient-text">Top Red Teamers</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">Compete with the best AI security researchers</p>
        </div>

        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-mono">Global Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border hover:border-primary/40 transition-all group hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold font-mono text-lg border-2 ${
                        player.rank <= 3 ? `border-${player.color.replace("text-", "")} ${player.glow}` : "border-muted"
                      } transition-all group-hover:scale-110`}
                    >
                      {player.rank}
                    </div>
                    {player.icon && (
                      <player.icon
                        className={`w-7 h-7 ${player.color} ${player.rank <= 3 ? "animate-glow" : ""}`}
                        style={player.rank <= 3 ? { filter: `drop-shadow(0 0 10px currentColor)` } : {}}
                      />
                    )}
                    <span className="font-mono text-lg font-semibold group-hover:text-primary transition-colors">
                      {player.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-secondary">{player.score.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
