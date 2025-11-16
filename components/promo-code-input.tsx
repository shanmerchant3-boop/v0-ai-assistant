"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Check, X } from "lucide-react"

interface PromoCodeInputProps {
  onApply: (code: string) => void
  validCodes: string[]
}

export default function PromoCodeInput({ onApply, validCodes }: PromoCodeInputProps) {
  const [code, setCode] = useState("")
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null)

  const handleApply = () => {
    if (validCodes.includes(code)) {
      setFeedback("success")
      onApply(code)
      setTimeout(() => setFeedback(null), 3000)
    } else {
      setFeedback("error")
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  return (
    <div className="space-y-3 mb-6">
      <label className="block text-sm font-medium">Promo Code (Optional)</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="flex-1 bg-input border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Button type="button" variant="outline" onClick={handleApply} className="px-6 bg-transparent">
          Apply
        </Button>
      </div>

      {feedback && (
        <div
          className={`flex gap-2 items-center p-3 rounded-lg text-sm ${
            feedback === "success" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
          }`}
        >
          {feedback === "success" ? (
            <>
              <Check className="w-4 h-4" />
              Code applied successfully!
            </>
          ) : (
            <>
              <X className="w-4 h-4" />
              Invalid promo code
            </>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">Try: WELCOME10, SAVE20, SUMMER15</p>
    </div>
  )
}
