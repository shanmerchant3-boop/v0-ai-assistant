export const siteConfig = {
  name: "Zaliant Services",
  description: "Premium digital products crafted to enhance your gameplay and dominate your opponents with ease.",
  url: "https://zaliantservices.com",
  ogImage: "/zaliant-logo.png",
  links: {
    discord: "https://discord.gg/zaliant",
    twitter: "https://twitter.com/zaliant",
  },
}

export const heroContent = {
  badge: "Trusted by 1,500+ Gamers",
  headline: "Welcome to Zaliant Services!",
  subtitle: "Premium products crafted to enhance your gameplay and dominate your opponents with ease.",
  cta: {
    primary: "View Store",
    secondary: "Check Status",
  },
}

export const trustBadges = [
  { label: "1,500+ Gamers", value: "1500", icon: "users" },
  { label: "350 Online Now", value: "350", icon: "activity" },
  { label: "100% Secure", value: "100", icon: "shield" },
]

export const stats = [
  { label: "Uptime", value: "99.9%", icon: "trending-up" },
  { label: "Products Sold", value: "3,491", icon: "shopping-cart" },
  { label: "Average Rating", value: "4.98", icon: "star" },
  { label: "Support", value: "24/7", icon: "headphones" },
]

export const features = [
  {
    icon: "shield-check",
    title: "Undetected",
    description: "Advanced protection keeps you safe",
  },
  {
    icon: "zap",
    title: "Instant Delivery",
    description: "Get access immediately after purchase",
  },
  {
    icon: "headphones",
    title: "24/7 Support",
    description: "Our team is always here to help",
  },
]

export const pricingTiers = [
  {
    name: "Basic",
    monthly: 9,
    annual: 90,
    description: "Perfect for getting started",
    features: ["5 downloads/month", "Standard support", "Basic security"],
    recommended: false,
  },
  {
    name: "Pro",
    monthly: 29,
    annual: 290,
    description: "Most popular choice",
    features: ["50 downloads/month", "Priority support", "Advanced security", "Early access"],
    recommended: true,
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    description: "For large teams",
    features: ["Unlimited downloads", "Dedicated support", "Custom contracts", "SLAs"],
    recommended: false,
    custom: true,
  },
]

export const testimonials = [
  {
    name: "Alex Chen",
    role: "Pro Gamer",
    rating: 5,
    text: "Best service in the market. Instant delivery, premium quality, and 24/7 support.",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Jordan Lee",
    role: "Competitive Player",
    rating: 5,
    text: "Reliable and trustworthy. Been using Zaliant for 6 months. Zero issues.",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Casey Morgan",
    role: "Gaming Enthusiast",
    rating: 5,
    text: "The support team is incredible. Had an issue and it was resolved in minutes.",
    avatar: "/placeholder-user.jpg",
  },
]

export const faqs = [
  {
    question: "How does instant delivery work?",
    answer:
      "Once you complete your purchase, your product is automatically delivered to your account within seconds. No manual processing needed.",
  },
  {
    question: "Is Zaliant Services secure?",
    answer:
      "Yes, we use enterprise-grade encryption and security protocols. Your data and purchases are protected at all times.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer a 7-day money-back guarantee on all products. If you're not satisfied, contact support for a full refund.",
  },
  {
    question: "Do you offer technical support?",
    answer: "Our 24/7 support team is available via chat, email, and Discord to help with any issues.",
  },
  {
    question: "Can I upgrade my plan?",
    answer: "Yes, you can upgrade anytime. We'll prorate your billing and adjust your access immediately.",
  },
]

export const footerLinks = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Product Status", href: "/status" },
    { label: "Vouchers", href: "/vouchers" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Support", href: "/support" },
    { label: "Discord", href: "https://discord.gg/zaliant" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
  ],
}
