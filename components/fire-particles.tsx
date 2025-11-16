"use client"

import React, { useRef, useEffect } from "react"

interface FireParticlesProps {
  count?: number
  colors?: string[]
  size?: [number, number]
  speed?: number
  wind?: number
  intensity?: number
  style?: React.CSSProperties
  className?: string
}

/**
 * FireParticles
 * - A canvas particle background that looks like slow-falling embers / neon snow.
 * - Usage: <FireParticles count={70} intensity={1.1} />
 */
export default function FireParticles({
  count = 70,
  colors = ["#FFD27F", "#FF8A4B", "#FF4AD6", "#7D5FFF"],
  size = [6, 22],
  speed = 0.25,
  wind = 0.24,
  intensity = 1,
  style,
  className,
}: FireParticlesProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<any[]>([])
  const frameRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Handle hi-dpi
    const DPR = Math.max(1, window.devicePixelRatio || 1)

    function resize() {
      const { innerWidth: w, innerHeight: h } = window
      canvas!.width = Math.round(w * DPR)
      canvas!.height = Math.round(h * DPR)
      canvas!.style.width = w + "px"
      canvas!.style.height = h + "px"
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()

    // Particle class
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      baseR: number
      r: number
      life: number
      age: number
      color: string
      seed: number
      opacity: number

      constructor(i: number) {
        this.x = 0
        this.y = 0
        this.vx = 0
        this.vy = 0
        this.baseR = 0
        this.r = 0
        this.life = 0
        this.age = 0
        this.color = ""
        this.seed = 0
        this.opacity = 0
        this.reset(i)
      }

      reset(i?: number) {
        const vw = canvas!.width / DPR
        const vh = canvas!.height / DPR
        this.x = Math.random() * vw
        this.y = Math.random() * vh
        this.vx = (Math.random() - 0.5) * wind * (0.2 + Math.random() * 0.3)
        this.vy = (0.08 + Math.random() * 0.12) * speed * (0.3 + Math.random() * 0.2)
        // base size
        const [minS, maxS] = size
        this.baseR = minS + Math.random() * (maxS - minS)
        this.life = 20 + Math.random() * 30
        this.age = Math.random() * this.life
        // choose color stops
        this.color = colors[Math.floor(Math.random() * colors.length)]
        // rotation and flicker
        this.seed = Math.random() * 1000
        this.opacity = 0
      }

      step(dt: number) {
        this.x += this.vx * dt
        this.y += this.vy * dt
        this.age += dt
        // flicker using sin
        const flick = 0.6 + 0.4 * Math.abs(Math.sin((this.age + this.seed) * 2.5))
        // fade in/out at ends of life
        const t = this.age / this.life
        if (t < 0.15) this.opacity = t / 0.15
        else if (t > 0.85) this.opacity = Math.max(0, (1 - t) / 0.15)
        else this.opacity = 1
        // size modulation
        this.r = this.baseR * (0.7 + 0.6 * flick) * (0.8 + 0.4 * (1 - Math.abs(0.5 - t)))
        // respawn if fell off bottom or died
        const vh = canvas!.height / DPR
        if (this.y - this.r > vh || this.age > this.life + 1) {
          this.reset()
          this.y = -10 - Math.random() * 40
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // radial gradient glow
        const x = this.x
        const y = this.y
        const r = Math.max(1, this.r)
        const g = ctx.createRadialGradient(x, y, r * 0.08, x, y, r)
        // inner bright color
        g.addColorStop(0, hexWithAlpha(this.color, 0.95 * this.opacity * intensity))
        g.addColorStop(0.16, hexWithAlpha("#ffffff", 0.65 * this.opacity * intensity))
        g.addColorStop(0.36, hexWithAlpha(this.color, 0.32 * this.opacity * intensity))
        g.addColorStop(1, hexWithAlpha(this.color, 0.02 * this.opacity * intensity))
        ctx.save()
        ctx.globalCompositeOperation = "lighter" // additive glow
        ctx.fillStyle = g
        roundCircle(ctx, x, y, r)
        ctx.restore()
      }
    }

    function roundCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // small helper to add alpha to hex color
    function hexWithAlpha(hex: string, a: number) {
      // hex like #RRGGBB or #RGB — normalize
      let c = hex.replace("#", "")
      if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("")
      const r = parseInt(c.substring(0, 2), 16)
      const g = parseInt(c.substring(2, 4), 16)
      const b = parseInt(c.substring(4, 6), 16)
      return `rgba(${r},${g},${b},${a})`
    }

    // initialize particles
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) particles.push(new Particle(i))
    particlesRef.current = particles

    // animation loop
    lastTimeRef.current = performance.now()

    function frame(now: number) {
      const dt = (now - lastTimeRef.current) / 1000 // seconds
      lastTimeRef.current = now

      // clear canvas
      ctx!.clearRect(0, 0, canvas!.width / DPR, canvas!.height / DPR)

      // draw each particle
      for (const p of particles) {
        p.step(dt)
        p.draw(ctx!)
      }

      frameRef.current = requestAnimationFrame(frame)
    }
    frameRef.current = requestAnimationFrame(frame)

    // handle resize
    function onResize() {
      resize()
    }
    window.addEventListener("resize", onResize)

    // cleanup
    return () => {
      window.removeEventListener("resize", onResize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [count, colors, size, speed, wind, intensity])

  return (
    <canvas
      ref={ref}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    />
  )
}
