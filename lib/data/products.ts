export interface Product {
  id: string
  title: string
  slug: string
  shortDescription: string
  longDescription: string
  price: number
  images: string[]
  category: string
  tags: string[]
  features?: string[]
  specs?: Record<string, string>
  badge?: string
  status?: "available" | "sold_out" | "coming_soon"
  variants?: Array<{
    duration: string
    description: string
    price: number
  }>
}

export const seedProducts: Product[] = [
  {
    id: "1",
    title: "Valorant Private",
    slug: "valorant-private",
    shortDescription: "Private build low ban chance.",
    longDescription:
      "Private build with minimal detection risk. Designed for competitive players who need reliability and performance.",
    price: 14.99,
    images: ["/images/valorant-private-box.png"],
    category: "gaming",
    tags: ["valorant", "competitive", "private"],
    features: [
      "Windows 10/11",
      "Intel/Amd",
      "Enable Aimbot",
      "Recoil Control System",
      "Smooth aiming",
      "Visible Check",
      "Draw FOV",
      "Trigger Bot with delay",
      "2D Box & Corner Box",
      "Skeleton & Healthbar",
      "Stream Proof",
      "Deatmatch Mode",
      "Unlock All",
      "Change menu color",
    ],
    specs: {
      Platform: "Windows 10/11",
      Support: "Discord + Email",
      Updated: "6/11/2025",
    },
    badge: "Undetected",
    status: "available",
    variants: [
      { duration: "7 Days", description: "7 Days access to Valorant Private", price: 14.99 },
      { duration: "30 Days", description: "30 Days access to Valorant Private", price: 39.99 },
      { duration: "Lifetime", description: "Lifetime access to Valorant Private", price: 99.99 },
    ],
  },
  {
    id: "2",
    title: "Valorant Pro",
    slug: "valorant-pro",
    shortDescription: "Included vanguard bypass low ban chance",
    longDescription:
      "Advanced Valorant tool with vanguard bypass technology. Low detection rate with regular updates and priority support.",
    price: 14.99,
    images: ["/images/valorant-private-box.png"],
    category: "gaming",
    tags: ["valorant", "competitive", "bypass"],
    features: [
      "Windows 10/11",
      "Intel/Amd",
      "Vanguard Bypass included",
      "Silent Aim [Hold]",
      "Recoil Control",
      "2D/3D Box ESP",
      "Skeleton & Agent Icon",
      "Chams ESP with Rainbow mode",
      "No Spread",
      "Skip Tutorial & Unlock ALL",
      "Bunny Hop",
      "ThirdPerson mode",
      "Spin Bot",
      "Custom builds for all users",
    ],
    specs: {
      Platform: "Windows 10/11",
      Support: "Priority Discord",
      Updated: "6/11/2025",
    },
    badge: "Undetected",
    status: "available",
    variants: [
      { duration: "3 Days", description: "3 Days access to Valorant Pro", price: 14.99 },
      { duration: "7 Days", description: "7 Days access to Valorant Pro", price: 34.99 },
      { duration: "30 Days", description: "30 Days access to Valorant Pro", price: 74.99 },
      { duration: "Lifetime", description: "Lifetime access to Valorant Pro", price: 149.99 },
    ],
  },
  {
    id: "3",
    title: "Permanent Spoofer",
    slug: "permanent-spoofer",
    shortDescription: "Permanent hardware ID spoofing solution",
    longDescription:
      "Enterprise-grade HWID spoofing with permanent configuration. Supports all major hardware components with automatic detection.",
    price: 14.99,
    images: ["/images/perm-spoofer-box.png"],
    category: "security",
    tags: ["privacy", "hwid", "permanent"],
    features: [
      "Permanent HWID spoofing",
      "Windows 10-11 support",
      "Intel & AMD compatible",
      "Works with all anti-cheats",
      "All motherboards supported",
      "TPM Bypass for Valorant",
      "Supports all major games",
      "One-click operation",
      "No traces left",
      "Lifetime updates",
    ],
    specs: {
      Platform: "Windows 10/11",
      Support: "Priority Discord",
      Updated: "8/11/2025",
    },
    badge: "Undetected",
    status: "available",
    variants: [
      { duration: "One-time", description: "One-time access to Permanent Spoofer", price: 14.99 },
      { duration: "Lifetime", description: "Lifetime access to Permanent Spoofer", price: 39.99 },
    ],
  },
]

export const PROMO_CODES = {
  WELCOME10: { type: "fixed", value: 10, description: "Welcome bonus" },
  ZALIANT20: { type: "percent", value: 0.2, description: "20% off" },
  SAVE20: { type: "percent", value: 0.2, description: "20% discount" },
  SUMMER15: { type: "percent", value: 0.15, description: "Summer sale 15%" },
} as const
