"use client"

import { useEffect, useState } from 'react'

const videos = [
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jett-updraft-dash-valorant-moewalls-com-UesGrulpCSuF46PpLP3YfeebvOrVyi.mp4',
  '/videos/valorant-strike-formation.mp4'
]

export default function ValorantVideoBackground() {
  const [isMounted, setIsMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsMounted(true)
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isMounted) return null

  const parallaxTransform = `translateY(${scrollY * 0.3}px)`

  return (
    <>
      <style jsx>{`
        @keyframes fadein {
          to {
            opacity: 1;
          }
        }
      `}</style>

      {/* Desktop: Show multiple videos */}
      <div className="hidden lg:block">
        {videos.map((src, index) => (
          <video
            key={`desktop-${index}`}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              objectFit: 'cover',
              zIndex: -1,
              filter: `brightness(${25 - index * 5}%) blur(2px)`,
              opacity: 0,
              animation: `fadein 1.5s forwards ${index * 0.3}s`,
              transform: parallaxTransform,
            }}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
      </div>

      {/* Tablet: Show first video only */}
      <div className="hidden md:block lg:hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: -1,
            filter: 'brightness(25%) blur(2px)',
            opacity: 0,
            animation: 'fadein 1.5s forwards',
            transform: parallaxTransform,
          }}
        >
          <source src={videos[0]} type="video/mp4" />
        </video>
      </div>

      {/* Mobile: Show first video only */}
      <div className="block md:hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: -1,
            filter: 'brightness(25%) blur(2px)',
            opacity: 0,
            animation: 'fadein 1.5s forwards',
            transform: parallaxTransform,
          }}
        >
          <source src={videos[0]} type="video/mp4" />
        </video>
      </div>
    </>
  )
}
