"use client"

import { motion, AnimatePresence } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { Trash2, Plus, Minus, ShoppingCart, Shield, Zap, Lock, ArrowRight, Tag, Sparkles, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  const { items, removeItem, clearCart, updateQuantity, applyPromo, removePromo, promoCode, subtotal, discount, total } = useCart()
  const [savedItems, setSavedItems] = useState<any[]>([])
  const [promoInput, setPromoInput] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const saveForLater = (item: any) => {
    setSavedItems(prev => [...prev, item])
    removeItem(item.id)
  }

  const moveToCart = (item: any) => {
    setSavedItems(prev => prev.filter(i => i.id !== item.id))
  }

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return
    setIsApplyingPromo(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    applyPromo(promoInput)
    setIsApplyingPromo(false)
    setPromoInput("")
  }

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <motion.div 
              className="relative w-32 h-32 mx-auto"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-20 blur-xl" />
              <div className="relative w-full h-full glass-card flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-primary" />
              </div>
            </motion.div>
            
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold">Your cart is empty</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Discover amazing products and start building your collection
              </p>
            </div>
            
            <Link href="/store">
              <Button size="lg" className="glow-primary group text-lg px-8 py-6">
                Browse Products
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <Link href="/store" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
            <p className="text-base md:text-lg">
              {items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
            </p>
            {savedItems.length > 0 && (
              <>
                <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                  {savedItems.length} saved for later
                </Badge>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.div
                  key={`${item.id}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative"
                >
                  <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex gap-4 md:gap-6">
                        {item.image && (
                          <div className="relative flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted/30">
                            <img 
                              src={item.image || "/placeholder.svg"} 
                              alt={item.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0 space-y-3 md:space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base md:text-lg mb-1 truncate">{item.title}</h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xl md:text-2xl font-bold text-primary">${item.price.toFixed(2)}</span>
                                <span className="text-sm text-muted-foreground">each</span>
                              </div>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeItem(item.id)} 
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                          </div>

                          <Separator className="bg-border/50" />

                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground font-medium">Quantity</span>
                              <div className="flex items-center gap-1 border border-border/50 rounded-lg bg-muted/20 p-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <div className="w-12 text-center font-semibold">
                                  {item.quantity}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xs text-muted-foreground mb-0.5">Item Total</div>
                              <div className="text-xl md:text-2xl font-bold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {savedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Saved for Later
                </h2>
                <div className="grid gap-3">
                  {savedItems.map((item, i) => (
                    <Card key={`saved-${item.id}-${i}`} className="border-border/30">
                      <CardContent className="p-4">
                        <div className="flex gap-4 items-center">
                          {item.image && (
                            <img 
                              src={item.image || "/placeholder.svg"} 
                              alt={item.title} 
                              className="w-16 h-16 object-cover rounded-lg" 
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{item.title}</h4>
                            <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => moveToCart(item)}
                              className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                            >
                              Move to Cart
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSavedItems(prev => prev.filter(i => i.id !== item.id))}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 xl:col-span-4"
          >
            <div className="sticky top-24 space-y-4">
              <Card className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-base">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>

                    {promoCode && discount > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex justify-between items-center text-base"
                      >
                        <span className="text-green-500 flex items-center gap-1.5">
                          <Tag className="w-4 h-4" />
                          Discount ({promoCode})
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-500">-${discount.toFixed(2)}</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={removePromo} 
                            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        FREE
                      </Badge>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-bold">Total</span>
                      <motion.span 
                        className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                        key={total}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        ${total.toFixed(2)}
                      </motion.span>
                    </div>
                  </div>

                  {!promoCode && (
                    <div className="pt-4 border-t space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        Have a promo code?
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Enter code"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                          className="flex-1 bg-muted/30 border-border/50 focus:border-primary"
                        />
                        <Button 
                          onClick={handleApplyPromo}
                          disabled={!promoInput.trim() || isApplyingPromo}
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          {isApplyingPromo ? "..." : "Apply"}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <Link href="/checkout" className="block">
                      <Button className="w-full h-12 text-base glow-primary group" size="lg">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>

                    <Link href="/store" className="block">
                      <Button variant="outline" className="w-full h-11 text-base border-border/50 hover:bg-muted/50">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-muted-foreground">Instant digital delivery</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="text-muted-foreground">Secure checkout guaranteed</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-purple-500" />
                      </div>
                      <span className="text-muted-foreground">30-day money-back guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
