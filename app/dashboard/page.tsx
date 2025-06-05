import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClientUserMenu } from '@/components/client-user-menu'
import { CalendarDays, Users, Clock, MapPin, Trophy, Star, TrendingUp, PoundSterling } from 'lucide-react'
import OrientationIndicator from '@/components/orientation-indicator'
import { formatDateUK } from '@/lib/utils'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Fetch available outings
  const outings = await prisma.outing.findMany({
    where: {
      registrationDeadline: {
        gte: new Date()
      }
    },
    include: {
      bookings: {
        include: {
          user: true
        }
      },
      _count: {
        select: {
          bookings: true
        }
      }
    },
    orderBy: {
      date: 'asc'
    }
  })

  // Fetch user's bookings
  const userBookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      outing: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Orientation Prompt for Mobile */}
      <OrientationIndicator />
      
      {/* Header with Golf Theme */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-3 sm:space-x-6">
              {/* Logo Section */}
              <div className="flex-shrink-0">
                <Image
                  src="/image-640x886.png"
                  alt="Irish Golf Society Scotland Logo"
                  width={50}
                  height={69}
                  className="sm:w-[60px] sm:h-[83px] rounded-lg shadow-md bg-white p-1"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center">
                  <Trophy className="w-5 h-5 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-yellow-400" />
                  <span className="hidden sm:inline">Member Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </h1>
                <p className="text-white text-sm sm:text-lg">Welcome back, {session.user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="text-right text-xs text-green-100 bg-green-900/30 rounded-lg p-1 sm:p-2 backdrop-blur-sm">
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-400" />
                  <span className="hidden sm:inline">Member #{session.user.memberNumber} • HC: {session.user.handicap}</span>
                  <span className="sm:hidden">#{session.user.memberNumber}</span>
                </div>
              </div>
              <Link href="/profile" className="hidden sm:block">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Users className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <ClientUserMenu variant="header" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Profile Link - Only show on small screens */}
      <div className="sm:hidden bg-green-700 border-t border-green-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center py-3">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-white hover:bg-green-600">
                <Users className="w-4 h-4 mr-1" />
                Profile • HC: {session.user.handicap}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Irish Golf Society Scotland</h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Join us in celebrating golf and fostering connections among the Irish in Scotland through exciting events and friendly competition.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Mobile-Optimized Stats Cards - Redesigned for Portrait */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 lg:gap-6 mb-8 sm:mb-8 lg:mb-12">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-3 lg:p-6">
              <div className="flex items-center space-x-4 sm:flex-col sm:items-center sm:text-center sm:space-x-0">
                <div className="p-3 sm:p-2 lg:p-3 bg-green-600 rounded-full mb-0 sm:mb-2 flex-shrink-0">
                  <CalendarDays className="w-6 h-6 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="flex-1 sm:flex-none">
                  <p className="text-sm sm:text-xs font-medium text-green-700 leading-tight">Available Outings</p>
                  <p className="text-2xl sm:text-lg lg:text-2xl font-bold text-gray-900">{outings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-3 lg:p-6">
              <div className="flex items-center space-x-4 sm:flex-col sm:items-center sm:text-center sm:space-x-0">
                <div className="p-3 sm:p-2 lg:p-3 bg-emerald-600 rounded-full mb-0 sm:mb-2 flex-shrink-0">
                  <Users className="w-6 h-6 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="flex-1 sm:flex-none">
                  <p className="text-sm sm:text-xs font-medium text-emerald-700 leading-tight">My Bookings</p>
                  <p className="text-2xl sm:text-lg lg:text-2xl font-bold text-gray-900">{userBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 sm:p-3 lg:p-6">
              <div className="flex items-center space-x-4 sm:flex-col sm:items-center sm:text-center sm:space-x-0">
                <div className="p-3 sm:p-2 lg:p-3 bg-yellow-600 rounded-full mb-0 sm:mb-2 flex-shrink-0">
                  <Trophy className="w-6 h-6 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="flex-1 sm:flex-none">
                  <p className="text-sm sm:text-xs font-medium text-yellow-700 leading-tight">Handicap</p>
                  <p className="text-2xl sm:text-lg lg:text-2xl font-bold text-gray-900">{session.user.handicap}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Outings */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl flex items-center">
              <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              {new Date().getFullYear()} Society Golf Outings
            </CardTitle>
            <CardDescription className="text-green-100 text-sm sm:text-base">
              Join us for some fantastic golf and great craic with fellow members!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <div className="space-y-6 sm:space-y-8">
              {outings.map((outing: any) => {
                // Calculate total people (members + guests) not just bookings
                const totalPeople = outing.bookings.reduce((total: number, booking: any) => {
                  const guests = JSON.parse(booking.guests || '[]')
                  return total + 1 + guests.length // 1 member + number of guests
                }, 0)
                const availableSpaces = outing.capacity - totalPeople
                const progressPercentage = (totalPeople / outing.capacity) * 100
                const daysUntilDeadline = Math.ceil((new Date(outing.registrationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

                return (
                  <div key={outing.id} className="bg-gradient-to-r from-white to-green-50 border-2 border-green-100 rounded-xl p-4 sm:p-8 hover:shadow-lg transition-all duration-300">
                    {/* Mobile-First Layout */}
                    <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-start">
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
                          <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-600" />
                          {outing.name}
                        </h3>
                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-lg leading-relaxed">{outing.description}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
                          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center mb-1 sm:mb-2">
                              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                              <span className="font-semibold text-blue-800 text-sm sm:text-base">Date & Time</span>
                            </div>
                            <p className="text-gray-900 font-medium text-sm sm:text-base">{formatDateUK(outing.date)}</p>
                            <p className="text-gray-600 text-sm">{outing.time}</p>
                          </div>
                          
                          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center mb-1 sm:mb-2">
                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                              <span className="font-semibold text-blue-800 text-sm sm:text-base">Venue</span>
                            </div>
                            <p className="text-gray-900 font-medium text-sm sm:text-base">{outing.venue}</p>
                          </div>
                          
                          <div className="bg-yellow-50 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center mb-1 sm:mb-2">
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-600" />
                              <span className="font-semibold text-yellow-800 text-sm sm:text-base">Registration</span>
                            </div>
                            <p className="text-gray-900 font-medium text-sm sm:text-base">
                              {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Deadline passed'}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm">Until {formatDateUK(outing.registrationDeadline)}</p>
                          </div>

                          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center mb-1 sm:mb-2">
                              <PoundSterling className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                              <span className="font-semibold text-green-800 text-sm sm:text-base">Pricing</span>
                            </div>
                            <p className="text-gray-900 font-medium text-sm sm:text-base">£{outing.memberPrice} member</p>
                            <p className="text-gray-600 text-xs sm:text-sm">£{outing.guestPrice} guest</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-right sm:ml-8 flex-shrink-0">
                        <Link href={`/book/${outing.id}`}>
                          <Button 
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-base"
                            disabled={outing.memberPrice === 0}
                          >
                            {outing.memberPrice === 0 ? 'Coming Soon' : 'Book Now'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced My Bookings */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl flex items-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              My Golf Bookings
            </CardTitle>
            <CardDescription className="text-blue-100 text-sm sm:text-base">
              Your booking history and upcoming golf adventures
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            {userBookings.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                  Start your golf journey with us! Book your first society outing to experience Scotland's finest courses.
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded-lg shadow-lg">
                  Browse Available Outings
                </Button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {userBookings.map((booking: any) => (
                  <div key={booking.id} className="bg-gradient-to-r from-white to-blue-50 border-2 border-blue-100 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 flex items-center">
                          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                          {booking.outing.name}
                        </h4>
                        <div className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                          <p className="flex items-center">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-red-500" />
                            {booking.outing.venue}
                          </p>
                          <p className="flex items-center">
                            <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500" />
                            {formatDateUK(booking.outing.date)} at {booking.outing.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-center sm:text-right bg-blue-600 text-white rounded-lg p-3 sm:p-4 shadow-md flex-shrink-0">
                        <div className="text-xl sm:text-2xl font-bold mb-1">£{booking.totalCost.toFixed(2)}</div>
                        {booking.guestCount > 0 && (
                          <div className="text-xs sm:text-sm text-blue-100">
                            +{booking.guestCount} guest{booking.guestCount !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 