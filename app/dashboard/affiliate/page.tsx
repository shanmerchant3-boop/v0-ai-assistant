"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { createAffiliateCoupon } from "@/lib/affiliate-service"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Copy, TrendingUp, DollarSign, Users } from "lucide-react"
import { motion } from "framer-motion"

interface Coupon {
  id: string
  code: string
  discount_percent: number
  commission_percent: number
  current_uses: number
  max_uses: number
}

export default function AffiliatePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [affiliate, setAffiliate] = useState<any>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [discountPercent, setDiscountPercent] = useState("10")
  const [commissionPercent, setCommissionPercent] = useState("15")

  useEffect(() => {
    async function loadAffiliateData() {
      if (!user) {
        router.push("/auth/login")
        return
      }

      const supabase = createClient()

      // Get or create affiliate account
      const { data: affiliateData } = await supabase.from("affiliates").select("*").eq("id", user.id).single()

      if (!affiliateData) {
        // Create new affiliate account
        const { data: newAffiliate } = await supabase.from("affiliates").insert({ id: user.id }).select().single()
        setAffiliate(newAffiliate)
      } else {
        setAffiliate(affiliateData)
      }

      // Get coupons
      const { data: couponsData } = await supabase.from("coupons").select("*").eq("affiliate_id", user.id)

      setCoupons(couponsData || [])
      setLoading(false)
    }

    loadAffiliateData()
  }, [user, router])

  const handleCreateCoupon = async () => {
    if (!user) return

    setCreating(true)
    try {
      const coupon = await createAffiliateCoupon(
        user.id,
        Number.parseFloat(discountPercent),
        Number.parseFloat(commissionPercent),
      )
      setCoupons((prev) => [...prev, coupon])
      setDiscountPercent("10")
      setCommissionPercent("15")
    } catch (error) {
      console.error("Error creating coupon:", error)
    } finally {
      setCreating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-primary mb-2">Affiliate Program</h1>
        <p className="text-muted-foreground mb-8">Earn commissions by referring customers</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <p className="text-3xl font-bold text-primary">{affiliate?.total_referrals || 0}</p>
                </div>
                <Users className="w-8 h-8 text-primary/50" />
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Commission</p>
                  <p className="text-3xl font-bold text-accent">${affiliate?.total_commission?.toFixed(2) || "0.00"}</p>
                </div>
                <DollarSign className="w-8 h-8 text-accent/50" />
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Commission Rate</p>
                  <p className="text-3xl font-bold text-primary">{affiliate?.commission_rate || 10}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary/50" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Create Coupon */}
        <Card className="p-6 mb-8 border-primary/20">
          <h2 className="text-xl font-semibold text-primary mb-6">Create Affiliate Coupon</h2>
          <div className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Customer Discount %</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your Commission %</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={commissionPercent}
                onChange={(e) => setCommissionPercent(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateCoupon} disabled={creating} className="bg-primary">
              {creating ? "Creating..." : "Generate Coupon"}
            </Button>
          </div>
        </Card>

        {/* Coupons List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Your Coupons</h2>
          {coupons.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No coupons yet. Create one to start earning!</p>
            </Card>
          ) : (
            coupons.map((coupon) => (
              <Card key={coupon.id} className="p-6 border-primary/20 hover:bg-primary/5 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">Coupon Code</p>
                    <div className="flex items-center gap-3">
                      <code className="text-xl font-bold text-primary bg-primary/10 px-4 py-2 rounded">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="p-2 hover:bg-primary/10 rounded transition"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Customer Discount</p>
                    <p className="text-lg font-semibold text-accent">{coupon.discount_percent}%</p>
                  </div>

                  <div className="text-right ml-8">
                    <p className="text-sm text-muted-foreground mb-1">Your Commission</p>
                    <p className="text-lg font-semibold text-primary">{coupon.commission_percent}%</p>
                  </div>

                  <div className="text-right ml-8">
                    <p className="text-sm text-muted-foreground mb-1">Uses</p>
                    <p className="text-lg font-semibold">
                      {coupon.current_uses}/{coupon.max_uses || "∞"}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
