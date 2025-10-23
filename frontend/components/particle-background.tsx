"use client"

export default function ParticleBackground() {
  // Generate 50 particles with varying properties
  const colors = [
    "oklch(0.65 0.25 195)", // Neon cyan-blue
    "oklch(0.68 0.22 145)", // Neon green
    "oklch(0.62 0.24 285)", // Purple
    "oklch(0.7 0.2 180)", // Cyan
  ]

  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1, // 1-3px
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.15 + 0.15, // 0.15-0.3
    duration: Math.random() * 10 + 15, // 15-25s
    delay: Math.random() * 15, // 0-15s
  }))

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-background">
      {/* Grid background */}
      <div className="absolute inset-0 grid-background opacity-30" />

      {/* Glowing particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-particle-float"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}, 0 0 ${particle.size * 6}px ${particle.color}`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
