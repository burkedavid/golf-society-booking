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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <OrientationIndicator />
      
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center">
                  <User className="w-5 h-5 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-green-200" />
                  <span className="hidden sm:inline">My Profile</span>
                  <span className="sm:hidden">Profile</span>
                </h1>
                <p className="text-green-100 text-sm sm:text-base">Update your personal information</p>
              </div>
            </div>
            <ClientUserMenu variant="header" />
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-2xl flex items-center">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Profile Settings
            </CardTitle>
            <CardDescription className="text-green-100 text-sm sm:text-base">
              Keep your information up to date for the best experience
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <ProfileClient user={session.user} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 