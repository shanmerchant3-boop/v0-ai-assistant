"use client"

import Link from "next/link"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { ShoppingCart, Zap, Shield, Star, Users, Rocket, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState, useRef } from "react"
import { seedProducts } from "@/lib/data/products"
import LiveActivityFeed from '@/components/live-activity-feed'
import { TrustSignals } from '@/components/trust-signals'
import { ComparisonTable } from '@/components/comparison-table'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const reviews = [
  {
    name: "Alex Chen",
    role: "Pro Gamer",
    rating: 5,
    text: "Best service in the market. Instant delivery, premium quality, and 24/7 support.",
  },
  {
    name: "Jordan Lee",
    role: "Competitive Player",
    rating: 5,
    text: "Reliable and trustworthy. Been using Zaliant for 6 months. Zero issues.",
  },
  {
    name: "Casey Morgan",
    role: "Gaming Enthusiast",
    rating: 5,
    text: "The support team is incredible. Had an issue and it was resolved in minutes.",
  },
]

const features = [
  { icon: Rocket, title: "Lightning Fast", description: "Instant delivery and activation" },
  { icon: Shield, title: "Secure & Reliable", description: "Enterprise-grade security protocols" },
  { icon: Users, title: "24/7 Support", description: "Dedicated support team available" },
  { icon: Star, title: "Premium Quality", description: "Best-in-class products and services" },
]

const products = seedProducts.map(p => ({
  id: p.id,
  name: p.title,
  price: `$${p.price.toFixed(2)}`,
  image: p.images[0],
  description: p.shortDescription,
  badge: p.badge,
}))

export default function Home() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly")
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const productsRef = useRef<HTMLElement>(null)

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const nextProduct = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection(1)
    setCurrentProductIndex((prev) => (prev + 1) % products.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevProduct = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection(-1)
    setCurrentProductIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50
    if (info.offset.x > swipeThreshold) {
      prevProduct()
    } else if (info.offset.x < -swipeThreshold) {
      nextProduct()
    }
  }

  const visibleProducts = products

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LiveActivityFeed />
      
      <div className="relative z-10">
        <Header />

        <main className="flex flex-col gap-24 pb-20">
          <Hero scrollToProducts={scrollToProducts} />

          {/* Trust Signals Section */}
          <TrustSignals />

          {/* Features Section */}
          <section className="px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-16 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Why Choose Zaliant
              </motion.h2>

              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    className="glass-card p-6 group cursor-pointer"
                    variants={fadeInUp}
                  >
                    <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:text-accent transition-colors group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Featured Products with Carousel */}
          <section className="px-4 md:px-8" ref={productsRef}>
            <div className="max-w-6xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Undetected, Secure & Always Updated Gaming Cheats For Every Battle
              </motion.h2>
              <p className="text-center text-muted-foreground mb-8">Premium quality digital tools</p>

              <motion.div 
                className="relative px-2 sm:px-12"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevProduct}
                  disabled={isTransitioning}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/80 backdrop-blur border border-border/40 hover:bg-background hover:border-primary/60 shadow-lg transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextProduct}
                  disabled={isTransitioning}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-background/80 backdrop-blur border border-border/40 hover:bg-background hover:border-primary/60 shadow-lg transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                <div className="relative overflow-hidden">
                  <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                    <motion.div
                      key={currentProductIndex}
                      custom={slideDirection}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.3 },
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {visibleProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          className="glass-card overflow-hidden group"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="relative h-48 bg-muted overflow-hidden">
                            {product.badge && (
                              <div className="absolute top-3 left-3 z-10">
                                <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold rounded-full shadow-glow">
                                  {product.badge}
                                </span>
                              </div>
                            )}
                            <img
                              src={product.image || "/placeholder.svg?height=192&width=400"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="p-5">
                            <p className="text-xs text-muted-foreground mb-1">Valorant</p>
                            <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                            <p className="text-muted-foreground text-xs mb-4 line-clamp-2">{product.description}</p>
                            <div className="space-y-1 mb-4">
                              {seedProducts.find(p => p.id === product.id)?.features?.map((feature, idx) => (
                                <p key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                                  • {feature}
                                </p>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              Updated {seedProducts.find(p => p.id === product.id)?.specs?.Updated}
                            </p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">Starting at</p>
                                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                  {product.price}
                                </span>
                              </div>
                              <Link href={`/store/${product.id}`}>
                                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                                  Get Access →
                                </Button>
                              </Link>
                            </div>
                            <Link href={`/store/${product.id}`} className="block mt-3 text-center">
                              <span className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                More Information
                              </span>
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Navigation dots below carousel */}
                <div className="flex justify-center gap-2 mt-6">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSlideDirection(index > currentProductIndex ? 1 : -1)
                        setCurrentProductIndex(index)
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentProductIndex
                          ? 'bg-primary w-8'
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                      aria-label={`Go to product ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>

              <div className="text-center mt-8">
                <Link href="/store" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
                  View All Products
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <ComparisonTable />

          <section className="px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-12 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Accepted Payment Methods
              </motion.h2>

              <motion.div
                className="flex flex-wrap items-center justify-center gap-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-8 flex items-center gap-3 hover:scale-105 transition-transform">
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="14" width="36" height="20" rx="3" fill="currentColor" className="text-primary" opacity="0.2"/>
                    <rect x="6" y="14" width="36" height="6" rx="3" fill="currentColor" className="text-primary"/>
                    <rect x="10" y="26" width="10" height="4" rx="1" fill="currentColor" className="text-muted-foreground"/>
                  </svg>
                  <span className="text-lg font-semibold">Credit Card</span>
                </div>
                
                <div className="glass-card p-8 flex items-center gap-3 hover:scale-105 transition-transform">
                  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="12" fill="currentColor" className="text-primary" opacity="0.2"/>
                    <path d="M24 16v8l6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary"/>
                    <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2" className="text-primary"/>
                  </svg>
                  <span className="text-lg font-semibold">Crypto</span>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Customer Reviews */}
          <section className="px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-12 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Customer Reviews
              </motion.h2>

              <motion.div
                className="grid md:grid-cols-3 gap-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {reviews.map((review, i) => (
                  <motion.div
                    key={i}
                    className="glass-card p-6 group"
                    variants={fadeInUp}
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{review.text}"</p>
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.role}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-12 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Frequently Asked Questions
              </motion.h2>

              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      question: "Are your cheats undetected?",
                      answer:
                        "Yes, all our products are regularly updated and tested to ensure they remain undetected. We use advanced bypass technology and monitor ban waves to keep our customers safe.",
                    },
                    {
                      question: "What payment methods do you accept?",
                      answer:
                        "We accept Credit Cards (Visa, Mastercard, American Express) and Cryptocurrency (Bitcoin, Ethereum, USDT). All payments are processed securely through encrypted channels.",
                    },
                    {
                      question: "Do you offer refunds?",
                      answer: "Yes, we offer a 7-day money-back guarantee on all products. If you experience any technical issues or are not satisfied, contact our support team for a full refund.",
                    },
                    {
                      question: "How quickly will I receive my product?",
                      answer: "All products are delivered instantly to your account within seconds of purchase completion. You'll receive an email with your license key and download instructions immediately.",
                    },
                    {
                      question: "Is customer support available?",
                      answer: "Our 24/7 support team is available via Discord and email. We typically respond within minutes and provide dedicated assistance for setup, troubleshooting, and any questions you may have.",
                    },
                    {
                      question: "Can I use the cheat on multiple PCs?",
                      answer: "Each license is tied to one hardware ID. If you need to use it on multiple PCs, you'll need to purchase additional licenses or use our HWID reset feature available once every 30 days.",
                    },
                  ].map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-primary/20">
                      <AccordionTrigger className="text-left hover:text-primary transition-colors py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>
          </section>

          {/* Final CTA */}
          <motion.section
            className="px-4 md:px-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Level Up?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of gamers using Zaliant Services. Premium tools, unbeatable prices, guaranteed
                satisfaction.
              </p>
              <Link href="/store">
                <Button
                  size="lg"
                  variant="hero"
                  className="gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Shop Now Securely
                </Button>
              </Link>
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
