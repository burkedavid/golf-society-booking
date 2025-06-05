import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, MapPin, Clock, Users, PoundSterling } from 'lucide-react'

export default async function MemberDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'member') {
    redirect('/auth/signin')
  }

  // Fetch available outings
  const availableOutings = await prisma.outing.findMany({
    where: {
      status: 'open',
      registrationDeadline: {
        gte: new Date()
      }
    },
    include: {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.user.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Member #{session.user.memberNumber}</div>
              <div className="text-sm text-gray-500">Handicap: {session.user.handicap}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Available Outings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Available Outings</CardTitle>
            <CardDescription>
              Book your place at upcoming golf outings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {availableOutings.map((outing: any) => {
                const bookedSpaces = outing._count.bookings
                const availableSpaces = outing.capacity - bookedSpaces
                const progressPercentage = (bookedSpaces / outing.capacity) * 100
                const daysUntilDeadline = Math.ceil(
                  (new Date(outing.registrationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )

                return (
                  <div key={outing.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{outing.name}</h3>
                        <p className="text-gray-600 mb-4">{outing.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-500">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            {new Date(outing.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-2" />
                            {outing.time}
                          </div>
                          <div className="flex items-center text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            {outing.venue}
                          </div>
                          <div className="flex items-center text-gray-500">
                            <PoundSterling className="w-4 h-4 mr-2" />
                            £{outing.memberPrice} member
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700">
                          Book Now
                        </Button>
                        <div className="text-xs text-gray-500 mt-2">
                          Guest: £{outing.guestPrice}
                        </div>
                      </div>
                    </div>

                    {/* Capacity and Deadline Info */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Capacity</span>
                        <span className="text-sm text-gray-600">{bookedSpaces}/{outing.capacity} booked</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{availableSpaces} spaces remaining</span>
                        <span>
                          Registration closes in {daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {availableOutings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No outings available for booking at the moment.</p>
                  <p className="text-sm">Check back soon for new events!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking History */}
        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
            <CardDescription>
              View your booking history and payment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userBookings.map((booking: any) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{booking.outing.name}</h4>
                      <p className="text-sm text-gray-600">{booking.outing.venue}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.outing.date).toLocaleDateString()} at {booking.outing.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">£{booking.totalCost.toFixed(2)}</div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        booking.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Booking Status:</span>
                      <span className={`font-medium ${
                        booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Guests:</span>
                      <span>{JSON.parse(booking.guests).length}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {userBookings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>You haven't made any bookings yet.</p>
                  <p className="text-sm">Book your first outing above!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 