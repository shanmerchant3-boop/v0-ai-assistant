import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { buyer, items, subtotal, discount, total } = await request.json()

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate mock order ID
    const orderId = `Z-${Date.now().toString().slice(-8)}`

    return NextResponse.json({
      success: true,
      orderId,
      buyer,
      items,
      subtotal,
      discount,
      total,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Checkout failed" }, { status: 500 })
  }
}
