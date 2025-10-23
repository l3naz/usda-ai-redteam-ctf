"use client"

import { useState, useEffect } from "react"
import { Crown, Trophy, Medal, ArrowUp, ArrowDown, Minus } from "lucide-react"
import Link from "next/link"

interface Player {
  rank: number
  name: string
  score: number
  previousRank?: number
  movement?: "up" | "down" | "none"
  isUpdated?: boolean
}

const initialLeaderboardData: Player[] = [
  { rank: 1, name: "CyberNinja", score: 9850, previousRank: 1, movement: "none" },
  { rank: 2, name: "AIHunter", score: 9420, previousRank: 2, movement: "none" },
  { rank: 3, name: "RedTeamPro", score: 8990, previousRank: 3, movement: "none" },
  { rank: 4, name: "SecurityWiz", score: 8750, previousRank: 4, movement: "none" },
  { rank: 5, name: "VulnSeeker", score: 8500, previousRank: 5, movement: "none" },
  { rank: 6, name: "PromptHacker", score: 8250, previousRank: 6, movement: "none" },
  { rank: 7, name: "DataBreaker", score: 8000, previousRank: 7, movement: "none" },
  { rank: 8, name: "ModelTester", score: 7750, previousRank: 8, movement: "none" },
  { rank: 9, name: "AIGuardian", score: 7500, previousRank: 9, movement: "none" },
  { rank: 10, name: "ThreatHunter", score: 7250, previousRank: 10, movement: "none" },
  { rank: 11, name: "CodeNinja", score: 7000, previousRank: 11, movement: "none" },
  { rank: 12, name: "BugBounty", score: 6750, previousRank: 12, movement: "none" },
  { rank: 13, name: "EthicalHacker", score: 6500, previousRank: 13, movement: "none" },
  { rank: 14, name: "SecOpsExpert", score: 6250, previousRank: 14, movement: "none" },
  { rank: 15, name: "PenTester", score: 6000, previousRank: 15, movement: "none" },
]

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<Player[]>(initialLeaderboardData)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true)

    // Simulate real-time updates every 8 seconds
    const interval = setInterval(() => {
      setLeaderboard((prevLeaderboard) => {
        // Create a copy of the leaderboard
        const updatedLeaderboard = [...prevLeaderboard]

        // Randomly select 2-3 players to update
        const numUpdates = Math.floor(Math.random() * 2) + 2
        const indicesToUpdate = new Set<number>()

        while (indicesToUpdate.size < numUpdates) {
          indicesToUpdate.add(Math.floor(Math.random() * updatedLeaderboard.length))
        }

        // Update selected players' scores
        indicesToUpdate.forEach((index) => {
          const scoreChange = Math.floor(Math.random() * 200) - 50 // -50 to +150 points
          updatedLeaderboard[index] = {
            ...updatedLeaderboard[index],
            score: Math.max(0, updatedLeaderboard[index].score + scoreChange),
            previousRank: updatedLeaderboard[index].rank,
            isUpdated: true,
          }
        })

        // Sort by score and update ranks
        updatedLeaderboard.sort((a, b) => b.score - a.score)
        updatedLeaderboard.forEach((player, index) => {
          const newRank = index + 1
          const oldRank = player.previousRank || newRank

          // Determine movement
          let movement: "up" | "down" | "none" = "none"
          if (newRank < oldRank) movement = "up"
          else if (newRank > oldRank) movement = "down"

          updatedLeaderboard[index] = {
            ...player,
            rank: newRank,
            movement,
          }
        })

        return updatedLeaderboard
      })
    }, 8000)

    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [])

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-2">
          <Crown
            className="w-6 h-6 text-secondary animate-glow"
            style={{ filter: "drop-shadow(0 0 10px oklch(0.68 0.22 145))" }}
          />
          <span className="text-sm font-mono text-secondary">Champion</span>
        </div>
      )
    }
    if (rank === 2) {
      return (
        <div className="flex items-center gap-2">
          <Trophy
            className="w-6 h-6 text-primary animate-glow"
            style={{ filter: "drop-shadow(0 0 10px oklch(0.65 0.25 195))" }}
          />
          <span className="text-sm font-mono text-primary">Elite</span>
        </div>
      )
    }
    if (rank === 3) {
      return (
        <div className="flex items-center gap-2">
          <Medal
            className="w-6 h-6 text-accent animate-glow"
            style={{ filter: "drop-shadow(0 0 10px oklch(0.62 0.24 285))" }}
          />
          <span className="text-sm font-mono text-accent">Master</span>
        </div>
      )
    }
    return null
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "border-secondary shadow-[0_0_20px_oklch(0.68_0.22_145/0.5)]"
    if (rank === 2) return "border-primary shadow-[0_0_15px_oklch(0.65_0.25_195/0.5)]"
    if (rank === 3) return "border-accent shadow-[0_0_15px_oklch(0.62_0.24_285/0.5)]"
    return "border-border"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#000000] to-[#0a0a0f] relative overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 grid-background opacity-20" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl md:text-6xl font-bold font-mono">
              <span className="gradient-text">Global Leaderboard</span>
            </h1>
            {isConnected && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-sm font-mono text-secondary">Live</span>
              </div>
            )}
          </div>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent animate-glow" />
          <p className="text-xl text-muted-foreground mt-6 leading-relaxed">
            Compete with the world's best AI security researchers
          </p>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto space-y-4">
          {leaderboard.map((player, index) => (
            <div
              key={`${player.name}-${player.rank}`}
              className={`
                group relative rounded-xl p-6 transition-all duration-300
                bg-[#0f0f14]/80 backdrop-blur-sm
                border-2 ${getRankColor(player.rank)}
                hover:scale-[1.02] hover:shadow-[0_0_30px_oklch(0.65_0.25_195/0.3)]
                ${player.isUpdated ? "animate-pulse-glow" : ""}
              `}
              style={{
                animation: `slide-up 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left side: Rank, Badge, Name */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Rank number */}
                  <div
                    className={`
                    w-14 h-14 rounded-full flex items-center justify-center
                    font-bold font-mono text-xl shrink-0
                    bg-gradient-to-br from-primary/20 to-accent/20
                    border-2 ${getRankColor(player.rank)}
                    transition-all group-hover:scale-110
                  `}
                  >
                    {player.rank}
                  </div>

                  {/* Badge for top 3 */}
                  <div className="hidden sm:block shrink-0">{getRankBadge(player.rank)}</div>

                  {/* Username and movement indicator */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-mono text-lg md:text-xl font-semibold group-hover:text-primary transition-colors truncate">
                      {player.name}
                    </span>
                    {player.movement === "up" && (
                      <ArrowUp
                        className="w-5 h-5 text-secondary transition-all duration-500"
                        style={{ filter: "drop-shadow(0 0 5px oklch(0.68 0.22 145))" }}
                      />
                    )}
                    {player.movement === "down" && (
                      <ArrowDown
                        className="w-5 h-5 text-destructive transition-all duration-500"
                        style={{ filter: "drop-shadow(0 0 5px oklch(0.65 0.25 25))" }}
                      />
                    )}
                    {player.movement === "none" && (
                      <Minus
                        className="w-5 h-5 text-muted-foreground/50 transition-all duration-500"
                        style={{ filter: "drop-shadow(0 0 2px oklch(0.65 0.02 240))" }}
                      />
                    )}
                  </div>
                </div>

                {/* Right side: Score */}
                <div className="text-right shrink-0">
                  <div className="text-2xl md:text-3xl font-bold font-mono text-secondary">
                    {player.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>

              {/* Mobile badge */}
              <div className="sm:hidden mt-3 flex justify-center">{getRankBadge(player.rank)}</div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center animate-slide-up" style={{ animationDelay: "0.8s" }}>
          <div className="glass-card-enhanced max-w-2xl mx-auto p-8">
            <h3 className="text-2xl font-bold font-mono mb-4 gradient-text">Ready to Climb the Ranks?</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Master AI vulnerabilities, complete challenges, and compete for the top spot
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/challenges"
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-mono font-semibold
                  hover:shadow-[0_0_30px_oklch(0.65_0.25_195/0.6)] transition-all hover:scale-105"
              >
                Start Challenges
              </Link>
              <Link
                href="/"
                className="px-8 py-3 rounded-lg border-2 border-secondary text-secondary font-mono font-semibold
                  hover:bg-secondary/10 hover:shadow-[0_0_20px_oklch(0.68_0.22_145/0.4)] transition-all hover:scale-105"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
