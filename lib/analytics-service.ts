import { createClient } from "@/lib/supabase/client"

export interface AnalyticsEvent {
  event_type: "page_view" | "product_view" | "add_to_cart" | "purchase" | "review"
  product_id?: string
  user_id?: string
  metadata?: Record<string, any>
}

export async function trackEvent(event: AnalyticsEvent) {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from("analytics").insert({
      event_type: event.event_type,
      user_id: user?.id,
      product_id: event.product_id,
      data: event.metadata,
    })
  } catch (error) {
    console.error("Error tracking event:", error)
  }
}

export async function getConversionMetrics() {
  const supabase = createClient()

  const { data: pageViews } = await supabase.from("analytics").select("id").eq("event_type", "page_view")

  const { data: purchases } = await supabase.from("analytics").select("id").eq("event_type", "purchase")

  const pageViewCount = pageViews?.length || 1
  const purchaseCount = purchases?.length || 0

  return {
    conversionRate: ((purchaseCount / pageViewCount) * 100).toFixed(2),
    pageViews: pageViewCount,
    purchases: purchaseCount,
  }
}

export async function getProductMetrics(productId: string) {
  const supabase = createClient()

  const { data: views } = await supabase
    .from("analytics")
    .select("id")
    .eq("product_id", productId)
    .eq("event_type", "product_view")

  const { data: cartAdds } = await supabase
    .from("analytics")
    .select("id")
    .eq("product_id", productId)
    .eq("event_type", "add_to_cart")

  const { data: sales } = await supabase
    .from("analytics")
    .select("id")
    .eq("product_id", productId)
    .eq("event_type", "purchase")

  return {
    views: views?.length || 0,
    cartAdds: cartAdds?.length || 0,
    sales: sales?.length || 0,
    conversionRate: views?.length ? (((sales?.length || 0) / views.length) * 100).toFixed(2) : "0",
  }
}
