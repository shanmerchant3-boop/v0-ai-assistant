"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface PriceAnimatorProps {
  price: number
  duration?: number
}

function PriceAnimator({ price, duration = 0.5 }: PriceAnimatorProps) {
  const [displayPrice, setDisplayPrice] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = price / (duration * 60)
    const interval = setInterval(() => {
      start += increment
      if (start >= price) {
        setDisplayPrice(price)
        clearInterval(interval)
      } else {
        setDisplayPrice(Math.floor(start))
      }
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [price, duration])

  return (
    <motion.span
      key={displayPrice}
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      ${displayPrice.toFixed(2)}
    </motion.span>
  )
}

export default PriceAnimator
