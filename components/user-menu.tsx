'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User, LogOut, ChevronDown } from 'lucide-react'

export function UserMenu() {
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

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <User className="w-4 h-4" />
        <span className="hidden md:block">{session.user.name}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <Card className="absolute right-0 mt-2 w-64 z-50 shadow-xl border-2">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{session.user.name}</p>
                  <p className="text-sm text-gray-500">{session.user.email}</p>
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