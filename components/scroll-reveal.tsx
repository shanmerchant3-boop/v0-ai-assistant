"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
}

export function ScrollReveal({ children, direction = "up", delay = 0 }: ScrollRevealProps) {
  const variants = {
    up: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
  }

  return (
    <motion.div
      initial={variants[direction].initial}
      whileInView={variants[direction].animate}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
