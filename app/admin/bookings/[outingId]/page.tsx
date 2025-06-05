import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClientUserMenu } from '@/components/client-user-menu'
import { BookingEditModal } from '@/components/booking-edit-modal'
import { AdminBookingClient } from '@/components/admin-booking-client'
import { BookingDeleteButton } from '@/components/booking-delete-button'
import { ArrowLeft, Edit, Trash2, Users, CalendarDays, Utensils } from 'lucide-react'
import Link from 'next/link'
import { formatDateUK } from '@/lib/utils'
import OrientationIndicator from '@/components/orientation-indicator'

export default async function AdminBookingsPage({ params }: { params: { outingId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin')
  }

  // Fetch outing with all bookings
  const outing = await prisma.outing.findUnique({
    where: { id: params.outingId },
    include: {
      bookings: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      },
      menu: true
    }
  })

  if (!outing) {
    redirect('/admin/dashboard')
  }

  // Calculate total people
  const totalPeople = outing.bookings.reduce((total: number, booking: any) => {
    const guests = JSON.parse(booking.guests || '[]')
    return total + 1 + guests.length
  }, 0)

  const availableSpaces = outing.capacity - totalPeople

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Orientation Prompt for Mobile */}
      <OrientationIndicator />
      
      {/* Enhanced Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white">Manage Bookings</h1>
                <p className="text-green-100 text-sm sm:text-base truncate max-w-xs sm:max-w-none">{outing.name}</p>
              </div>
            </div>
            <ClientUserMenu variant="header" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Outing Summary - Mobile Optimized */}
        <Card className="mb-6 sm:mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Outing Details
              </CardTitle>
              <AdminBookingClient outing={{
                id: outing.id,
                name: outing.name,
                description: outing.description || '',
                date: outing.date.toISOString(),
                time: outing.time || '',
                venue: outing.venue || '',
                capacity: outing.capacity,
                memberPrice: outing.memberPrice,
                guestPrice: outing.guestPrice,
                registrationDeadline: outing.registrationDeadline.toISOString()
              }} bookingCount={outing.bookings.length} />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                <span className="font-semibold text-green-800 text-sm">Date:</span>
                <div className="text-base sm:text-lg font-bold text-gray-900">{formatDateUK(outing.date)}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                <span className="font-semibold text-blue-800 text-sm">Venue:</span>
                <div className="text-base sm:text-lg font-bold text-gray-900 truncate">{outing.venue}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                <span className="font-semibold text-purple-800 text-sm">Capacity:</span>
                <div className="text-base sm:text-lg font-bold text-gray-900">{totalPeople}/{outing.capacity} players</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 sm:p-4">
                <span className="font-semibold text-yellow-800 text-sm">Available:</span>
                <div className={`text-base sm:text-lg font-bold ${availableSpaces > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {availableSpaces} spaces
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal Summary for Catering - Mobile Optimized */}
        {outing.bookings.length > 0 && (
          <Card className="mb-6 sm:mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg p-4 sm:p-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Utensils className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Meal Summary for Golf Club Catering</span>
                <span className="sm:hidden">Meal Summary</span>
              </CardTitle>
              <CardDescription className="text-orange-100 text-sm">
                <span className="hidden sm:inline">Complete breakdown of all meal choices for kitchen preparation</span>
                <span className="sm:hidden">Meal breakdown for kitchen</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {(() => {
                // Calculate meal totals
                const mealTotals = {
                  mainCourse: {} as Record<string, number>,
                  dessert: {} as Record<string, number>
                }

                // Count member meals
                outing.bookings.forEach((booking: any) => {
                  const memberMeals = JSON.parse(booking.memberMeals || '{}')
                  if (memberMeals.mainCourse) {
                    mealTotals.mainCourse[memberMeals.mainCourse] = (mealTotals.mainCourse[memberMeals.mainCourse] || 0) + 1
                  }
                  if (memberMeals.dessert) {
                    mealTotals.dessert[memberMeals.dessert] = (mealTotals.dessert[memberMeals.dessert] || 0) + 1
                  }

                  // Count guest meals
                  const guestMeals = JSON.parse(booking.guestMeals || '[]')
                  guestMeals.forEach((guestMeal: any) => {
                    if (guestMeal.mainCourse) {
                      mealTotals.mainCourse[guestMeal.mainCourse] = (mealTotals.mainCourse[guestMeal.mainCourse] || 0) + 1
                    }
                    if (guestMeal.dessert) {
                      mealTotals.dessert[guestMeal.dessert] = (mealTotals.dessert[guestMeal.dessert] || 0) + 1
                    }
                  })
                })

                const totalMainCourses = Object.values(mealTotals.mainCourse).reduce((sum: number, count: number) => sum + count, 0)
                const totalDesserts = Object.values(mealTotals.dessert).reduce((sum: number, count: number) => sum + count, 0)

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Main Course Summary */}
                    <div className="bg-green-50 rounded-xl p-4 sm:p-6 border border-green-200">
                      <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-3 sm:mb-4 flex items-center">
                        <Utensils className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="hidden sm:inline">Main Course Orders ({totalMainCourses} total)</span>
                        <span className="sm:hidden">Main ({totalMainCourses})</span>
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {Object.entries(mealTotals.mainCourse)
                          .sort(([,a], [,b]) => (b as number) - (a as number))
                          .map(([dish, count]) => (
                          <div key={dish} className="bg-white rounded-lg p-3 sm:p-4 border border-green-200">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                              <span className="font-medium text-gray-900 text-sm sm:text-base">{dish}</span>
                              <div className="flex items-center space-x-2">
                                <span className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                                  {count}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500">
                                  ({Math.round((count as number / totalMainCourses) * 100)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {Object.keys(mealTotals.mainCourse).length === 0 && (
                          <p className="text-green-700 italic text-sm">No main course selections yet</p>
                        )}
                      </div>
                    </div>

                    {/* Dessert Summary */}
                    <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                      <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4 flex items-center">
                        <Utensils className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="hidden sm:inline">Dessert Orders ({totalDesserts} total)</span>
                        <span className="sm:hidden">Dessert ({totalDesserts})</span>
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        {Object.entries(mealTotals.dessert)
                          .sort(([,a], [,b]) => (b as number) - (a as number))
                          .map(([dish, count]) => (
                          <div key={dish} className="bg-white rounded-lg p-3 sm:p-4 border border-blue-200">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                              <span className="font-medium text-gray-900 text-sm sm:text-base">{dish}</span>
                              <div className="flex items-center space-x-2">
                                <span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                                  {count}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500">
                                  ({Math.round((count as number / totalDesserts) * 100)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {Object.keys(mealTotals.dessert).length === 0 && (
                          <p className="text-blue-700 italic text-sm">No dessert selections yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Special Dietary Requirements Summary */}
              {(() => {
                const specialRequests = outing.bookings
                  .map((booking: any) => JSON.parse(booking.memberMeals || '{}').specialRequests)
                  .filter(Boolean)

                if (specialRequests.length > 0) {
                  return (
                    <div className="mt-6 sm:mt-8 bg-yellow-50 rounded-xl p-4 sm:p-6 border border-yellow-200">
                      <h3 className="text-lg sm:text-xl font-bold text-yellow-900 mb-3 sm:mb-4">Special Dietary Requirements</h3>
                      <div className="space-y-2 sm:space-y-3">
                        {specialRequests.map((request: string, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-3 border border-yellow-200">
                            <p className="text-gray-900 text-sm sm:text-base">{request}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              })()}
            </CardContent>
          </Card>
        )}

        {/* Bookings List - Mobile Optimized */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 sm:p-6">
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Bookings ({outing.bookings.length})
            </CardTitle>
            <CardDescription className="text-blue-100 text-sm">
              <span className="hidden sm:inline">Manage member bookings, guest details, and meal choices</span>
              <span className="sm:hidden">Manage bookings and details</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {outing.bookings.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Bookings will appear here once members start registering.
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {outing.bookings.map((booking: any) => {
                  const guests = JSON.parse(booking.guests || '[]')
                  const memberMeals = JSON.parse(booking.memberMeals || '{}')
                  const guestMeals = JSON.parse(booking.guestMeals || '[]')
                  
                  return (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200 bg-white">
                      {/* Mobile-First Layout */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        {/* Member Info */}
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs sm:text-sm">
                              {booking.user.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{booking.user.name}</h3>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span>#{booking.user.memberNumber}</span>
                                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                  H: {booking.memberHandicap}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-600 mt-1">
                              <span>Guests: {guests.length}</span>
                              <span>•</span>
                              <span>Booked: {formatDateUK(booking.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                          {/* Status Badges */}
                          <div className="flex space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.paymentStatus}
                            </span>
                          </div>

                          {/* Cost */}
                          <div className="text-right">
                            <div className="text-base sm:text-lg font-bold text-green-600">
                              £{booking.totalCost.toFixed(2)}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-1 sm:space-x-2">
                            <BookingEditModal booking={booking} outing={outing} />
                            <BookingDeleteButton 
                              bookingId={booking.id}
                              memberName={booking.user.name}
                              outingName={outing.name}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expandable Details - Mobile Optimized */}
                      {(guests.length > 0 || memberMeals.mainCourse || memberMeals.dessert) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm">
                            {/* Member Meals */}
                            {(memberMeals.mainCourse || memberMeals.dessert) && (
                              <div className="bg-green-50 p-3 rounded-lg">
                                <div className="font-medium text-green-800 mb-2 flex items-center text-sm">
                                  <Utensils className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  Member Meals
                                </div>
                                <div className="space-y-1 text-xs sm:text-sm">
                                  {memberMeals.mainCourse && (
                                    <div><span className="font-medium">Main:</span> {memberMeals.mainCourse}</div>
                                  )}
                                  {memberMeals.dessert && (
                                    <div><span className="font-medium">Dessert:</span> {memberMeals.dessert}</div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Guest Details */}
                            {guests.length > 0 && (
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="font-medium text-blue-800 mb-2 flex items-center text-sm">
                                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  Guests ({guests.length})
                                </div>
                                <div className="space-y-2">
                                  {guests.map((guest: any, index: number) => {
                                    const guestMeal = guestMeals[index] || {}
                                    return (
                                      <div key={index} className="text-xs sm:text-sm bg-white rounded p-2">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 space-y-1 sm:space-y-0">
                                          <span className="font-medium">{guest.name}</span>
                                          <span className="text-gray-500">H: {guest.handicap}</span>
                                        </div>
                                        {(guestMeal.mainCourse || guestMeal.dessert) && (
                                          <div className="text-gray-600 space-y-0.5 text-xs">
                                            {guestMeal.mainCourse && (
                                              <div>Main: {guestMeal.mainCourse}</div>
                                            )}
                                            {guestMeal.dessert && (
                                              <div>Dessert: {guestMeal.dessert}</div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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