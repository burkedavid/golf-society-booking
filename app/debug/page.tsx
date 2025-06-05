'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugPage() {
  const { data: session, status } = useSession()

  const handleForceLogout = async () => {
    // Clear all storage
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear cookies manually
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=")
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    })
    
    // Sign out
    await signOut({ callbackUrl: '/auth/signin', redirect: true })
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Session Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Session Status:</h3>
              <p>{status}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Session Data:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
            
            <div className="flex space-x-4">
              <Button onClick={handleForceLogout} variant="destructive">
                Force Logout
              </Button>
              <Button onClick={handleRefresh} variant="outline">
                Refresh Page
              </Button>
              <Button onClick={() => window.location.href = '/auth/signin'} variant="outline">
                Go to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 