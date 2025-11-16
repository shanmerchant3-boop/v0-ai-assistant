"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, Settings, ShoppingBag, Key, Download, FileText, TrendingUp, Package, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  email?: string
  full_name?: string
  username?: string
  avatar_url?: string
}

interface DashboardStats {
  totalOrders: number
  activeLicenses: number
  totalSpent: number
  recentOrders: any[]
  recentLicenses: any[]
}

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient()

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle()

      const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .or(`user_id.eq.${authUser.id},items->>email.eq.${authUser.email}`)
        .order('created_at', { ascending: false })

      const { data: licenseKeys } = await supabase
        .from('license_keys')
        .select('*, products(*)')
        .or(`user_id.eq.${authUser.id}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false})

      const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

      setUser({
        id: authUser.id,
        email: authUser.email,
        ...profile,
      })

      setStats({
        totalOrders: orders?.length || 0,
        activeLicenses: licenseKeys?.length || 0,
        totalSpent,
        recentOrders: orders?.slice(0, 5) || [],
        recentLicenses: licenseKeys?.slice(0, 3) || []
      })

      setLoading(false)
    }

    loadDashboard()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
        <span>Loading dashboard...</span>
      </div>
    </div>
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user.full_name || user.username || "User"}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>Your latest purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div>
                        <p className="font-semibold text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">${order.total_amount}</p>
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/dashboard/orders`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground mb-3">No orders yet</p>
                  <Button asChild size="sm">
                    <Link href="/store">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Active Licenses
              </CardTitle>
              <CardDescription>Your current subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentLicenses && stats.recentLicenses.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentLicenses.map((license) => (
                    <div key={license.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm">{license.products?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {license.expires_at ? 
                              `Expires: ${new Date(license.expires_at).toLocaleDateString()}` :
                              'Lifetime'
                            }
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <Link href="/dashboard/licenses">View License</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No active licenses</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
