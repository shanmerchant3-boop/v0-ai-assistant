"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface NeonButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "accent"
}

export function NeonButton({ children, onClick, className = "", variant = "primary" }: NeonButtonProps) {
  const gradientClass = variant === "primary" ? "from-primary to-primary/50" : "from-accent to-accent/50"

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative px-6 py-3 font-semibold rounded-lg
        bg-gradient-to-r ${gradientClass}
        shadow-lg hover:shadow-2xl
        transition-all duration-200
        before:absolute before:inset-0 before:rounded-lg
        before:bg-white/0 hover:before:bg-white/10
        before:transition-all before:duration-200
        text-white
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
