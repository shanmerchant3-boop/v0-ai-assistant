import { createAdminClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orderId, userId, email } = await request.json()
    
    const supabase = createAdminClient()

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError) throw orderError

    // Generate invoice number
    const { data: invoiceNumber } = await supabase.rpc('generate_invoice_number')

    const invoiceData: any = {
      order_id: orderId,
      invoice_number: invoiceNumber as string,
      amount: order.total_amount,
      tax_amount: 0,
      total_amount: order.total_amount,
      status: 'paid',
      user_id: userId || null
    }

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert(invoiceData)
      .select()
      .single()

    if (invoiceError) {
      console.error('[v0] Invoice generation error:', invoiceError.message)
      throw invoiceError
    }

    if (email) {
      await fetch(`${request.nextUrl.origin}/api/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'invoice',
          email,
          invoiceNumber: invoiceNumber as string,
          amount: order.total_amount.toFixed(2)
        })
      })
    }

    return NextResponse.json({ invoice })
  } catch (error: any) {
    console.error('[v0] Invoice generation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate invoice' }, { status: 500 })
  }
}
