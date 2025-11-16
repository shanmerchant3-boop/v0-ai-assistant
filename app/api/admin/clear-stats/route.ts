import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  try {
    const supabase = createAdminClient()
    
    // Count records before deleting
    const ordersCountRes = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
    
    const licensesCountRes = await supabase
      .from("license_keys")
      .select("id", { count: "exact", head: true })
    
    const ordersCount = ordersCountRes.count || 0
    const licensesCount = licensesCountRes.count || 0
    
    console.log("[v0] Deleting", ordersCount, "orders and", licensesCount, "licenses")
    
    if (ordersCount === 0 && licensesCount === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No data to clear",
        ordersDeleted: 0,
        licensesDeleted: 0
      })
    }
    
    // Delete all orders
    const { error: ordersError } = await supabase
      .from("orders")
      .delete()
      .gte("created_at", "2000-01-01")
    
    if (ordersError) {
      console.error("[v0] Error deleting orders:", ordersError)
      throw ordersError
    }
    
    // Delete all license keys
    const { error: licensesError } = await supabase
      .from("license_keys")
      .delete()
      .gte("created_at", "2000-01-01")
    
    if (licensesError) {
      console.error("[v0] Error deleting licenses:", licensesError)
      throw licensesError
    }
    
    console.log("[v0] Successfully deleted all stats")
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully cleared ${ordersCount} orders and ${licensesCount} license keys!`,
      ordersDeleted: ordersCount,
      licensesDeleted: licensesCount
    })
  } catch (error) {
    console.error("[v0] Error clearing stats:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
