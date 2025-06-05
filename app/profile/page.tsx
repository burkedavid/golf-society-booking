import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ProfileClient } from '@/components/profile-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Settings } from 'lucide-react'
import Link from 'next/link'
import { ClientUserMenu } from '@/components/client-user-menu'
import OrientationIndicator from '@/components/orientation-indicator'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'member') {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <OrientationIndicator />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <User className="w-8 h-8 mr-3 text-blue-200" />
                  My Profile
                </h1>
                <p className="text-blue-100">Update your personal information</p>
              </div>
            </div>
            <ClientUserMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <Settings className="w-6 h-6 mr-3" />
              Profile Settings
            </CardTitle>
            <CardDescription className="text-blue-100">
              Keep your information up to date for the best experience
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <ProfileClient user={session.user} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 