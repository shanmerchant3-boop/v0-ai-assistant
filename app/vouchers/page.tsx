"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Star, MessageSquare, User, Calendar } from 'lucide-react'
import Header from "@/components/header"
import Footer from "@/components/footer"
import FireParticles from "@/components/fire-particles"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"

interface Review {
  id: string
  rating: number
  title: string
  content: string
  created_at: string
  profiles: {
    full_name: string | null
    username: string | null
  } | null
  products: {
    name: string
  } | null
}

export default function VouchersPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          title,
          content,
          created_at,
          profiles:user_id (
            full_name,
            username
          ),
          products:product_id (
            name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("[v0] Error fetching reviews:", error)
      } else {
        setReviews(data || [])
      }
      setLoading(false)
    }

    fetchReviews()

    // Setup real-time subscription for new reviews
    const channel = supabase
      .channel("reviews-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
        },
        async (payload) => {
          console.log("[v0] New review received:", payload)
          
          // Fetch the full review with relations
          const { data } = await supabase
            .from("reviews")
            .select(`
              id,
              rating,
              title,
              content,
              created_at,
              profiles:user_id (
                full_name,
                username
              ),
              products:product_id (
                name
              )
            `)
            .eq("id", payload.new.id)
            .single()

          if (data) {
            setReviews((prev) => [data, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <FireParticles
          count={70}
          colors={["#FFD27F", "#FF8A4B", "#FF4AD6", "#7D5FFF"]}
          size={[6, 20]}
          speed={0.08}
          wind={0.1}
          intensity={0.85}
        />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-20">
          <motion.div
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Customer Vouches
            </h1>
            <p className="text-center text-muted-foreground text-lg mb-8">
              Real reviews from real customers. All vouches are verified purchases.
            </p>

            <div className="flex justify-center gap-4 mb-8">
              <Link href="/store">
                <Button>Browse Products</Button>
              </Link>
            </div>

            <div className="glass-card p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  {reviews.length} Total Vouches
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="font-semibold">
                  {reviews.length > 0
                    ? (
                        reviews.reduce((acc, r) => acc + r.rating, 0) /
                        reviews.length
                      ).toFixed(1)
                    : "0.0"}{" "}
                  Average
                </span>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading vouches...</p>
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              className="glass-card p-12 text-center"
              {...fadeInUp}
            >
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No vouches yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to leave a review after your purchase!
              </p>
              <Link href="/store">
                <Button>Shop Now</Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              className="grid gap-6"
              initial="initial"
              animate="animate"
              variants={{
                animate: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  className="glass-card p-6 hover:border-primary/40 transition-colors"
                  variants={fadeInUp}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {review.profiles?.full_name ||
                            review.profiles?.username ||
                            "Anonymous"}
                        </p>
                        {review.products && (
                          <p className="text-sm text-muted-foreground">
                            Purchased: {review.products.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-accent text-accent"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {review.title && (
                    <h3 className="font-bold text-lg mb-2">{review.title}</h3>
                  )}

                  <p className="text-muted-foreground mb-4">{review.content}</p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}
