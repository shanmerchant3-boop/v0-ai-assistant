"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ShoppingCart, User, Sun, Moon } from 'lucide-react'
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import CartDrawer from "./cart-drawer"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const { items } = useCart()
  const { user, signOut } = useAuth()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const DISCORD_SERVER_URL = "https://discord.gg/zaliantud"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/store", label: "Products" },
    { href: "/product-status", label: "Product Status" },
    { href: "/vouchers", label: "Vouches" },
    { href: "/about", label: "About" },
  ]

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-primary/20 shadow-lg shadow-primary/5"
            : "bg-background/80 backdrop-blur-sm border-b border-primary/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/zaliant-logo-3d.png"
                alt="Zaliant"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </motion.div>
            <span className="text-foreground font-bold text-xl hidden sm:inline">Zaliant</span>
          </Link>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right side - Cart, User, Theme, and menu */}
          <div className="flex items-center gap-3">
            {/* Theme toggle button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Cart button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 hover:bg-primary/10 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 bg-gradient-to-r from-primary to-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-primary/20">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login" className="hidden sm:block">
                <Button size="sm" variant="outline" className="border-primary/30">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Get Started button - visible on desktop */}
            <a href={DISCORD_SERVER_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg shadow-primary/30">
                Discord
              </Button>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-primary/10 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-card/95 backdrop-blur-xl border-t border-primary/20 p-4 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {!user && (
                <Link href="/auth/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-primary/30"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
              <a href={DISCORD_SERVER_URL} target="_blank" rel="noopener noreferrer" className="block">
                <Button
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Discord
                </Button>
              </a>
            </div>
          </motion.nav>
        )}
      </header>

      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
    </>
  )
}
