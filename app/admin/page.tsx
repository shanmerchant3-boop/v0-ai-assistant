"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown, Activity, Trash2, Home, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeLicenses: 0,
    products: 0,
    recentOrders: [],
    revenueChange: 0,
    ordersChange: 0
  })
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()

      const [ordersRes, productsRes, licensesRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("id"),
        supabase.from("licenses").select("*").eq("status", "active")
      ])

      const orders = ordersRes.data || []
      const totalOrders = orders.length
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      const products = productsRes.data?.length || 0
      const activeLicenses = licensesRes.data?.length || 0

      const now = new Date()
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const last14Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

      const recentOrders = orders.filter(o => new Date(o.created_at) >= last7Days)
      const previousOrders = orders.filter(o => {
        const date = new Date(o.created_at)
        return date >= last14Days && date < last7Days
      })

      const recentRevenue = recentOrders.reduce((sum, o) => sum + o.total_amount, 0)
      const previousRevenue = previousOrders.reduce((sum, o) => sum + o.total_amount, 0)

      const revenueChange = previousRevenue > 0 
        ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 
        : 0

      const ordersChange = previousOrders.length > 0
        ? ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100
        : 0

      setStats({
        totalOrders,
        totalRevenue,
        activeLicenses,
        products,
        recentOrders: orders.slice(0, 5),
        revenueChange,
        ordersChange
      })
      setLoading(false)
    }

    loadStats()
    
    const interval = setInterval(loadStats, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  async function clearAllStats() {
    if (!confirm("Are you sure you want to clear ALL orders, revenue, and license data? This action cannot be undone!")) {
      return
    }

    setClearing(true)
    const supabase = createClient()

    try {
      // Delete all orders (this will cascade to order_items)
      await supabase.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000")
      
      // Delete all license keys
      await supabase.from("license_keys").delete().neq("id", "00000000-0000-0000-0000-000000000000")
      
      // Reload stats after clearing
      await loadStats()
      
      alert("All revenue and stats data has been cleared successfully!")
    } catch (error) {
      console.error("Error clearing stats:", error)
      alert("Failed to clear data. Please try again.")
    } finally {
      setClearing(false)
    }
  }

  function handleSignOut() {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin-auth")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 animate-pulse text-primary" />
          <span>Loading admin dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor your store performance and manage operations</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Website
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <Button
              variant="destructive"
              onClick={clearAllStats}
              disabled={clearing}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {clearing ? "Clearing..." : "Clear All Stats"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              {stats.revenueChange !== 0 && (
                <div className={`flex items-center gap-1 text-xs ${stats.revenueChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.revenueChange > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(stats.revenueChange).toFixed(1)}% from last week</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              {stats.ordersChange !== 0 && (
                <div className={`flex items-center gap-1 text-xs ${stats.ordersChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.ordersChange > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(stats.ordersChange).toFixed(1)}% from last week</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Licenses
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLicenses}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Products
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products}</div>
              <p className="text-xs text-muted-foreground">In catalog</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                      <div>
                        <p className="font-medium text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${order.total_amount.toFixed(2)}</p>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No orders yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/products">
                <Card className="p-4 hover:bg-primary/5 cursor-pointer transition border-border/50">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Manage Products</h3>
                      <p className="text-sm text-muted-foreground">Add, edit, or delete products</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/orders">
                <Card className="p-4 hover:bg-primary/5 cursor-pointer transition border-border/50">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">View Orders</h3>
                      <p className="text-sm text-muted-foreground">Manage customer orders</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/analytics">
                <Card className="p-4 hover:bg-primary/5 cursor-pointer transition border-border/50">
                  <div className="flex items-center gap-3">
                    <Activity className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Analytics</h3>
                      <p className="text-sm text-muted-foreground">View detailed insights</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/coupons">
                <Card className="p-4 hover:bg-primary/5 cursor-pointer transition border-border/50">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Manage Coupons</h3>
                      <p className="text-sm text-muted-foreground">Create and manage discounts</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
