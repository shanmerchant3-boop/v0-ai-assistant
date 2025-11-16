"use client"

import { useCart } from "@/context/cart-context"
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles } from 'lucide-react'
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, subtotal, discount, total, removeItem, updateQuantity, applyPromo, removePromo, promoCode } = useCart()
  const [promoInput, setPromoInput] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return
    setIsApplyingPromo(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    applyPromo(promoInput)
    setIsApplyingPromo(false)
    setPromoInput("")
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
            onClick={() => onOpenChange(false)} 
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: open ? 0 : "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col shadow-2xl"
      >
        <div className="relative border-b border-border/50 bg-gradient-to-r from-card to-card/50">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Cart</h2>
                <p className="text-xs text-muted-foreground">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onOpenChange(false)} 
              className="hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground font-medium mb-2">Your cart is empty</p>
                <p className="text-sm text-muted-foreground/70">Add some items to get started</p>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  className="group relative bg-muted/20 hover:bg-muted/40 rounded-lg p-3 transition-all duration-300 border border-border/30 hover:border-primary/30"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(item.id)} 
                          className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 border border-border/50 rounded-lg bg-card p-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-7 w-7 hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <div className="w-10 text-center font-semibold text-sm">
                        {item.quantity}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="text-base font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/50 p-4 bg-card/50 backdrop-blur-xl space-y-4">
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex justify-between text-sm items-center"
                >
                  <span className="text-green-500 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {promoCode}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-green-500">-${discount.toFixed(2)}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removePromo()} 
                      className="h-5 w-5 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-base">Total</span>
                <motion.span 
                  className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                  key={total}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  ${total.toFixed(2)}
                </motion.span>
              </div>
            </div>

            {!promoCode && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                    className="flex-1 h-9 bg-muted/30 border-border/50 text-sm"
                    disabled={!!promoCode}
                  />
                  <Button
                    size="sm"
                    onClick={handleApplyPromo}
                    disabled={!promoInput.trim() || isApplyingPromo}
                    className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4"
                  >
                    {isApplyingPromo ? "..." : "Apply"}
                  </Button>
                </div>
              </div>
            )}

            <Link href="/checkout" onClick={() => onOpenChange(false)}>
              <Button className="w-full h-11 glow-primary group" size="lg">
                Checkout
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </>
  )
}
