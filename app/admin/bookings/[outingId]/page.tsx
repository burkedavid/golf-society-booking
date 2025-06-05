import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClientUserMenu } from '@/components/client-user-menu'
import { BookingEditModal } from '@/components/booking-edit-modal'
import { ArrowLeft, Edit, Trash2, Users, CalendarDays } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
                <p className="text-gray-600">{outing.name}</p>
              </div>
            </div>
            <ClientUserMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Outing Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-2" />
              Outing Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Date:</span>
                <div>{new Date(outing.date).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="font-medium">Venue:</span>
                <div>{outing.venue}</div>
              </div>
              <div>
                <span className="font-medium">Capacity:</span>
                <div>{totalPeople}/{outing.capacity} players</div>
              </div>
              <div>
                <span className="font-medium">Available:</span>
                <div className={availableSpaces > 0 ? 'text-green-600' : 'text-red-600'}>
                  {availableSpaces} spaces
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Bookings ({outing.bookings.length})
            </CardTitle>
            <CardDescription>
              Manage member bookings and guest details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {outing.bookings.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Bookings will appear here once members start registering.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {outing.bookings.map((booking: any) => {
                  const guests = JSON.parse(booking.guests || '[]')
                  const memberMeals = JSON.parse(booking.memberMeals || '{}')
                  
                  return (
                    <div key={booking.id} className="border rounded-lg p-6 bg-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{booking.user.name}</h3>
                          <p className="text-sm text-gray-600">
                            {booking.user.email} • Member #{booking.user.memberNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            Booked: {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-green-600">
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded">
                          <h4 className="font-medium text-sm text-blue-900 mb-2">Member</h4>
                          <div className="text-sm space-y-1">
                            <div><span className="font-medium">Handicap:</span> {booking.memberHandicap}</div>
                            <div><span className="font-medium">Lunch:</span> {memberMeals.lunch}</div>
                            <div><span className="font-medium">Dinner:</span> {memberMeals.dinner}</div>
                          </div>
                        </div>

                        <div className="bg-green-50 p-3 rounded">
                          <h4 className="font-medium text-sm text-green-900 mb-2">
                            Guests ({guests.length})
                          </h4>
                          {guests.length === 0 ? (
                            <p className="text-sm text-gray-500">No guests</p>
                          ) : (
                            <div className="text-sm space-y-2">
                              {guests.map((guest: any, index: number) => (
                                <div key={index} className="border-b border-green-200 pb-1 last:border-b-0">
                                  <div className="font-medium">{guest.name}</div>
                                  <div className="text-green-700">Handicap: {guest.handicap}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 p-3 rounded">
                          <h4 className="font-medium text-sm text-gray-900 mb-2">Status</h4>
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="font-medium">Booking:</span>
                              <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Payment:</span>
                              <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {booking.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {memberMeals.specialRequests && (
                        <div className="bg-yellow-50 p-3 rounded">
                          <h4 className="font-medium text-sm text-yellow-900 mb-1">Special Requests</h4>
                          <p className="text-sm text-yellow-800">{memberMeals.specialRequests}</p>
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