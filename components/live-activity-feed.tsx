'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

interface Order {
  id: string
  total_amount: number
  created_at: string
  items: any
}

interface Product {
  name: string
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<Array<{ order: Order; product: Product | null }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const fetchRecentOrders = async () => {
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('id, total_amount, created_at, items')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) throw error

        // Fetch product names for each order
        const ordersWithProducts = await Promise.all(
          (orders || []).map(async (order) => {
            let productName = 'Order'
            
            if (order.items && typeof order.items === 'object') {
              const firstItem = Array.isArray(order.items) ? order.items[0] : order.items
              if (firstItem?.product_id) {
                const { data: product } = await supabase
                  .from('products')
                  .select('name')
                  .eq('id', firstItem.product_id)
                  .single()
                
                if (product) productName = product.name
              }
            }
            
            return { order, product: { name: productName } }
          })
        )

        setActivities(ordersWithProducts)
      } catch (err) {
        console.error('[v0] Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentOrders()

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new as Order
          setActivities(prev => {
            const updated = [{ order: newOrder, product: { name: 'New Order' } }, ...prev]
            return updated.slice(0, 20) // Keep only 20 recent orders
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <div className="fixed bottom-6 left-6 w-80 glass-card p-4 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-primary/20 rounded animate-pulse mb-2" />
            <div className="h-3 bg-primary/10 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="fixed bottom-6 left-6 w-80 max-h-96 overflow-y-auto glass-card border border-primary/20 rounded-lg shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sticky top-0 bg-background/50 backdrop-blur border-b border-primary/10 p-4 z-10">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Live Sales</h3>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>

      <div className="divide-y divide-primary/10">
        <AnimatePresence mode="popLayout">
          {activities.length > 0 ? (
            activities.slice(0, 10).map((activity, index) => (
              <motion.div
                key={activity.order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-3 hover:bg-primary/5 transition-colors text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {activity.product?.name || 'Product Purchase'}
                    </p>
                    <p className="text-muted-foreground text-[11px] mt-1">
                      Just now
                    </p>
                  </div>
                  <p className="font-bold text-primary whitespace-nowrap">
                    ${Number(activity.order.total_amount).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Waiting for first sale...
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
