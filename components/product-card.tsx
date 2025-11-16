"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { GlassCard } from "./glass-card"
import { ScrollReveal } from "./scroll-reveal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Flame, Sparkles } from 'lucide-react'
import PriceAnimator from "./price-animator"
import { WishlistButton } from "./wishlist-button"

interface Product {
  id: string
  title?: string
  name?: string
  price: number
  shortDescription?: string
  description?: string
  features?: string[]
  image_url?: string
  images?: string[]
  badge?: string
  status?: "available" | "sold_out" | "coming_soon"
  tags?: string[]
}

export default function ProductCard({ product }: { product: Product }) {
  const displayName = product.title || product.name || "Product"
  const displayDescription = product.shortDescription || product.description || ""
  const displayImage = product.images?.[0] || product.image_url || "/placeholder.svg?height=256&width=400"

  const getBadgeConfig = (badge?: string) => {
    switch (badge?.toLowerCase()) {
      case "undetected":
        return { icon: Shield, className: "bg-green-500/10 text-green-500 border-green-500/20" }
      case "hot":
        return { icon: Flame, className: "bg-red-500/10 text-red-500 border-red-500/20" }
      case "new":
        return { icon: Sparkles, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" }
      case "updated":
        return { icon: Sparkles, className: "bg-purple-500/10 text-purple-500 border-purple-500/20" }
      default:
        return null
    }
  }

  const badgeConfig = getBadgeConfig(product.badge)

  return (
    <ScrollReveal direction="up">
      <motion.div whileHover={{ y: -8 }} className="group">
        <GlassCard className="overflow-hidden h-full">
          {/* Image Container */}
          <div className="relative overflow-hidden h-64 bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">
              <div className="flex gap-2">
                {badgeConfig && (
                  <Badge className={badgeConfig.className}>
                    <badgeConfig.icon className="h-3 w-3 mr-1" />
                    {product.badge}
                  </Badge>
                )}
                {product.status === "sold_out" && (
                  <Badge variant="destructive">Sold Out</Badge>
                )}
                {product.status === "coming_soon" && (
                  <Badge variant="secondary">Coming Soon</Badge>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <WishlistButton productId={product.id} className="bg-black/50 backdrop-blur-sm hover:bg-black/70" />
              </div>
            </div>

            <motion.img
              src={displayImage}
              alt={displayName}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {product.tags && product.tags.length > 0 && (
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity">
                {product.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-black/70 backdrop-blur-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {displayName}
              </h3>
              <motion.p
                className="text-3xl font-bold text-accent"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
              >
                <PriceAnimator price={product.price} />
              </motion.p>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{displayDescription}</p>

            <ul className="space-y-2 text-sm">
              {product.features?.slice(0, 2).map((feature, i) => (
                <motion.li
                  key={i}
                  className="flex gap-2 text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-accent">•</span>
                  {feature}
                </motion.li>
              ))}
            </ul>

            <Link href={`/store/${product.id}`}>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg shadow-primary/30 glow-primary group/btn gap-2"
                disabled={product.status === "sold_out" || product.status === "coming_soon"}
              >
                {product.status === "sold_out" ? "Out of Stock" :
                 product.status === "coming_soon" ? "Coming Soon" :
                 "View Details"}
                {product.status === "available" && (
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                )}
              </Button>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </ScrollReveal>
  )
}
