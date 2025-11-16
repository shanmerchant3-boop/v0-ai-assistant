export interface Product {
  id: string
  title: string
  description: string
  longDescription: string
  price: number
  image: string
  category: string
  tags: string[]
  features: string[]
  faq: Array<{ question: string; answer: string }>
}

export const PRODUCTS: Product[] = [
  {
    id: "valorant-pro",
    title: "Valorant Pro",
    description: "Advanced game enhancement tool with premium features",
    longDescription:
      "Valorant Pro is our flagship product designed for competitive players. Features advanced settings, real-time analytics, and premium support.",
    price: 29.99,
    image: "/valorant-pro-game-enhancement.jpg",
    category: "Gaming",
    tags: ["Popular", "Game Tool", "Competitive"],
    features: [
      "Advanced analytics dashboard",
      "Real-time performance monitoring",
      "Priority support access",
      "Regular feature updates",
      "30-day money-back guarantee",
    ],
    faq: [
      {
        question: "Is this safe to use?",
        answer: "Yes, all our products are tested and verified safe.",
      },
      {
        question: "How long does delivery take?",
        answer: "Instant digital delivery after purchase.",
      },
      {
        question: "Do you offer refunds?",
        answer: "Yes, 30-day money-back guarantee on all products.",
      },
    ],
  },
  {
    id: "permanent-hwid-spoofer",
    title: "Permanent HWID Spoofer",
    description: "Professional hardware ID spoofing solution",
    longDescription:
      "Permanent HWID Spoofer provides enterprise-grade hardware identification protection and spoofing capabilities.",
    price: 49.99,
    image: "/cybersecurity-hardware-protection-tool.jpg",
    category: "Security",
    tags: ["Popular", "Security Tool", "Professional"],
    features: [
      "Permanent HWID spoofing",
      "Zero detection rate",
      "Lifetime license",
      "24/7 dedicated support",
      "Regular security updates",
      "Multi-system compatibility",
    ],
    faq: [
      {
        question: "What systems are supported?",
        answer: "Windows 10, 11, and Server editions.",
      },
      {
        question: "Is technical support included?",
        answer: "Yes, 24/7 support for all customers.",
      },
    ],
  },
  {
    id: "pro-toolkit",
    title: "Pro Toolkit Bundle",
    description: "Complete suite of professional tools",
    longDescription: "Bundle of all professional tools at discounted rate.",
    price: 79.99,
    image: "/professional-software-tools-bundle.jpg",
    category: "Bundles",
    tags: ["Best Value", "Bundle", "Savings"],
    features: ["All premium tools included", "Lifetime license", "Free updates forever", "Priority support"],
    faq: [],
  },
  {
    id: "starter-pack",
    title: "Starter Pack",
    description: "Perfect for beginners getting started",
    longDescription: "Entry-level package with essential features.",
    price: 14.99,
    image: "/beginner-starter-software-package.jpg",
    category: "Bundles",
    tags: ["Beginner Friendly", "Affordable"],
    features: ["Core features included", "Basic support", "30-day trial to upgrade"],
    faq: [],
  },
]

export const PROMO_CODES: Record<string, { discount: number; type: "percent" | "fixed" }> = {
  WELCOME10: { discount: 10, type: "percent" },
  SAVE20: { discount: 20, type: "percent" },
  SUMMER15: { discount: 15, type: "percent" },
  SAVE5: { discount: 5, type: "fixed" },
}
