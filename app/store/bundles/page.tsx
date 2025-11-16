'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, TrendingDown, Clock } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function BundlesPage() {
  const [bundles, setBundles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadBundles()
  }, [])

  async function loadBundles() {
    const { data } = await supabase
      .from('bundles')
      .select('*')
      .eq('active', true)

    setBundles(data || [])
    setLoading(false)
  }

  function handleAddToCart(bundle: any) {
    addItem({
      id: bundle.id,
      title: bundle.name,
      price: bundle.bundle_price,
      image: '/placeholder.svg?height=200&width=300',
    })
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading bundles...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bundle Deals
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Save big with our exclusive product bundles
          </p>
        </motion.div>

        {bundles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No active bundles at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full glass-card border-primary/20">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Save {bundle.discount_percent}%
                      </Badge>
                      {bundle.valid_until && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Limited Time
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{bundle.name}</CardTitle>
                    <CardDescription>{bundle.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-primary">
                            ${bundle.bundle_price.toFixed(2)}
                          </span>
                          <span className="text-lg line-through text-muted-foreground">
                            ${bundle.original_price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-green-500 mt-1">
                          You save ${(bundle.original_price - bundle.bundle_price).toFixed(2)}
                        </p>
                      </div>

                      {bundle.max_purchases && (
                        <p className="text-xs text-muted-foreground">
                          {bundle.max_purchases - bundle.current_purchases} remaining
                        </p>
                      )}

                      <Button
                        className="w-full bg-gradient-to-r from-primary to-accent"
                        onClick={() => handleAddToCart(bundle)}
                      >
                        Add Bundle to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
