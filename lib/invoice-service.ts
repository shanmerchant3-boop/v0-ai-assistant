import { createClient } from "@/lib/supabase/server"

export async function generateInvoice(orderId: string, userId: string) {
  const supabase = await createClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()

  if (orderError) throw orderError

  const { data: invoiceNumber } = await supabase.rpc('generate_invoice_number')

  const taxRate = 0
  const taxAmount = order.total_amount * taxRate

  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      order_id: orderId,
      user_id: userId,
      invoice_number: invoiceNumber as string,
      amount: order.total_amount,
      tax_amount: taxAmount,
      total_amount: order.total_amount + taxAmount,
      status: 'paid'
    })
    .select()
    .single()

  if (invoiceError) throw invoiceError
  return invoice
}

export async function getUserInvoices(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      orders:order_id (items, created_at)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
