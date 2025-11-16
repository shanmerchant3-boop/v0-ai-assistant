"use client"

import type React from "react"

import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare } from "lucide-react"

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for your message! We will get back to you soon.")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-2xl mx-auto px-4 md:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">Have questions? We{"'"}d love to hear from you.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-primary/30 rounded-lg p-6 bg-card/50"
          >
            <Mail className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <p className="text-muted-foreground">support@zaliant.dev</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-primary/30 rounded-lg p-6 bg-card/50"
          >
            <MessageSquare className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Support</h3>
            <p className="text-muted-foreground">24/7 Live Chat Available</p>
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="border border-primary/30 rounded-lg p-8 bg-card/50 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              required
              rows={6}
              className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Your message..."
            />
          </div>

          <Button type="submit" size="lg" className="w-full glow-primary">
            Send Message
          </Button>
        </motion.form>
      </main>

      <Footer />
    </div>
  )
}
