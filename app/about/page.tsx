"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Users, Target, Zap } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-20">
        {/* Hero */}
        <motion.div className="mb-20 text-center" variants={fadeInUp} initial="initial" animate="animate">
          <h1 className="text-5xl font-bold mb-6">About Zaliant</h1>
          <p className="text-xl text-muted-foreground">Empowering gamers with premium tools since day one</p>
        </motion.div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Target,
              title: "Our Mission",
              description: "To provide the most reliable and innovative gaming tools in the industry.",
            },
            {
              icon: Zap,
              title: "Our Vision",
              description: "A world where every gamer has access to cutting-edge technology.",
            },
            {
              icon: Users,
              title: "Our Values",
              description: "Trust, innovation, and customer satisfaction in everything we do.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="border border-primary/30 rounded-lg p-6 bg-card/50"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.2 }}
            >
              <item.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Story */}
        <motion.div
          className="border border-primary/30 rounded-lg p-8 bg-card/50"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Zaliant Services was founded by a passionate team of gamers and developers who believed that competitive
              gaming deserved better tools. What started as a small project in 2023 has grown into a trusted platform
              serving thousands of players worldwide.
            </p>
            <p>
              We're committed to continuous innovation, security, and providing 24/7 support to our community. Every
              product we release is tested extensively to ensure reliability and performance.
            </p>
            <p>
              Today, Zaliant stands as a beacon of quality in the gaming tools space, with a community of passionate
              users who trust us with their gaming experience.
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
