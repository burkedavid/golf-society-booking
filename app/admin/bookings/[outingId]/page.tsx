import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClientUserMenu } from '@/components/client-user-menu'
import { BookingEditModal } from '@/components/booking-edit-modal'
import { ArrowLeft, Edit, Trash2, Users, CalendarDays, Utensils } from 'lucide-react'
import Link from 'next/link'

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
            <CardTitle className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-2" />
              Outing Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <span className="font-semibold text-green-800">Date:</span>
                <div className="text-lg font-bold text-gray-900">{new Date(outing.date).toLocaleDateString()}</div>
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
          <CardContent className="p-8">
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
              <div className="space-y-8">
                {outing.bookings.map((booking: any) => {
                  const guests = JSON.parse(booking.guests || '[]')
                  const memberMeals = JSON.parse(booking.memberMeals || '{}')
                  const guestMeals = JSON.parse(booking.guestMeals || '[]')
                  
                  return (
                    <div key={booking.id} className="bg-gradient-to-r from-white to-blue-50 border-2 border-blue-100 rounded-xl p-8 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{booking.user.name}</h3>
                          <p className="text-gray-600">
                            {booking.user.email} • Member #{booking.user.memberNumber}
                          </p>
                          <p className="text-gray-500">
                            Booked: {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-green-600">
                            £{booking.totalCost.toFixed(2)}
                          </span>
                          <BookingEditModal booking={booking} outing={outing} />
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Member Details */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                          <h4 className="font-bold text-lg text-green-900 mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Member Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium">Handicap:</span>
                              <span className="font-bold">{booking.memberHandicap}</span>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <Utensils className="w-4 h-4 mr-2 text-green-600" />
                                <span className="font-semibold text-green-800">Meal Choices</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div><span className="font-medium">Main Course:</span> {memberMeals.mainCourse || 'Not selected'}</div>
                                <div><span className="font-medium">Dessert:</span> {memberMeals.dessert || 'Not selected'}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                          <h4 className="font-bold text-lg text-blue-900 mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Guests ({guests.length})
                          </h4>
                          {guests.length === 0 ? (
                            <p className="text-blue-700 italic">No guests</p>
                          ) : (
                            <div className="space-y-4">
                              {guests.map((guest: any, index: number) => {
                                const guestMeal = guestMeals[index] || {}
                                return (
                                  <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                                    <div className="font-semibold text-blue-900 mb-2">{guest.name}</div>
                                    <div className="text-sm space-y-1 mb-3">
                                      <div><span className="font-medium">Handicap:</span> {guest.handicap}</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-2">
                                      <div className="flex items-center mb-1">
                                        <Utensils className="w-3 h-3 mr-1 text-blue-600" />
                                        <span className="font-medium text-blue-800 text-xs">Meal Choices</span>
                                      </div>
                                      <div className="text-xs space-y-1">
                                        <div><span className="font-medium">Main:</span> {guestMeal.mainCourse || 'Not selected'}</div>
                                        <div><span className="font-medium">Dessert:</span> {guestMeal.dessert || 'Not selected'}</div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status and Special Requests */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                          <h4 className="font-bold text-lg text-gray-900 mb-4">Status</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Booking:</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Payment:</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {booking.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Special Requests */}
                        {memberMeals.specialRequests && (
                          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                            <h4 className="font-bold text-lg text-yellow-900 mb-3">Special Requests</h4>
                            <p className="text-yellow-800 bg-white rounded-lg p-3 border border-yellow-200">
                              {memberMeals.specialRequests}
                            </p>
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