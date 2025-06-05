import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClientUserMenu } from '@/components/client-user-menu'
import { CalendarDays, Users, PoundSterling, Settings } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Irish Golf Society Scotland</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Link href="/admin/outings/create">
                <Button>
                  Create Outing
                </Button>
              </Link>
              <ClientUserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outings</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outings.length}</div>
              <p className="text-xs text-muted-foreground">
                Active events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                Registered members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                All time bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <PoundSterling className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{totalRevenue._sum.totalCost?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                All time revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Outings List */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Outings</CardTitle>
            <CardDescription>
              Manage your golf outings and view booking details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outings.map((outing: any) => {
                // Calculate total people (members + guests) not just bookings
                const totalPeople = outing.bookings.reduce((total: number, booking: any) => {
                  const guests = JSON.parse(booking.guests || '[]')
                  return total + 1 + guests.length // 1 member + number of guests
                }, 0)
                const availableSpaces = outing.capacity - totalPeople
                const progressPercentage = (totalPeople / outing.capacity) * 100

                return (
                  <div key={outing.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{outing.name}</h3>
                        <p className="text-gray-600">{outing.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>📅 {new Date(outing.date).toLocaleDateString()}</span>
                          <span>🕐 {outing.time}</span>
                          <span>📍 {outing.venue}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          £{outing.memberPrice} / £{outing.guestPrice}
                        </div>
                        <Button size="sm" className="mt-2">
                          Manage
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Capacity</span>
                        <span>{totalPeople}/{outing.capacity} players</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {availableSpaces} spaces remaining
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Attendees:</span>
                        <div>{totalPeople} players ({outing.bookings.length} bookings)</div>
                      </div>
                      <div>
                        <span className="font-medium">Revenue:</span>
                        <div>£{outing.bookings.reduce((sum: number, booking: any) => sum + booking.totalCost, 0).toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="font-medium">Deadline:</span>
                        <div>{new Date(outing.registrationDeadline).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Detailed Bookings */}
                    {outing.bookings.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium text-sm mb-3">Booking Details:</h4>
                        <div className="space-y-3">
                          {outing.bookings.map((booking: any) => {
                            const guests = JSON.parse(booking.guests || '[]')
                            return (
                              <div key={booking.id} className="bg-gray-50 p-3 rounded text-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <span className="font-medium">{booking.user.name}</span>
                                    <span className="text-gray-500 ml-2">#{booking.user.memberNumber}</span>
                                  </div>
                                  <span className="text-green-600 font-medium">£{booking.totalCost.toFixed(2)}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium">Member Handicap:</span> {booking.memberHandicap}
                                  </div>
                                  <div>
                                    <span className="font-medium">Guests:</span> {guests.length}
                                  </div>
                                </div>
                                {guests.length > 0 && (
                                  <div className="mt-2">
                                    <span className="font-medium text-xs">Guest Details:</span>
                                    <div className="mt-1 space-y-1">
                                      {guests.map((guest: any, index: number) => (
                                        <div key={index} className="text-xs text-gray-600 flex justify-between">
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