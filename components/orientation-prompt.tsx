'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function OrientationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      // Only show on mobile devices (screen width < 768px)
      const isMobile = window.innerWidth < 768
      // Check if device is in portrait mode
      const isPortrait = window.innerHeight > window.innerWidth
      
      if (isMobile && isPortrait && !isDismissed) {
        setShowPrompt(true)
      } else {
        setShowPrompt(false)
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
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-white shadow-2xl">
        <CardContent className="p-6 text-center">
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <RotateCcw className="h-8 w-8 text-green-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Better Experience in Landscape
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              For the best booking experience, please rotate your device to landscape mode.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleDismiss}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Got it!
            </Button>
            
            <p className="text-xs text-gray-500">
              You can dismiss this message and continue in portrait mode
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 