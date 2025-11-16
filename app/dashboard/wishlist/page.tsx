'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProductCard from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadWishlist()
  }, [])

  async function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    
    if (wishlist.length === 0) {
      setLoading(false)
      return
    }

    const { data: products } = await supabase
      .from('products')
      .select('*')
      .in('id', wishlist)

    setWishlistProducts(products || [])
    setLoading(false)
  }

  function clearWishlist() {
    localStorage.setItem('wishlist', '[]')
    setWishlistProducts([])
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading wishlist...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500" />
              My Wishlist
            </h1>
            <p className="text-muted-foreground mt-2">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          {wishlistProducts.length > 0 && (
            <Button variant="destructive" onClick={clearWishlist}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start adding products you love to your wishlist
            </p>
            <Button asChild>
              <Link href="/store">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
