"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "How do I activate my product?",
    answer:
      "After purchase, you'll receive activation details in your email within minutes. Simply follow the instructions to get instant access.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes, we offer 30-day money-back guarantee if you're not satisfied with your purchase. Contact support for assistance.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards through our secure payment gateway. Additional methods may be available - contact support.",
  },
  {
    question: "Do you offer discounts for bulk purchases?",
    answer: "Yes! Contact our sales team for special pricing on bulk orders and enterprise solutions.",
  },
  {
    question: "How often do you update your products?",
    answer:
      "We release updates regularly to ensure compatibility and add new features. All products receive ongoing support.",
  },
]

export default function SupportPage() {
  const [expanded, setExpanded] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Support & FAQ</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions and get help from our support team.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="border border-primary/30 rounded-lg bg-card/50 overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full p-6 flex justify-between items-center hover:bg-primary/5 transition-colors text-left"
              >
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                <ChevronDown className={`w-5 h-5 transition-transform ${expanded === i ? "rotate-180" : ""}`} />
              </button>

              {expanded === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="border-t border-border px-6 py-4 text-muted-foreground"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 border border-primary/30 rounded-lg bg-gradient-to-br from-primary/5 via-transparent to-accent/5 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">Our support team is available 24/7 to help. Reach out anytime!</p>
          <a
            href="mailto:support@zaliant.dev"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Contact Support
          </a>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
