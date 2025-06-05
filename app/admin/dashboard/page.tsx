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
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-xl sm:text-2xl flex items-center">
                  <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Upcoming Outings
                </CardTitle>
                <CardDescription className="text-blue-100 text-sm sm:text-base">
                  Manage your golf outings and view detailed booking information
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <div className="bg-blue-500/30 rounded-lg px-3 py-1 text-sm">
                  {outings.length} Active Event{outings.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            {outings.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CalendarDays className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No upcoming outings</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                  Create your first golf outing to start managing bookings and events.
                </p>
                <Link href="/admin/outings/create">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Outing
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {outings.map((outing: any) => {
                  // Calculate total people (members + guests) not just bookings
                  const totalPeople = outing.bookings.reduce((total: number, booking: any) => {
                    const guests = JSON.parse(booking.guests || '[]')
                    return total + 1 + guests.length // 1 member + number of guests
                  }, 0)
                  const availableSpaces = outing.capacity - totalPeople
                  const progressPercentage = (totalPeople / outing.capacity) * 100
                  const totalRevenue = outing.bookings.reduce((sum: number, booking: any) => sum + booking.totalCost, 0)

                  return (
                    <div key={outing.id} className="bg-gradient-to-br from-white via-gray-50 to-green-50/30 border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-300">
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-3 lg:space-y-0">
                          <div className="flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center">
                              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-yellow-300" />
                              {outing.name}
                            </h3>
                            <p className="text-green-100 text-sm sm:text-base leading-relaxed">{outing.description}</p>
                          </div>
                          
                          <div className="flex flex-col space-y-2 lg:ml-6 lg:flex-shrink-0">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                              {outing.memberPrice === 0 && outing.guestPrice === 0 ? (
                                <div className="text-lg font-bold text-white">
                                  Pricing TBC
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="text-sm font-bold text-white">
                                    £{outing.memberPrice} <span className="text-xs font-normal text-green-200">member</span>
                                  </div>
                                  <div className="text-sm font-bold text-white">
                                    £{outing.guestPrice} <span className="text-xs font-normal text-green-200">guest</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <Link href={`/admin/bookings/${outing.id}`}>
                              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                                <Settings className="w-4 h-4 mr-2" />
                                Manage
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 sm:p-6">
                        {/* Event Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                          <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-100">
                            <div className="flex items-center mb-2">
                              <CalendarDays className="w-4 h-4 mr-2 text-blue-600" />
                              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Date</span>
                            </div>
                            <p className="font-bold text-gray-900 text-sm sm:text-base">{formatDateUK(outing.date)}</p>
                            <p className="text-xs text-gray-600">{outing.time}</p>
                          </div>
                          
                          <div className="bg-red-50 rounded-xl p-3 sm:p-4 border border-red-100">
                            <div className="flex items-center mb-2">
                              <div className="w-4 h-4 mr-2 text-red-600">📍</div>
                              <span className="text-xs font-semibold text-red-800 uppercase tracking-wide">Venue</span>
                            </div>
                            <p className="font-bold text-gray-900 text-sm truncate">{outing.venue}</p>
                          </div>
                          
                          <div className="bg-green-50 rounded-xl p-3 sm:p-4 border border-green-100">
                            <div className="flex items-center mb-2">
                              <Users className="w-4 h-4 mr-2 text-green-600" />
                              <span className="text-xs font-semibold text-green-800 uppercase tracking-wide">Capacity</span>
                            </div>
                            <p className="font-bold text-gray-900 text-sm sm:text-base">{totalPeople}/{outing.capacity}</p>
                            <p className="text-xs text-gray-600">{availableSpaces} available</p>
                          </div>
                          
                          <div className="bg-yellow-50 rounded-xl p-3 sm:p-4 border border-yellow-100">
                            <div className="flex items-center mb-2">
                              <PoundSterling className="w-4 h-4 mr-2 text-yellow-600" />
                              <span className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">Revenue</span>
                            </div>
                            <p className="font-bold text-gray-900 text-sm sm:text-base">£{totalRevenue.toFixed(2)}</p>
                            <p className="text-xs text-gray-600">{outing.bookings.length} booking{outing.bookings.length !== 1 ? 's' : ''}</p>
                          </div>
                        </div>

                        {/* Progress Section */}
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-gray-800 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                              Booking Progress
                            </h4>
                            <span className="text-sm font-medium text-green-600">
                              {Math.round(progressPercentage)}% Full
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner mb-3">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-700 shadow-sm" 
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-gray-900">{totalPeople}</div>
                              <div className="text-xs text-gray-600">Total Players</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-600">£{totalRevenue.toFixed(2)}</div>
                              <div className="text-xs text-gray-600">Revenue</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-blue-600">{formatDateUK(outing.registrationDeadline)}</div>
                              <div className="text-xs text-gray-600">Deadline</div>
                            </div>
                          </div>
                        </div>

                        {/* Booking Details - Collapsible */}
                        {outing.bookings.length > 0 && (
                          <div className="mt-6 border-t border-gray-200 pt-6">
                            <details className="group">
                              <summary className="cursor-pointer list-none">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                  <h4 className="font-semibold text-blue-900 flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    View Booking Details ({outing.bookings.length})
                                  </h4>
                                  <div className="text-blue-600 group-open:rotate-180 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </div>
                              </summary>
                              <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                                {outing.bookings.map((booking: any) => {
                                  const guests = JSON.parse(booking.guests || '[]')
                                  return (
                                    <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                      <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                              {booking.user.name.split(' ').map((n: string) => n[0]).join('')}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="font-semibold text-gray-900">{booking.user.name}</span>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                              <span>#{booking.user.memberNumber}</span>
                                              <span>•</span>
                                              <span>HC: {booking.memberHandicap}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                            £{booking.totalCost.toFixed(2)}
                                          </span>
                                          <div className="text-xs text-gray-500 mt-1">
                                            {guests.length} guest{guests.length !== 1 ? 's' : ''}
                                          </div>
                                        </div>
                                      </div>
                                      {guests.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                          <div className="text-sm text-gray-700 mb-2 font-medium">Guests:</div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {guests.map((guest: any, index: number) => (
                                              <div key={index} className="text-sm bg-gray-50 rounded px-3 py-2 flex justify-between">
                                                <span className="font-medium">{guest.name}</span>
                                                <span className="text-gray-500">HC: {guest.handicap}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 