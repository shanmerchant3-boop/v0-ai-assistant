"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Eye, ShoppingBag, Search, Calendar, DollarSign, Key, CreditCard } from 'lucide-react'

export default function UsersPage() {
  const [visitors, setVisitors] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    const supabase = createClient()

    const [visitorsRes, customersRes] = await Promise.all([
      supabase.from("visitors").select("*").order("last_seen", { ascending: false }),
      supabase.from("customer_details").select("*")
    ])

    setVisitors(visitorsRes.data || [])
    setCustomers(customersRes.data || [])
    setLoading(false)
  }

  const filteredVisitors = visitors.filter(v => 
    v.ip_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.browser?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.os?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCustomers = customers.filter(c => 
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span>Loading user data...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Track visitors and manage customer data</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="visitors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="visitors" className="gap-2">
              <Eye className="h-4 w-4" />
              Visitors ({filteredVisitors.length})
            </TabsTrigger>
            <TabsTrigger value="customers" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Customers ({filteredCustomers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <CardTitle>All Visitors</CardTitle>
                <CardDescription>Track anonymous site visitors and their behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredVisitors.map((visitor) => (
                    <Card key={visitor.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">IP Address</p>
                          <p className="font-medium">{visitor.ip_address || "Unknown"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Device</p>
                          <p className="font-medium">{visitor.browser} on {visitor.os}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Seen</p>
                          <p className="font-medium">
                            {new Date(visitor.last_seen).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Sessions</p>
                          <p className="font-medium">{visitor.session_count}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Pages Visited</p>
                          <p className="font-medium">{visitor.pages_visited?.length || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Device Type</p>
                          <Badge>{visitor.device_type || "Unknown"}</Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {filteredVisitors.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">No visitors found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer List</CardTitle>
                    <CardDescription>Registered customers with purchase history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredCustomers.map((customer) => (
                        <Card 
                          key={customer.customer_id} 
                          className="p-4 cursor-pointer hover:bg-primary/5 transition"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold">{customer.full_name || customer.username}</p>
                                <p className="text-sm text-muted-foreground">{customer.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">${customer.total_spent?.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">{customer.total_orders} orders</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {filteredCustomers.length === 0 && (
                        <p className="text-center py-8 text-muted-foreground">No customers found</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                {selectedCustomer ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Details</CardTitle>
                      <CardDescription>{selectedCustomer.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Full Name</p>
                        <p className="font-medium">{selectedCustomer.full_name || "Not provided"}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Username</p>
                        <p className="font-medium">{selectedCustomer.username || "Not set"}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Registered</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <p className="font-medium">
                            {new Date(selectedCustomer.registered_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Total Spent</p>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <p className="font-bold text-primary">${selectedCustomer.total_spent?.toFixed(2)}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Active Licenses</p>
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          <p className="font-medium">{selectedCustomer.total_licenses}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Payment Methods</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <CreditCard className="h-4 w-4" />
                          {selectedCustomer.payment_methods_used?.map((method: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{method}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Purchase History</p>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {selectedCustomer.purchase_history?.map((order: any, idx: number) => (
                            <div key={idx} className="p-2 rounded bg-muted/50 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">${order.total?.toFixed(2)}</span>
                                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Licenses</p>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {selectedCustomer.licenses?.map((license: any, idx: number) => (
                            <div key={idx} className="p-2 rounded bg-muted/50 text-sm">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-mono text-xs break-all">{license.key}</p>
                                  {license.hwid && (
                                    <p className="text-xs text-muted-foreground mt-1">HWID: {license.hwid}</p>
                                  )}
                                </div>
                                <Badge variant={license.status === 'active' ? 'default' : 'secondary'}>
                                  {license.status}
                                </Badge>
                              </div>
                              {license.expires_at && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Expires: {new Date(license.expires_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                      Select a customer to view details
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
