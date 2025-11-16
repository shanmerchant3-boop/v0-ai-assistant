import { describe, it, expect } from '@jest/globals'

// Mock cart functions
const addItem = (items: any[], product: any) => {
  const existing = items.find((item) => item.id === product.id)
  if (existing) {
    return items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
  }
  return [...items, { ...product, quantity: 1 }]
}

const updateQuantity = (items: any[], id: string, quantity: number) => {
  if (quantity <= 0) {
    return items.filter((item) => item.id !== id)
  }
  return items.map((item) => (item.id === id ? { ...item, quantity } : item))
}

const applyPromo = (subtotal: number, code: string) => {
  const PROMO_CODES: Record<string, any> = {
    ZALIANT20: { type: 'percent', value: 0.2 },
    WELCOME10: { type: 'fixed', value: 10 },
  }

  const promo = PROMO_CODES[code]
  if (!promo) return 0

  if (promo.type === 'percent') {
    return subtotal * promo.value
  }
  return Math.min(promo.value, subtotal)
}

describe('Cart Logic', () => {
  describe('addItem', () => {
    it('should add new item to empty cart', () => {
      const items: any[] = []
      const product = { id: '1', title: 'Test', price: 10 }
      const result = addItem(items, product)
      
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({ ...product, quantity: 1 })
    })

    it('should increment quantity for existing item', () => {
      const items = [{ id: '1', title: 'Test', price: 10, quantity: 1 }]
      const product = { id: '1', title: 'Test', price: 10 }
      const result = addItem(items, product)
      
      expect(result).toHaveLength(1)
      expect(result[0].quantity).toBe(2)
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const items = [{ id: '1', title: 'Test', price: 10, quantity: 1 }]
      const result = updateQuantity(items, '1', 3)
      
      expect(result[0].quantity).toBe(3)
    })

    it('should remove item when quantity is 0', () => {
      const items = [{ id: '1', title: 'Test', price: 10, quantity: 1 }]
      const result = updateQuantity(items, '1', 0)
      
      expect(result).toHaveLength(0)
    })
  })

  describe('applyPromo', () => {
    it('should apply percent discount correctly', () => {
      const discount = applyPromo(100, 'ZALIANT20')
      expect(discount).toBe(20)
    })

    it('should apply fixed discount correctly', () => {
      const discount = applyPromo(100, 'WELCOME10')
      expect(discount).toBe(10)
    })

    it('should cap fixed discount at subtotal', () => {
      const discount = applyPromo(5, 'WELCOME10')
      expect(discount).toBe(5)
    })

    it('should return 0 for invalid promo', () => {
      const discount = applyPromo(100, 'INVALID')
      expect(discount).toBe(0)
    })
  })
})
