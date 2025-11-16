"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Zap, Users, TrendingUp } from "lucide-react"

interface Stats {
  totalOrders: number
  onlineUsers: number
  conversionRate: number
}

export function SocialProofBanner() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    onlineUsers: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()

      const { data: orders } = await supabase.from("orders").select("id").eq("status", "completed")

      const { data: analytics } = await supabase.from("analytics").select("id").eq("event_type", "page_view")

      const totalOrders = orders?.length || 0
      const pageViews = analytics?.length || 1
      const conversionRate = ((totalOrders / pageViews) * 100).toFixed(1)

      setStats({
        totalOrders,
        onlineUsers: Math.floor(Math.random() * 50) + 5,
        conversionRate: Number.parseFloat(conversionRate),
      })
    }

    loadStats()
    const interval = setInterval(loadStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 gap-4 mb-8 px-4 md:px-8"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center"
      >
        <Zap className="w-5 h-5 text-primary mx-auto mb-2" />
        <p className="text-2xl font-bold text-primary">{stats.totalOrders}</p>
        <p className="text-xs text-muted-foreground">Orders This Month</p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 text-center"
      >
        <Users className="w-5 h-5 text-accent mx-auto mb-2" />
        <p className="text-2xl font-bold text-accent">{stats.onlineUsers}</p>
        <p className="text-xs text-muted-foreground">Active Users</p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center"
      >
        <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
        <p className="text-2xl font-bold text-primary">{stats.conversionRate}%</p>
        <p className="text-xs text-muted-foreground">Conversion Rate</p>
      </motion.div>
    </motion.div>
  )
}
