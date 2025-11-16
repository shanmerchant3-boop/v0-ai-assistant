import { createClient } from "@/lib/supabase/client"

export interface AffiliateData {
  id: string
  commission_rate: number
  total_commission: number
  total_referrals: number
  status: "pending" | "active" | "suspended"
}

export async function getAffiliateData(userId: string): Promise<AffiliateData | null> {
  const supabase = createClient()
  const { data } = await supabase.from("affiliates").select("*").eq("id", userId).single()

  return data
}

export async function createAffiliateCoupon(
  userId: string,
  discountPercent: number,
  commissionPercent: number,
  maxUses?: number,
) {
  const supabase = createClient()

  const code = generateCouponCode()

  const { data, error } = await supabase
    .from("coupons")
    .insert({
      affiliate_id: userId,
      code,
      discount_percent: discountPercent,
      commission_percent: commissionPercent,
      max_uses: maxUses,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getCouponStats(couponCode: string) {
  const supabase = createClient()

  const { data: coupon } = await supabase.from("coupons").select("*").eq("code", couponCode).single()

  if (!coupon) return null

  const { data: orders } = await supabase.from("orders").select("*").eq("promo_code", couponCode)

  return {
    coupon,
    uses: orders?.length || 0,
    revenue: orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0,
  }
}

export async function trackAffiliateClick(couponCode: string, userId: string) {
  const supabase = createClient()

  await supabase.from("analytics").insert({
    event_type: "affiliate_click",
    user_id: userId,
    data: { coupon_code: couponCode },
  })
}

function generateCouponCode(): string {
  return "AFF" + Math.random().toString(36).substring(2, 10).toUpperCase()
}
