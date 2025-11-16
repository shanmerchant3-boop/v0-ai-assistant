import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, FileText, Package } from 'lucide-react'
import Link from 'next/link'

export default async function OrdersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .or(`user_id.eq.${user.id},items->>email.eq.${user.email}`)
    .order('created_at', { ascending: false })

  const { data: licenses } = await supabase
    .from('license_keys')
    .select('*, products(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false})

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground">View and manage your purchases and licenses</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <CardDescription>
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'pending' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {order.status}
                    </Badge>
                    <span className="text-2xl font-bold text-primary">
                      ${order.total_amount}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.products?.name}</h3>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold">${item.price_at_purchase}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/dashboard/invoices/${order.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Invoice
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/dashboard/licenses?order=${order.id}`}>
                      <Download className="h-4 w-4 mr-2" />
                      View Licenses
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">Start shopping to see your order history</p>
            <Button asChild>
              <Link href="/store">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
