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
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Manage Bookings</h1>
                <p className="text-green-100">{outing.name}</p>
              </div>
            </div>
            <ClientUserMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Outing Summary */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-2" />
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
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <span className="font-semibold text-green-800">Date:</span>
                <div className="text-lg font-bold text-gray-900">{formatDateUK(outing.date)}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <span className="font-semibold text-blue-800">Venue:</span>
                <div className="text-lg font-bold text-gray-900">{outing.venue}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <span className="font-semibold text-purple-800">Capacity:</span>
                <div className="text-lg font-bold text-gray-900">{totalPeople}/{outing.capacity} players</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <span className="font-semibold text-yellow-800">Available:</span>
                <div className={`text-lg font-bold ${availableSpaces > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {availableSpaces} spaces
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meal Summary for Catering */}
        {outing.bookings.length > 0 && (
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Utensils className="w-5 h-5 mr-2" />
                Meal Summary for Golf Club Catering
              </CardTitle>
              <CardDescription className="text-orange-100">
                Complete breakdown of all meal choices for kitchen preparation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main Course Summary */}
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                        <Utensils className="w-5 h-5 mr-2" />
                        Main Course Orders ({totalMainCourses} total)
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(mealTotals.mainCourse)
                          .sort(([,a], [,b]) => (b as number) - (a as number))
                          .map(([dish, count]) => (
                          <div key={dish} className="bg-white rounded-lg p-4 border border-green-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">{dish}</span>
                              <div className="flex items-center space-x-2">
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                  {count}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({Math.round((count as number / totalMainCourses) * 100)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {Object.keys(mealTotals.mainCourse).length === 0 && (
                          <p className="text-green-700 italic">No main course selections yet</p>
                        )}
                      </div>
                    </div>

                    {/* Dessert Summary */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                        <Utensils className="w-5 h-5 mr-2" />
                        Dessert Orders ({totalDesserts} total)
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(mealTotals.dessert)
                          .sort(([,a], [,b]) => (b as number) - (a as number))
                          .map(([dish, count]) => (
                          <div key={dish} className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">{dish}</span>
                              <div className="flex items-center space-x-2">
                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                  {count}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({Math.round((count as number / totalDesserts) * 100)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {Object.keys(mealTotals.dessert).length === 0 && (
                          <p className="text-blue-700 italic">No dessert selections yet</p>
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
                    <div className="mt-8 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                      <h3 className="text-xl font-bold text-yellow-900 mb-4">Special Dietary Requirements</h3>
                      <div className="space-y-3">
                        {specialRequests.map((request: string, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-3 border border-yellow-200">
                            <p className="text-gray-900">{request}</p>
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

        {/* Bookings List */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Bookings ({outing.bookings.length})
            </CardTitle>
            <CardDescription className="text-blue-100">
              Manage member bookings, guest details, and meal choices
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {outing.bookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600">
                  Bookings will appear here once members start registering.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {outing.bookings.map((booking: any) => {
                  const guests = JSON.parse(booking.guests || '[]')
                  const memberMeals = JSON.parse(booking.memberMeals || '{}')
                  const guestMeals = JSON.parse(booking.guestMeals || '[]')
                  
                  return (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white">
                      <div className="flex items-center justify-between">
                        {/* Member Info - Left Side */}
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {booking.user.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-900">{booking.user.name}</h3>
                              <span className="text-xs text-gray-500">#{booking.user.memberNumber}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                H: {booking.memberHandicap}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>Guests: {guests.length}</span>
                              <span>•</span>
                              <span>Booked: {formatDateUK(booking.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status & Actions - Right Side */}
                        <div className="flex items-center space-x-4">
                          {/* Status Badges */}
                          <div className="flex flex-col space-y-1">
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
                            <div className="text-lg font-bold text-green-600">
                              £{booking.totalCost.toFixed(2)}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <BookingEditModal booking={booking} outing={outing} />
                            <BookingDeleteButton 
                              bookingId={booking.id}
                              memberName={booking.user.name}
                              outingName={outing.name}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expandable Details - Only show if there are guests or meals */}
                      {(guests.length > 0 || memberMeals.mainCourse || memberMeals.dessert) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {/* Member Meals */}
                            {(memberMeals.mainCourse || memberMeals.dessert) && (
                              <div className="bg-green-50 p-3 rounded-lg">
                                <div className="font-medium text-green-800 mb-2 flex items-center">
                                  <Utensils className="w-4 h-4 mr-1" />
                                  Member Meals
                                </div>
                                <div className="space-y-1 text-xs">
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
                                <div className="font-medium text-blue-800 mb-2 flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  Guests ({guests.length})
                                </div>
                                <div className="space-y-1">
                                  {guests.map((guest: any, index: number) => {
                                    const guestMeal = guestMeals[index] || {}
                                    return (
                                      <div key={index} className="text-xs bg-white rounded p-2">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="font-medium">{guest.name}</span>
                                          <span className="text-gray-500">H: {guest.handicap}</span>
                                        </div>
                                        {(guestMeal.mainCourse || guestMeal.dessert) && (
                                          <div className="text-gray-600 space-y-0.5">
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