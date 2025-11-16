"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function GlassCard({ children, className = "", delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className={`
        relative overflow-hidden rounded-xl
        bg-white/5 backdrop-blur-xl border border-white/10
        hover:bg-white/10 hover:border-white/20
        transition-all duration-300
        before:absolute before:inset-0 before:bg-gradient-to-br
        before:from-white/10 before:to-transparent before:pointer-events-none
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
