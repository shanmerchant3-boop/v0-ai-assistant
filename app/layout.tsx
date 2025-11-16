import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"
import { NotificationProvider } from "@/context/notification-context"
import { ScrollProgress } from "@/components/scroll-progress"
import { ThemeProvider } from "@/components/theme-provider"
import ValorantVideoBackground from "@/components/valorant-video-background"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zaliant Services | Premium Digital Products",
  description: "Premium gaming tools and services - Valorant Pro, HWID Spoofer, and more",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/zaliant-logo-3d.png",
        type: "image/png",
      },
    ],
    apple: "/zaliant-logo-3d.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#7D5FFF",
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <ValorantVideoBackground />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollProgress />
          <NotificationProvider>
            <AuthProvider>
              <CartProvider>{children}</CartProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
