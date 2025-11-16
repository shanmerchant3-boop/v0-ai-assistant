"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart } from "lucide-react"

interface Purchase {
  id: string
  product_name: string
  timestamp: string
}

export function LivePurchasesFeed() {
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to new orders
    const channel = supabase
      .channel("orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload: any) => {
        const newPurchase: Purchase = {
          id: payload.new.id,
          product_name: "Someone",
          timestamp: new Date().toLocaleTimeString(),
        }

        setPurchases((prev) => [newPurchase, ...prev].slice(0, 5))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground">Live Purchases</h3>
      <AnimatePresence mode="popLayout">
        {purchases.map((purchase) => (
          <motion.div
            key={purchase.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
          >
            <ShoppingCart className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{purchase.product_name} purchased</p>
              <p className="text-xs text-muted-foreground">{purchase.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
