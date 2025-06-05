'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User, LogOut, ChevronDown } from 'lucide-react'

interface UserMenuProps {
  variant?: 'default' | 'header'
}

export function UserMenu({ variant = 'default' }: UserMenuProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  console.log('UserMenu session:', session) // Debug log

  if (!session) {
    console.log('UserMenu: No session found') // Debug log
    return null
  }

  const handleLogout = async () => {
    console.log('UserMenu: Logging out...') // Debug log
    
    // Clear browser storage
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
    }
    
    await signOut({ 
      callbackUrl: '/auth/signin',
      redirect: true 
    })
  }

  const buttonClasses = variant === 'header' 
    ? "flex items-center space-x-2 text-white hover:text-green-100 hover:bg-white/10"
    : "flex items-center space-x-2 text-gray-700 hover:text-gray-900"

  const iconClasses = variant === 'header' ? "text-white" : ""

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <User className={`w-4 h-4 ${iconClasses}`} />
        <span className="hidden md:block">{session.user.name}</span>
        <ChevronDown className={`w-4 h-4 ${iconClasses}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <Card className="absolute right-0 mt-2 w-80 z-50 shadow-xl border-2">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{session.user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{session.user.email}</p>
                </div>
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Member #{session.user.memberNumber}</div>
                  <div>Handicap: {session.user.handicap}</div>
                  <div className="capitalize">Role: {session.user.role}</div>
                </div>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 