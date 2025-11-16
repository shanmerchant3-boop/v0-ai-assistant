import Link from "next/link"
import { MessageCircle, Youtube, Gift, Package } from 'lucide-react'
import Image from "next/image"

export default function Footer() {
  const DISCORD_SERVER_URL = "https://discord.gg/zaliantud"

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/zaliant-logo-3d.png"
                alt="Zaliant"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h3 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Zaliant
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium gaming tools engineered for excellence and undetected performance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/store" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/store/bundles" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Bundle Deals
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href={DISCORD_SERVER_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Join Discord
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Youtube className="w-4 h-4" />
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Zaliant Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
