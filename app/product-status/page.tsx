"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

export default function ProductStatusPage() {
  const products = [
    { name: "Valorant Pro", status: "operational", lastCheck: "2 minutes ago" },
    { name: "Valorant Private", status: "operational", lastCheck: "5 minutes ago" },
    { name: "Permanent Spoofer", status: "operational", lastCheck: "1 minute ago" },
    { name: "HWID Spoofer", status: "operational", lastCheck: "3 minutes ago" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "down":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold">Product Status</h1>
            <p className="text-muted-foreground">Real-time status of all our products</p>
          </div>

          <div className="space-y-4">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(product.status)}
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last checked: {product.lastCheck}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-500 capitalize">
                  {product.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
