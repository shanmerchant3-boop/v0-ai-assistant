// Recently Viewed Products Tracking
export function addToRecentlyViewed(productId: string) {
  const recent = JSON.parse(localStorage.getItem('recently_viewed') || '[]')
  const filtered = recent.filter((id: string) => id !== productId)
  const updated = [productId, ...filtered].slice(0, 10) // Keep last 10
  localStorage.setItem('recently_viewed', JSON.stringify(updated))
}

export function getRecentlyViewed(): string[] {
  return JSON.parse(localStorage.getItem('recently_viewed') || '[]')
}

export function clearRecentlyViewed() {
  localStorage.setItem('recently_viewed', '[]')
}

// User Reputation System
export function getUserReputation(userId: string): number {
  // Calculate based on: purchases, reviews, referrals
  return 0 // Placeholder
}

export function addReputationPoints(userId: string, points: number) {
  // Add points to user reputation
}

// Abandoned Cart Tracking
export function trackAbandonedCart(cartItems: any[]) {
  if (cartItems.length === 0) return

  const lastUpdate = Date.now()
  localStorage.setItem('cart_last_update', lastUpdate.toString())
  
  // Check after 1 hour
  setTimeout(() => {
    const current = localStorage.getItem('cart_last_update')
    if (current === lastUpdate.toString() && cartItems.length > 0) {
      // Trigger abandoned cart email
      fetch('/api/abandoned-cart', {
        method: 'POST',
        body: JSON.stringify({ cartItems }),
      })
    }
  }, 3600000) // 1 hour
}
