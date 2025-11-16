'use client'

import { Check, X } from 'lucide-react'
import { motion } from 'framer-motion'

export function ComparisonTable() {
  const features = [
    { name: 'Undetected', zaliant: true, others: false },
    { name: 'Instant Delivery', zaliant: true, others: false },
    { name: '24/7 Support', zaliant: true, others: false },
    { name: 'Regular Updates', zaliant: true, others: true },
    { name: 'Money-Back Guarantee', zaliant: true, others: false },
    { name: 'HWID Reset', zaliant: true, others: false },
    { name: 'Discord Community', zaliant: true, others: true },
    { name: 'Affordable Pricing', zaliant: true, others: false },
  ]

  return (
    <section className="px-4 md:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Why Choose Zaliant?
        </motion.h2>
        <motion.p
          className="text-center text-muted-foreground mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          See how we compare to competitors
        </motion.p>

        <motion.div
          className="glass-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold text-lg">
                      Zaliant
                    </span>
                  </th>
                  <th className="text-center p-4 text-muted-foreground">Others</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={i} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                    <td className="p-4 font-medium">{feature.name}</td>
                    <td className="text-center p-4">
                      {feature.zaliant ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-4">
                      {feature.others ? (
                        <Check className="w-6 h-6 text-muted-foreground mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-red-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
