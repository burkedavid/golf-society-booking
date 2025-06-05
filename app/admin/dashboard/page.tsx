import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClientUserMenu } from '@/components/client-user-menu'
import { CalendarDays, Users, PoundSterling, UserCog, Trophy, Star, TrendingUp, Settings, Plus } from 'lucide-react'
import { UserMenu } from '@/components/user-menu'
import { formatDateUK } from '@/lib/utils'
import OrientationIndicator from '@/components/orientation-indicator'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin')
  }

  // Fetch dashboard data
  const outings = await prisma.outing.findMany({
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

  const totalMembers = await prisma.user.count({
    where: {
      role: 'member'
    }
  })

  const totalBookings = await prisma.booking.count()

  const totalRevenue = await prisma.booking.aggregate({
    _sum: {
      totalCost: true
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
                  <Settings className="w-5 h-5 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-yellow-400" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                  <span className="sm:hidden">Admin</span>
                </h1>
                <p className="text-green-100 text-sm sm:text-lg hidden sm:block">Irish Golf Society Scotland - Management Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="text-right text-xs text-green-100 bg-green-900/30 rounded-lg p-1 sm:p-2 backdrop-blur-sm">
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-400" />
                  <span className="hidden sm:inline">Admin #{session.user.memberNumber}</span>
                  <span className="sm:hidden">#{session.user.memberNumber}</span>
                </div>
              </div>
              <Link href="/admin/members" className="hidden sm:block">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <UserCog className="w-4 h-4 mr-2" />
                  Members
                </Button>
              </Link>
              <Link href="/admin/outings/create" className="hidden sm:block">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Outing
                </Button>
              </Link>
              <ClientUserMenu variant="header" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Only show on small screens */}
      <div className="sm:hidden bg-green-700 border-t border-green-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-4 py-3">
            <Link href="/admin/members">
              <Button variant="ghost" size="sm" className="text-white hover:bg-green-600">
                <UserCog className="w-4 h-4 mr-1" />
                Members
              </Button>
            </Link>
            <Link href="/admin/outings/create">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-1" />
                Create
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-3">Golf Society Management</h2>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Comprehensive administration tools for managing members, outings, and bookings across Scotland's premier golf courses.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Mobile-Optimized Admin Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-3 lg:gap-6 mb-8 sm:mb-8 lg:mb-12">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg p-3 sm:p-3 lg:p-4">
              <CardTitle className="text-sm sm:text-sm font-medium flex items-center justify-center lg:justify-start">
                <CalendarDays className="w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-2" />
                <span className="sm:hidden lg:inline">Total </span>Outings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-4 lg:p-6 text-center lg:text-left">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{outings.length}</div>
              <p className="text-sm sm:text-sm text-gray-600">Active events</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-3 sm:p-3 lg:p-4">
              <CardTitle className="text-sm sm:text-sm font-medium flex items-center justify-center lg:justify-start">
                <Users className="w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-2" />
                <span className="sm:hidden lg:inline">Total </span>Members
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-4 lg:p-6 text-center lg:text-left">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalMembers}</div>
              <p className="text-sm sm:text-sm text-gray-600">Registered</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg p-3 sm:p-3 lg:p-4">
              <CardTitle className="text-sm sm:text-sm font-medium flex items-center justify-center lg:justify-start">
                <Trophy className="w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-2" />
                <span className="sm:hidden lg:inline">Total </span>Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-4 lg:p-6 text-center lg:text-left">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalBookings}</div>
              <p className="text-sm sm:text-sm text-gray-600">All time</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-t-lg p-3 sm:p-3 lg:p-4">
              <CardTitle className="text-sm sm:text-sm font-medium flex items-center justify-center lg:justify-start">
                <PoundSterling className="w-4 h-4 sm:w-4 sm:h-4 mr-2 sm:mr-2" />
                <span className="sm:hidden lg:inline">Total </span>Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-4 lg:p-6 text-center lg:text-left">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">£{totalRevenue._sum.totalCost?.toFixed(2) || '0.00'}</div>
              <p className="text-sm sm:text-sm text-gray-600">All time revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Outings List */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl flex items-center">
              <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Upcoming Outings
            </CardTitle>
            <CardDescription className="text-indigo-100 text-sm sm:text-base">
              Manage your golf outings and view detailed booking information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <div className="space-y-4 sm:space-y-6">
              {outings.map((outing: any) => {
                // Calculate total people (members + guests) not just bookings
                const totalPeople = outing.bookings.reduce((total: number, booking: any) => {
                  const guests = JSON.parse(booking.guests || '[]')
                  return total + 1 + guests.length // 1 member + number of guests
                }, 0)
                const availableSpaces = outing.capacity - totalPeople
                const progressPercentage = (totalPeople / outing.capacity) * 100

                return (
                  <div key={outing.id} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-100 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0 mb-4 sm:mb-6">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 flex items-center">
                          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                          {outing.name}
                        </h3>
                        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{outing.description}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-sm">
                          <div className="flex items-center bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                            <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Date</p>
                              <p className="font-semibold text-xs sm:text-sm">{formatDateUK(outing.date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-600">🕐</div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Time</p>
                              <p className="font-semibold text-xs sm:text-sm">{outing.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center bg-white rounded-lg p-2 sm:p-3 shadow-sm col-span-2 sm:col-span-2 md:col-span-1">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-red-600">📍</div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Venue</p>
                              <p className="font-semibold text-xs sm:text-sm truncate">{outing.venue}</p>
                            </div>
                          </div>
                          <div className="flex items-center bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-600" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Capacity</p>
                              <p className="font-semibold text-xs sm:text-sm">{totalPeople}/{outing.capacity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-3 lg:text-right lg:ml-6 lg:flex-shrink-0">
                        <div className="bg-green-600 text-white rounded-lg p-3 sm:p-4 shadow-md">
                          <div className="text-center">
                            {outing.memberPrice === 0 && outing.guestPrice === 0 ? (
                              <div className="text-base sm:text-lg font-bold text-green-100">
                                TBC
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="text-sm font-bold">
                                  £{outing.memberPrice} <span className="text-xs font-normal text-green-200">member</span>
                                </div>
                                <div className="text-sm font-bold">
                                  £{outing.guestPrice} <span className="text-xs font-normal text-green-200">guest</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          <Link href={`/admin/bookings/${outing.id}`} className="text-white">
                            Manage
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">Booking Progress</span>
                        <span className="text-green-600 font-semibold">{availableSpaces} spaces remaining</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Enhanced Booking Summary */}
                    <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{totalPeople}</div>
                        <div className="text-gray-600">Total Players</div>
                        <div className="text-xs text-gray-500">({outing.bookings.length} bookings)</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">£{outing.bookings.reduce((sum: number, booking: any) => sum + booking.totalCost, 0).toFixed(2)}</div>
                        <div className="text-gray-600">Revenue</div>
                        <div className="text-xs text-gray-500">Current total</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">{formatDateUK(outing.registrationDeadline)}</div>
                        <div className="text-gray-600">Deadline</div>
                        <div className="text-xs text-gray-500">Registration closes</div>
                      </div>
                    </div>

                    {/* Detailed Bookings */}
                    {outing.bookings.length > 0 && (
                      <div className="mt-6 border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Booking Details ({outing.bookings.length})
                        </h4>
                        <div className="space-y-3">
                          {outing.bookings.map((booking: any) => {
                            const guests = JSON.parse(booking.guests || '[]')
                            return (
                              <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <span className="font-semibold text-gray-900">{booking.user.name}</span>
                                    <span className="text-gray-500 ml-2 text-sm">#{booking.user.memberNumber}</span>
                                  </div>
                                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                    £{booking.totalCost.toFixed(2)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Handicap:</span> {booking.memberHandicap}
                                  </div>
                                  <div>
                                    <span className="font-medium">Guests:</span> {guests.length}
                                  </div>
                                </div>
                                {guests.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <span className="font-medium text-sm text-gray-700">Guest Details:</span>
                                    <div className="mt-2 space-y-1">
                                      {guests.map((guest: any, index: number) => (
                                        <div key={index} className="text-sm text-gray-600 flex justify-between bg-gray-50 rounded px-2 py-1">
                                          <span>{guest.name}</span>
                                          <span>Handicap: {guest.handicap}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 