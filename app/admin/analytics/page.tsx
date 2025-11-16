"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import Link from "next/link"
import { ArrowLeft, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b']

interface DailyStat {
  date: string
  orders: number
  revenue: number
}

export default function AnalyticsPage() {
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [categoryStats, setCategoryStats] = useState<any[]>([])
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    conversionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      const supabase = createClient()

      const { data: orders } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: true })

      // Process daily stats
      const stats: Record<string, { orders: number; revenue: number }> = {}
      let totalRevenue = 0
      let totalOrders = 0

      orders?.forEach((order) => {
        const date = new Date(order.created_at).toLocaleDateString()
        if (!stats[date]) {
          stats[date] = { orders: 0, revenue: 0 }
        }
        stats[date].orders += 1
        stats[date].revenue += order.total_amount || 0
        totalRevenue += order.total_amount || 0
        totalOrders += 1
      })

      const chartData = Object.entries(stats)
        .map(([date, data]) => ({ date, ...data }))
        .slice(-30) // Last 30 days

      setDailyStats(chartData)

      const productCounts: Record<string, { name: string; count: number; revenue: number }> = {}
      
      orders?.forEach((order) => {
        order.order_items?.forEach((item: any) => {
          const id = item.product_id
          if (!productCounts[id]) {
            productCounts[id] = { name: `Product ${id.slice(0, 8)}`, count: 0, revenue: 0 }
          }
          productCounts[id].count += item.quantity || 1
          productCounts[id].revenue += item.price_at_purchase || 0
        })
      })

      const topProductsData = Object.values(productCounts)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      setTopProducts(topProductsData)

      const categoryData = [
        { name: 'Gaming', value: 60, color: COLORS[0] },
        { name: 'Security', value: 30, color: COLORS[1] },
        { name: 'Utilities', value: 10, color: COLORS[2] }
      ]
      setCategoryStats(categoryData)

      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      setSummary({
        totalRevenue,
        totalOrders,
        avgOrderValue,
        conversionRate: 12.5 // Mock conversion rate
      })

      setLoading(false)
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="flex items-center gap-2 text-primary hover:underline mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Link>
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Detailed insights and performance metrics</p>
          </div>
          <Badge variant="outline" className="bg-primary/5">
            Last 30 days
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summary.totalRevenue.toFixed(2)}</div>
              <div className="flex items-center gap-1 text-xs text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span>+12.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summary.avgOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">Visitors to customers</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList>
            <TabsTrigger value="revenue">Revenue & Orders</TabsTrigger>
            <TabsTrigger value="products">Top Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Orders Trend</CardTitle>
                <CardDescription>Daily performance over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} name="Revenue ($)" />
                    <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={2} name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performers by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
