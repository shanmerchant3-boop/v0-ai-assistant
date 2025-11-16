"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useRouter, useParams } from 'next/navigation'
import { Check, Shield, ArrowLeft, Download, ShieldCheck, HelpCircle, Laptop } from 'lucide-react'
import { seedProducts } from "@/lib/data/products"
import Link from "next/link"
import { useState, useEffect } from "react"
import { addToRecentlyViewed } from "@/lib/tracking-service"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProductCard from "@/components/product-card"

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const product = seedProducts.find(p => p.id === id)
  const { addItem } = useCart()
  const router = useRouter()
  
  const [selectedDuration, setSelectedDuration] = useState(0)
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product.id)
      
      // Get recommended products (same category, excluding current)
      const recommendations = seedProducts
        .filter(p => p.id !== product.id && p.category === product.category)
        .slice(0, 3)
      setRecommendedProducts(recommendations)
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col relative">
        <Navigation />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 glass-card p-12 rounded-lg"
          >
            <p className="text-2xl font-bold">Product not found</p>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
            <Link href="/store">
              <Button className="glow-primary">Back to Store</Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  const pricingOptions = product.variants || [
    { duration: "7 Days", description: `7 Days access to ${product.title}`, price: product.price },
    { duration: "30 Days", description: `30 Days access to ${product.title}`, price: product.price * 2.67 },
    { duration: "Lifetime", description: `Lifetime access to ${product.title}`, price: product.price * 6.67 },
  ]

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: `${product.title} - ${pricingOptions[selectedDuration].duration}`,
      price: pricingOptions[selectedDuration].price,
      image: product.images[0],
    })
    router.push("/cart")
  }

  const faqs = [
    {
      question: "How do I download the product?",
      answer: "After purchase, you'll receive an email with your license key and download link. You can also access downloads from your dashboard."
    },
    {
      question: "Is this product undetected?",
      answer: "Yes, our products are regularly updated to maintain undetected status. Check the product badge for current status."
    },
    {
      question: "What happens if I get banned?",
      answer: "While our products are undetected, we cannot guarantee 100% safety. Use at your own risk. No refunds for bans."
    },
    {
      question: "Can I use this on multiple PCs?",
      answer: "Each license is tied to your hardware ID (HWID). You can reset HWID from your dashboard if you change hardware."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer refunds within 24 hours if the product doesn't work as described. Contact support for assistance."
    }
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10">
        <Link href="/store">
          <motion.button 
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </motion.button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative glass-card rounded-lg overflow-hidden p-8 bg-gradient-to-br from-card/50 to-background/50"
          >
            {product.badge && (
              <div className="absolute top-6 left-6 z-10">
                <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-accent rounded-full text-sm font-medium backdrop-blur-sm">
                  {product.badge}
                </span>
              </div>
            )}
            
            <img 
              src={product.images[0] || "/placeholder.svg?height=600&width=600"} 
              alt={product.title} 
              className="w-full h-auto rounded-lg"
            />
            
            <p className="text-sm text-muted-foreground mt-6">
              Last updated: {product.specs?.Updated || new Date().toLocaleDateString()}
            </p>

            {product.features && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-2 text-foreground">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Features</h3>
                </div>
                <div className="space-y-2">
                  {product.features.map((feature: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="space-y-6"
          >
            <div>
              <div className="text-sm text-primary font-medium mb-2">{product.category}</div>
              <h1 className="text-4xl font-bold mb-3">{product.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{product.longDescription}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Select Duration</h3>
              
              {pricingOptions.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDuration(index)}
                  className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                    selectedDuration === index
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 bg-card/30 hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg mb-1">{option.duration}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ${option.price.toFixed(2)}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <Button 
              size="lg" 
              onClick={handleAddToCart} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg shadow-primary/30 text-lg py-6"
            >
              Purchase Now - ${pricingOptions[selectedDuration].price.toFixed(2)}
            </Button>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Instant delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure checkout</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {recommendedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendedProducts.map((rec) => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  )
}
