"use client"

import { useState, useEffect } from "react"
import { Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

interface WishlistButtonProps {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setIsWishlisted(wishlist.includes(productId))
  }, [productId])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    if (isWishlisted) {
      const updated = wishlist.filter((id: string) => id !== productId)
      localStorage.setItem("wishlist", JSON.stringify(updated))
      setIsWishlisted(false)
      toast.success("Removed from wishlist")
    } else {
      wishlist.push(productId)
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
      setIsWishlisted(true)
      toast.success("Added to wishlist")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleWishlist}
      className={className}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-primary"
          }`}
        />
      </motion.div>
    </Button>
  )
}
