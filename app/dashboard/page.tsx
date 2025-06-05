import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClientUserMenu } from '@/components/client-user-menu'
import { CalendarDays, Users, Clock, MapPin, Trophy, Star, TrendingUp } from 'lucide-react'
import OrientationIndicator from '@/components/orientation-indicator'

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
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              {/* Logo Section */}
              <div className="flex-shrink-0">
                <Image
                  src="/image-640x886.png"
                  alt="Irish Golf Society Scotland Logo"
                  width={60}
                  height={83}
                  className="rounded-lg shadow-md bg-white p-1"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
                  Member Dashboard
                </h1>
                <p className="text-green-100 text-lg">Welcome back, {session.user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right text-xs text-green-100 bg-green-900/30 rounded-lg p-2 backdrop-blur-sm">
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-400" />
                  Member #{session.user.memberNumber} • HC: {session.user.handicap}
                </div>
              </div>
              <ClientUserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Irish Golf Society Scotland</h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Experience premium golf outings across Scotland's most prestigious courses. 
            Book your next adventure and connect with fellow golf enthusiasts.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile-Optimized Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-2 sm:p-3 lg:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-1.5 sm:p-2 lg:p-3 bg-green-600 rounded-full mb-1 sm:mb-2">
                  <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-600 leading-tight">Available</p>
                  <p className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-900">{outings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-2 sm:p-3 lg:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-1.5 sm:p-2 lg:p-3 bg-blue-600 rounded-full mb-1 sm:mb-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-600 leading-tight">Bookings</p>
                  <p className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-900">{userBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-2 sm:p-3 lg:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-1.5 sm:p-2 lg:p-3 bg-yellow-600 rounded-full mb-1 sm:mb-2">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-yellow-600 leading-tight">Handicap</p>
                  <p className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-900">{session.user.handicap}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Outings */}
        <Card className="mb-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <CalendarDays className="w-6 h-6 mr-3" />
              Premium Golf Outings
            </CardTitle>
            <CardDescription className="text-green-100">
              Discover and book your spot for upcoming exclusive golf experiences
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
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
                  <div key={outing.id} className="bg-gradient-to-r from-white to-green-50 border-2 border-green-100 rounded-xl p-8 hover:shadow-2xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                          <Trophy className="w-6 h-6 mr-3 text-green-600" />
                          {outing.name}
                        </h3>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{outing.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-700">
                          <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                            <CalendarDays className="w-5 h-5 mr-3 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                              <p className="font-semibold">{new Date(outing.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                            <Clock className="w-5 h-5 mr-3 text-blue-600" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                              <p className="font-semibold">{outing.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                            <MapPin className="w-5 h-5 mr-3 text-red-600" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Venue</p>
                              <p className="font-semibold">{outing.venue}</p>
                            </div>
                          </div>
                          <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                            <Users className="w-5 h-5 mr-3 text-purple-600" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Players</p>
                              <p className="font-semibold">{totalPeople}/{outing.capacity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-8">
                        <div className="bg-green-600 text-white rounded-xl p-6 shadow-lg">
                          <p className="text-sm text-green-100 mb-1">Member Price</p>
                          <div className="text-3xl font-bold mb-4">
                            {outing.memberPrice === 0 ? 'TBC' : `£${outing.memberPrice}`}
                          </div>
                          <Link href={`/book/${outing.id}`}>
                            <Button 
                              className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                              disabled={outing.memberPrice === 0}
                            >
                              {outing.memberPrice === 0 ? 'Coming Soon' : 'Book Now'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-600 font-medium">Booking Progress</span>
                        <span className="text-green-600 font-semibold">{availableSpaces} spaces remaining</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-sm" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Enhanced Deadline Warning */}
                    {daysUntilDeadline <= 7 && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-4 shadow-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Clock className="h-6 w-6 text-yellow-500" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-yellow-800 font-medium">
                              <strong>⚠️ Registration closes in {daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''}!</strong>
                            </p>
                            <p className="text-xs text-yellow-700 mt-1">Don't miss out on this exclusive golf experience.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced My Bookings */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <Users className="w-6 h-6 mr-3" />
              My Golf Bookings
            </CardTitle>
            <CardDescription className="text-blue-100">
              Your booking history and upcoming golf adventures
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {userBookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start your golf journey with us! Book your first premium outing to experience Scotland's finest courses.
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-lg">
                  Browse Available Outings
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {userBookings.map((booking: any) => (
                  <div key={booking.id} className="bg-gradient-to-r from-white to-blue-50 border-2 border-blue-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                          <Trophy className="w-5 h-5 mr-2 text-blue-600" />
                          {booking.outing.name}
                        </h4>
                        <div className="space-y-2 text-gray-600">
                          <p className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-red-500" />
                            {booking.outing.venue}
                          </p>
                          <p className="flex items-center">
                            <CalendarDays className="w-4 h-4 mr-2 text-green-500" />
                            {new Date(booking.outing.date).toLocaleDateString()} at {booking.outing.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right bg-blue-600 text-white rounded-lg p-4 shadow-md">
                        <div className="text-2xl font-bold mb-1">£{booking.totalCost.toFixed(2)}</div>
                        {booking.guestCount > 0 && (
                          <div className="text-sm text-blue-100">
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