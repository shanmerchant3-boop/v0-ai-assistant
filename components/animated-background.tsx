"use client"

import { motion } from "framer-motion"

export function AnimatedBackground() {
  const generateShapes = () => {
    return Array.from({ length: 8 }).map((_, i) => {
      const size = Math.random() * 200 + 100
      const duration = Math.random() * 20 + 15
      const delay = Math.random() * 5

      return (
        <motion.div
          key={i}
          className="absolute opacity-10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: 360,
          }}
          transition={{
            duration,
            delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
          style={{
            width: size,
            height: size,
          }}
        >
          {i % 3 === 0 ? (
            <div className="w-full h-full border-2 border-primary rounded-lg transform rotate-45" />
          ) : i % 3 === 1 ? (
            <div className="w-full h-full border-2 border-accent rounded-full" />
          ) : (
            <div className="w-full h-full border-2 border-primary/50 bg-gradient-to-br from-primary/10 to-accent/10" />
          )}
        </motion.div>
      )
    })
  }

  return <div className="fixed inset-0 pointer-events-none overflow-hidden">{generateShapes()}</div>
}
