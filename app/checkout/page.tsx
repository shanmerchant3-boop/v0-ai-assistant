"use client"

import { motion, AnimatePresence } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/context/cart-context"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { CheckCircle, ShieldCheck, Download, CreditCard, Mail, ChevronRight, Package, DollarSign, User } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

const CHECKOUT_STEPS = ["Review Order", "Payment", "Complete"]

export default function CheckoutPage() {
  const { items, clearCart, total, subtotal, discount, promoCode } = useCart()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [licenseKeys, setLicenseKeys] = useState<string[]>([])
  const [orderId, setOrderId] = useState<string>('')
  const [currentStep, setCurrentStep] = useState(0)
  
  const [checkoutType, setCheckoutType] = useState<'user' | 'guest'>('guest')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')

  console.log("[v0] Checkout - items:", items)
  console.log("[v0] Checkout - subtotal:", subtotal)
  console.log("[v0] Checkout - discount:", discount)
  console.log("[v0] Checkout - total:", total)

  useEffect(() => {
    if (!authLoading && user) {
      setCheckoutType('user')
    }
  }, [user, authLoading])

  const handleCheckout = async () => {
    if (checkoutType === 'guest') {
      if (!guestEmail || !guestName) {
        alert('Please enter your name and email')
        return
      }
    }

    setIsProcessing(true)

    try {
      const supabase = createClient()
      const buyerEmail = checkoutType === 'guest' ? guestEmail : user?.email
      const buyerName = checkoutType === 'guest' ? guestName : user?.email?.split('@')[0]

      const orderData: any = {
        total_amount: total || 0,
        status: 'completed',
        payment_method: 'demo',
        promo_code: promoCode || null,
        discount_amount: discount || 0,
        items: items.map(item => ({
          id: item.id,
          name: item.title,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant,
          email: buyerEmail // Store email for guest tracking
        }))
      }

      if (user) {
        orderData.user_id = user.id
      }

      console.log('[v0] Creating order with data:', orderData)

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (orderError) {
        console.error('[v0] Order error:', orderError)
        throw orderError
      }

      console.log('[v0] Order created:', order)

      // Send confirmation email
      await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order_confirmation',
          email: buyerEmail,
          orderId: order.id,
          amount: (total || 0).toFixed(2),
          items
        })
      })

      // Generate license keys
      const keys: string[] = []
      for (const item of items) {
        const response = await fetch('/api/licenses/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            productId: item.id,
            userId: user?.id || null,
            email: buyerEmail,
            duration: item.variant?.name,
            productName: item.title
          })
        })
        
        const { licenseKey } = await response.json()
        keys.push(licenseKey)
      }

      // Generate invoice
      await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: order.id, 
          userId: user?.id,
          email: buyerEmail 
        })
      })

      setOrderId(order.id)
      setLicenseKeys(keys)
      setOrderComplete(true)
      clearCart()
    } catch (error) {
      console.error('[v0] Checkout error:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (orderComplete) {
    const displayEmail = checkoutType === 'guest' ? guestEmail : user?.email

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 md:px-8 py-20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-6"
          >
            <CheckCircle className="w-24 h-24 text-accent mx-auto" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-4">Order Complete!</h1>
          
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
            <Mail className="w-5 h-5" />
            <p className="text-lg">
              License keys sent to <strong className="text-foreground">{displayEmail}</strong>
            </p>
          </div>

          <Card className="text-left mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <CardTitle>Your License Keys</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {licenseKeys.map((key, i) => (
                <div key={i} className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-primary">{key}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText(key)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard/orders">
                <Button size="lg">View Order Details</Button>
              </Link>
            ) : (
              <Link href="/auth/signup">
                <Button size="lg">Create Account</Button>
              </Link>
            )}
            <Link href="/store">
              <Button variant="outline" size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 md:px-8 py-20 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => router.push("/store")}>Browse Products</Button>
        </main>
        <Footer />
      </div>
    )
  }

  const progress = ((currentStep + 1) / CHECKOUT_STEPS.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-6">Checkout</h1>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between">
              {CHECKOUT_STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center gap-2 ${
                    index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      index < currentStep
                        ? 'bg-primary border-primary text-primary-foreground'
                        : index === currentStep
                        ? 'border-primary'
                        : 'border-border'
                    }`}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className="hidden sm:inline font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {!user && (
                <Card>
                  <CardHeader>
                    <CardTitle>Checkout As</CardTitle>
                    <CardDescription>Choose how you'd like to checkout</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={checkoutType} onValueChange={(v) => setCheckoutType(v as 'user' | 'guest')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="guest">
                          <Mail className="w-4 h-4 mr-2" />
                          Guest
                        </TabsTrigger>
                        <TabsTrigger value="user">
                          <User className="w-4 h-4 mr-2" />
                          Login
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="guest" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="guest-name">Full Name</Label>
                          <Input
                            id="guest-name"
                            type="text"
                            placeholder="John Doe"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guest-email">Email Address</Label>
                          <Input
                            id="guest-email"
                            type="email"
                            placeholder="you@example.com"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">License keys will be sent to this email</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="user" className="mt-4">
                        <div className="text-center py-4">
                          <p className="text-muted-foreground mb-4">Sign in to save your purchases to your account</p>
                          <Button onClick={() => router.push('/auth/login?redirect=/checkout')}>
                            Sign In
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Order Review</CardTitle>
                  <CardDescription>Review your items before checkout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-12 h-12 rounded object-cover" />
                        )}
                        <div>
                          <span className="font-medium block">{item.title}</span>
                          {item.variant && (
                            <span className="text-sm text-muted-foreground">
                              {item.variant.name}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground block">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-semibold">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${(subtotal || 0).toFixed(2)}</span>
                    </div>
                    {(discount || 0) > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({promoCode})</span>
                        <span>-${(discount || 0).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">${(total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => router.push("/cart")}>
                  Back to Cart
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={() => setCurrentStep(1)}
                  disabled={checkoutType === 'guest' && (!guestEmail || !guestName)}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {checkoutType === 'guest' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Buyer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{guestEmail}</span>
                    </div>
                    <p className="text-xs text-green-600 bg-green-500/10 p-2 rounded mt-2">
                      <Mail className="w-3 h-3 inline mr-1" />
                      License keys will be sent to this email
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle>Payment Details</CardTitle>
                      <CardDescription>Complete your purchase securely</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/20 rounded-lg border space-y-2 text-sm">
                    <p className="font-semibold">Demo Mode Active</p>
                    <p className="text-muted-foreground">Use test card: 4242 4242 4242 4242</p>
                    <p className="text-muted-foreground">Expiry: 12/25 • CVC: 123</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Download className="w-4 h-4 text-green-500" />
                      <span>Instant delivery to your email</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      <span>Secure encrypted payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">${(total || 0).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(0)}>
                  Back
                </Button>
                <Button 
                  className="flex-1 glow-accent" 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay $${(total || 0).toFixed(2)}`}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
