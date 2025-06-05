'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, X } from 'lucide-react'

export default function OrientationIndicator() {
  const [showIndicator, setShowIndicator] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      // Only show on mobile devices (screen width < 768px)
      const isMobile = window.innerWidth < 768
      // Check if device is in portrait mode
      const isPortrait = window.innerHeight > window.innerWidth
      
      if (isMobile && isPortrait && !isDismissed) {
        setShowIndicator(true)
      } else {
        setShowIndicator(false)
      }
    }

    // Check on mount
    checkOrientation()

    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setShowIndicator(false)
  }

  if (!showIndicator) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 text-amber-800">
          <RotateCcw className="h-4 w-4" />
          <span className="text-sm font-medium">
            Rotate device for better experience
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-amber-600 hover:text-amber-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
} 