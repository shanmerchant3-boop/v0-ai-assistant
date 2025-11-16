import { createAdminClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orderId, productId, userId, duration, productName, email } = await request.json()
    
    const supabase = createAdminClient()
    
    // Generate unique license key
    const { data: keyData } = await supabase.rpc('generate_license_key')
    const licenseKey = keyData as string

    // Calculate expiration
    let expiresAt = null
    if (duration && duration !== 'Lifetime') {
      const daysMatch = duration.match(/\d+/)
      if (daysMatch) {
        const days = parseInt(daysMatch[0])
        expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + days)
      }
    }

    const { data, error } = await supabase
      .from('license_keys')
      .insert({
        key: licenseKey,
        order_id: orderId,
        user_id: userId || null,
        expires_at: expiresAt,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] License generation error:', error.message)
      throw error
    }

    if (email) {
      await fetch(`${request.nextUrl.origin}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'license_key',
          email,
          licenseKey,
          productName: productName || 'Your Product',
          duration: duration || 'Lifetime',
          expiresAt: expiresAt ? new Date(expiresAt).toLocaleDateString() : 'Never'
        })
      })
    }

    return NextResponse.json({ licenseKey, data })
  } catch (error: any) {
    console.error('[v0] License generation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate license' }, { status: 500 })
  }
}
