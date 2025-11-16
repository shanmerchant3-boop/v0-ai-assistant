"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { createPromoCampaign } from "@/lib/coupon-service"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PromoCoupon {
  id: string
  code: string
  discount_value: number
  current_uses: number
  max_uses: number
  active: boolean
}

export default function CouponsAdmin() {
  const [coupons, setCoupons] = useState<PromoCoupon[]>([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState("")
  const [discountValue, setDiscountValue] = useState("")
  const [maxUses, setMaxUses] = useState("")

  useEffect(() => {
    async function loadCoupons() {
      const supabase = createClient()
      const { data } = await supabase.from("promo_codes").select("*")
      setCoupons(data || [])
      setLoading(false)
    }
    loadCoupons()
  }, [])

  const handleCreateCampaign = async () => {
    if (!code || !discountValue) return

    try {
      const newCampaign = await createPromoCampaign(
        code,
        "percentage",
        Number.parseFloat(discountValue),
        maxUses ? Number.parseInt(maxUses) : 999,
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      )
      setCoupons((prev) => [...prev, newCampaign])
      setCode("")
      setDiscountValue("")
      setMaxUses("")
    } catch (error) {
      console.error("Error creating campaign:", error)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>

        <h1 className="text-3xl font-bold text-primary mb-8">Manage Coupons</h1>

        {/* Create Campaign */}
        <Card className="p-6 mb-8 border-primary/20">
          <h2 className="text-lg font-semibold text-primary mb-4">Create Promo Campaign</h2>
          <div className="grid md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Code</label>
              <Input placeholder="SUMMER50" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Discount %</label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="50"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Uses</label>
              <Input type="number" placeholder="1000" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} />
            </div>
            <Button onClick={handleCreateCampaign} className="bg-primary">
              Create Campaign
            </Button>
          </div>
        </Card>

        {/* Coupons Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5">
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-semibold">{coupon.code}</TableCell>
                  <TableCell>{coupon.discount_value}%</TableCell>
                  <TableCell>
                    {coupon.current_uses}/{coupon.max_uses}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        coupon.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {coupon.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
