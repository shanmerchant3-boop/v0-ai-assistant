"use client"

import { useState, useEffect } from "react"

interface CartItem {
  id: number
  name: string
  price: number
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) {
      setItems(JSON.parse(saved))
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (item: CartItem) => {
    setItems([...items, item])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const clearCart = () => {
    setItems([])
  }

  return {
    items,
    addItem,
    removeItem,
    clearCart,
  }
}
