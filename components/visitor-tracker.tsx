"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function VisitorTracker() {
  useEffect(() => {
    async function trackVisitor() {
      try {
        const supabase = createClient()
        
        // Get device and browser info
        const userAgent = navigator.userAgent
        const getBrowser = () => {
          if (userAgent.includes("Chrome")) return "Chrome"
          if (userAgent.includes("Firefox")) return "Firefox"
          if (userAgent.includes("Safari")) return "Safari"
          if (userAgent.includes("Edge")) return "Edge"
          return "Unknown"
        }
        
        const getOS = () => {
          if (userAgent.includes("Windows")) return "Windows"
          if (userAgent.includes("Mac")) return "MacOS"
          if (userAgent.includes("Linux")) return "Linux"
          if (userAgent.includes("Android")) return "Android"
          if (userAgent.includes("iOS")) return "iOS"
          return "Unknown"
        }
        
        const getDeviceType = () => {
          if (/Mobile|Android|iPhone/i.test(userAgent)) return "Mobile"
          if (/Tablet|iPad/i.test(userAgent)) return "Tablet"
          return "Desktop"
        }

        // Get current page
        const currentPage = window.location.pathname

        // Try to get IP from an API (fallback to "unknown")
        let ipAddress = "unknown"
        try {
          const ipResponse = await fetch("https://api.ipify.org?format=json")
          const ipData = await ipResponse.json()
          ipAddress = ipData.ip
        } catch {
          // Fallback if IP fetch fails
        }

        const visitorData = {
          ip_address: ipAddress,
          user_agent: userAgent,
          browser: getBrowser(),
          os: getOS(),
          device_type: getDeviceType(),
          device_info: {
            screen: {
              width: window.screen.width,
              height: window.screen.height
            },
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          },
          location: {}, // Can be expanded with geolocation API
          pages_visited: [currentPage],
          referrer: document.referrer || "direct",
          last_seen: new Date().toISOString()
        }

        // Check if visitor exists by IP
        const { data: existingVisitor } = await supabase
          .from("visitors")
          .select("*")
          .eq("ip_address", ipAddress)
          .single()

        if (existingVisitor) {
          // Update existing visitor
          await supabase
            .from("visitors")
            .update({
              last_seen: new Date().toISOString(),
              session_count: existingVisitor.session_count + 1,
              pages_visited: [...(existingVisitor.pages_visited || []), currentPage]
            })
            .eq("id", existingVisitor.id)
        } else {
          // Insert new visitor
          await supabase.from("visitors").insert([visitorData])
        }

        console.log("[v0] Visitor tracked successfully")
      } catch (error) {
        console.error("[v0] Error tracking visitor:", error)
      }
    }

    trackVisitor()
  }, [])

  return null
}
