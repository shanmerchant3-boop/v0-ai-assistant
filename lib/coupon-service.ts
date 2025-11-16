import { createClient } from "@/lib/supabase/client"

export interface PromoCoupon {
  id: string
  code: string
  discount_type: string
  discount_value: number
  max_uses: number
  current_uses: number
  valid_from: string
  valid_until: string
  active: boolean
}

export async function validateCoupon(code: string): Promise<{ valid: boolean; discount: number; error?: string }> {
  const supabase = createClient()

  const { data: coupon } = await supabase.from("promo_codes").select("*").eq("code", code.toUpperCase()).single()

  if (!coupon) {
    return { valid: false, discount: 0, error: "Coupon not found" }
  }

  if (!coupon.active) {
    return { valid: false, discount: 0, error: "Coupon expired" }
  }

  if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
    return { valid: false, discount: 0, error: "Coupon limit reached" }
  }

  const now = new Date()
  if (coupon.valid_from && new Date(coupon.valid_from) > now) {
    return { valid: false, discount: 0, error: "Coupon not yet valid" }
  }

  if (coupon.valid_until && new Date(coupon.valid_until) < now) {
    return { valid: false, discount: 0, error: "Coupon expired" }
  }

  return {
    valid: true,
    discount: coupon.discount_value,
  }
}

export async function applyCoupon(code: string, cartTotal: number): Promise<number> {
  const { valid, discount } = await validateCoupon(code)
  if (!valid) return cartTotal

  const supabase = createClient()

  // Increment usage count
  await supabase.rpc("increment_coupon_uses", { code: code.toUpperCase() })

  return cartTotal * (1 - discount / 100)
}

export async function createPromoCampaign(
  code: string,
  discountType: "percentage" | "fixed",
  discountValue: number,
  maxUses: number,
  validFrom: Date,
  validUntil: Date,
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("promo_codes")
    .insert({
      code: code.toUpperCase(),
      discount_type: discountType,
      discount_value: discountValue,
      max_uses: maxUses,
      valid_from: validFrom.toISOString(),
      valid_until: validUntil.toISOString(),
      active: true,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
