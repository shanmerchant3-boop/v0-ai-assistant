'use client'

import { Shield, RefreshCw, Award, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export function TrustSignals() {
  const signals = [
    {
      icon: Shield,
      title: '256-bit SSL Encryption',
      description: 'Bank-level security for all transactions',
    },
    {
      icon: RefreshCw,
      title: '7-Day Money Back',
      description: '100% satisfaction guarantee',
    },
    {
      icon: Award,
      title: '99.9% Undetected Rate',
      description: 'Advanced bypass technology',
    },
    {
      icon: Users,
      title: '1,500+ Happy Customers',
      description: '4.98/5 average rating',
    },
  ]

  return (
    <section className="px-4 md:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Trusted & Secure
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {signals.map((signal, i) => (
            <motion.div
              key={i}
              className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
              variants={fadeInUp}
            >
              <signal.icon className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-2">{signal.title}</h3>
              <p className="text-sm text-muted-foreground">{signal.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
