"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from 'next/navigation'

interface VouchFormProps {
  productId: string
  productName: string
  orderId?: string
}

export default function VouchForm({ productId, productName, orderId }: VouchFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("You must be logged in to leave a vouch")
        router.push("/auth/login")
        return
      }

      const { error: insertError } = await supabase.from("reviews").insert({
        user_id: user.id,
        product_id: productId,
        rating,
        title,
        content,
      })

      if (insertError) {
        console.error("[v0] Error submitting vouch:", insertError)
        setError("Failed to submit vouch. Please try again.")
        return
      }

      setSuccess(true)
      setRating(0)
      setTitle("")
      setContent("")

      setTimeout(() => {
        router.push("/vouchers")
      }, 2000)
    } catch (err) {
      console.error("[v0] Error:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-2xl font-bold mb-4">Leave a Vouch</h3>
      <p className="text-muted-foreground mb-6">
        Share your experience with {productName}
      </p>

      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-green-500 fill-green-500" />
          </div>
          <h4 className="text-xl font-bold mb-2">Thank you for your vouch!</h4>
          <p className="text-muted-foreground">
            Redirecting to vouchers page...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title (Optional)
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Your Review *
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us what you think..."
              rows={5}
              required
              className="resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-500 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || rating === 0 || !content.trim()}
            className="w-full gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Vouch
              </>
            )}
          </Button>
        </form>
      )}
    </motion.div>
  )
}
