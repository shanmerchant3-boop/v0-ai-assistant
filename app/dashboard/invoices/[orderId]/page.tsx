import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function InvoicePage({ params }: { params: { orderId: string } }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('id', params.orderId)
    .eq('user_id', user.id)
    .single()

  if (!order) redirect('/dashboard/orders')

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('order_id', params.orderId)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const subtotal = order.total_amount - (order.discount_amount || 0)
  const tax = invoice?.tax_amount || 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card>
        <CardContent className="p-8 md:p-12">
          <div className="mb-12">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-primary">INVOICE</h1>
                <p className="text-muted-foreground">
                  #{invoice?.invoice_number || order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">Zaliant Services</p>
                <p className="text-sm text-muted-foreground">Premium Gaming Tools</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="font-semibold mb-2 text-sm uppercase text-muted-foreground">Bill To</h3>
                <p className="font-semibold">{profile?.full_name || 'Customer'}</p>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold mb-2 text-sm uppercase text-muted-foreground">Invoice Details</h3>
                <p className="text-sm">
                  <span className="text-muted-foreground">Date: </span>
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Status: </span>
                  <span className="font-semibold text-green-500">Paid</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold">Product</th>
                  <th className="text-center py-3 font-semibold">Qty</th>
                  <th className="text-right py-3 font-semibold">Price</th>
                  <th className="text-right py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items?.map((item: any) => (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="py-4">
                      <p className="font-semibold">{item.products?.name}</p>
                      <p className="text-sm text-muted-foreground">{item.products?.category}</p>
                    </td>
                    <td className="text-center py-4">{item.quantity}</td>
                    <td className="text-right py-4">${item.price_at_purchase}</td>
                    <td className="text-right py-4 font-semibold">
                      ${(item.quantity * item.price_at_purchase).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount {order.promo_code && `(${order.promo_code})`}</span>
                  <span>-${order.discount_amount.toFixed(2)}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>Thank you for your purchase!</p>
            <p>For support, contact us at support@zaliantservices.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
