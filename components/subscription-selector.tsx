"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Variant {
  id: string
  name: string
  price: number
  billing_cycle?: string
}

interface SubscriptionSelectorProps {
  variants: Variant[]
  onSelect: (variant: Variant) => void
}

export function SubscriptionSelector({ variants, onSelect }: SubscriptionSelectorProps) {
  const [selected, setSelected] = useState<string>(variants[0]?.id)

  const handleSelect = (variant: Variant) => {
    setSelected(variant.id)
    onSelect(variant)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Your Plan</h3>
      <div className="grid grid-cols-1 gap-3">
        {variants.map((variant) => (
          <motion.div key={variant.id} whileHover={{ scale: 1.02 }}>
            <Card
              className={`p-4 cursor-pointer border-2 transition-all ${
                selected === variant.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleSelect(variant)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-primary">{variant.name}</h4>
                  {variant.billing_cycle && <p className="text-xs text-muted-foreground">{variant.billing_cycle}</p>}
                </div>
                <p className="text-2xl font-bold text-accent">${variant.price}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
