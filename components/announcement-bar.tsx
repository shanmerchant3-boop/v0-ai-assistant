'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const dismissed = localStorage.getItem('announcement-bar-v2-dismissed')
    if (dismissed === 'true') {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('announcement-bar-v2-dismissed', 'true')
    window.dispatchEvent(new Event('announcement-dismissed'))
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] bg-gradient-to-r from-primary via-purple-600 to-accent text-white py-3 px-4 text-center shadow-lg">
      <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto relative">
        <span className="text-sm font-medium">
          Announcement: Join us on Discord!{' '}
          <a 
            href="https://discord.gg/zaliantud" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-purple-200 transition-colors"
          >
            discord.gg/zaliantud
          </a>
        </span>
        <button
          onClick={handleDismiss}
          className="absolute right-4 hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
