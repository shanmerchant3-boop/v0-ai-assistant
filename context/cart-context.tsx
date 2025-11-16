"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"
import { PROMO_CODES } from "@/lib/products"

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
  variant?: {
    name: string
    price: number
  }
}

interface CartContextType {
  items: CartItem[]
  promoCode: string | null
  discount: number
  subtotal: number
  total: number
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  applyPromo: (code: string) => boolean
  removePromo: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedCart = localStorage.getItem("cart")
    const savedPromo = localStorage.getItem("promoCode")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      } catch (e) {
        console.error("Failed to parse cart:", e)
      }
    }
    if (savedPromo) setPromoCode(savedPromo)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  const subtotal = items.reduce((sum, item) => {
    const itemTotal = (item.price || 0) * (item.quantity || 0)
    return sum + itemTotal
  }, 0)

  const calculateDiscount = () => {
    if (!promoCode) return 0
    const promo = PROMO_CODES[promoCode]
    if (!promo) return 0
    return promo.type === "percent" ? (subtotal * promo.discount) / 100 : Math.min(promo.discount, subtotal)
  }

  const currentDiscount = calculateDiscount() || 0
  const total = Math.max(0, subtotal - currentDiscount)

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    toast.success("Added to cart")
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }

  const applyPromo = (code: string) => {
    const trimmedCode = code.trim().toUpperCase()
    if (!PROMO_CODES[trimmedCode]) {
      toast.error("Invalid promo code")
      return false
    }
    setPromoCode(trimmedCode)
    localStorage.setItem("promoCode", trimmedCode)
    toast.success(`Promo code "${trimmedCode}" applied!`)
    return true
  }

  const removePromo = () => {
    setPromoCode(null)
    localStorage.removeItem("promoCode")
    toast.success("Promo code removed")
  }

  const clearCart = () => {
    setItems([])
    setPromoCode(null)
    localStorage.removeItem("cart")
    localStorage.removeItem("promoCode")
  }

  return (
    <CartContext.Provider
      value={{
        items,
        promoCode,
        discount: currentDiscount,
        subtotal,
        total,
        addItem,
        removeItem,
        updateQuantity,
        applyPromo,
        removePromo,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
