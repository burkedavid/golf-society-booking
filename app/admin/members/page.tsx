import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClientUserMenu } from '@/components/client-user-menu'
import { MemberEditModal } from '@/components/member-edit-modal'
import { PasswordResetButton } from '@/components/password-reset-button'
import { ArrowLeft, Edit, RotateCcw, Users, Mail, Phone, Trophy, UserPlus, CalendarDays, Star, PoundSterling, UserCog } from 'lucide-react'
import { formatDateUK } from '@/lib/utils'

interface Member {
  id: string
  name: string
  email: string
  phone: string | undefined
  memberNumber: string
  handicap: number
  createdAt: Date
  _count: {
    bookings: number
  }
  bookings: {
    totalCost: number
    createdAt: Date
  }[]
}

export default async function MembersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin')
  }

  // Fetch all members with their booking statistics
  const rawMembers = await prisma.user.findMany({
    where: {
      role: 'member'
    },
    include: {
      _count: {
        select: {
          bookings: true
        }
      },
      bookings: {
        select: {
          totalCost: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  // Transform the data to match our Member interface
  const members: Member[] = rawMembers.map((member: any) => ({
    ...member,
    phone: member.phone || undefined
  }))

  // Calculate member statistics
  const totalMembers = members.length
  const averageHandicap = totalMembers > 0 
    ? members.reduce((sum: number, member: Member) => sum + member.handicap, 0) / totalMembers 
    : 0
  const totalBookings = members.reduce((sum: number, member: Member) => sum + member._count.bookings, 0)
  const totalRevenue = members.reduce((sum: number, member: Member) => 
    sum + member.bookings.reduce((memberSum: number, booking) => memberSum + booking.totalCost, 0), 0
  )

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
                <h1 className="text-3xl font-bold text-white">Member Management</h1>
                <p className="text-green-100">Manage member profiles, handicaps, and account settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Member
              </Button>
              <ClientUserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-gray-900">{totalMembers}</div>
              <p className="text-sm text-gray-600">Active members</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="text-sm font-medium flex items-center">
                <Trophy className="w-4 h-4 mr-2" />
                Average Handicap
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-gray-900">{averageHandicap.toFixed(1)}</div>
              <p className="text-sm text-gray-600">Club average</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-gray-900">{totalBookings}</div>
              <p className="text-sm text-gray-600">All time bookings</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="text-sm font-medium flex items-center">
                <Trophy className="w-4 h-4 mr-2" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-gray-900">£{totalRevenue.toFixed(2)}</div>
              <p className="text-sm text-gray-600">From member bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Members List */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-2xl">
              <Users className="w-6 h-6 mr-3" />
              All Members ({totalMembers})
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Manage member profiles, handicaps, contact information, and account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {members.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No members found</h3>
                <p className="text-gray-600">
                  Start by adding your first member to the system.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member: Member) => {
                  const memberRevenue = member.bookings.reduce((sum: number, booking) => sum + booking.totalCost, 0)
                  const lastBooking = member.bookings.length > 0 
                    ? new Date(Math.max(...member.bookings.map((b) => new Date(b.createdAt).getTime())))
                    : null

                  return (
                    <div key={member.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {member.name.split(' ').map((n: string) => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                              <p className="text-gray-600 font-medium">Member #{member.memberNumber}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Contact Information */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                Contact Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center">
                                  <Mail className="w-3 h-3 mr-2 text-blue-600" />
                                  <span className="break-all">{member.email}</span>
                                </div>
                                {member.phone && (
                                  <div className="flex items-center">
                                    <Phone className="w-3 h-3 mr-2 text-blue-600" />
                                    <span>{member.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Golf Information */}
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                                <Trophy className="w-4 h-4 mr-2" />
                                Golf Profile
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">Handicap:</span>
                                  <span className="font-bold text-green-700">{member.handicap}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Member Since:</span>
                                  <span>{formatDateUK(member.createdAt)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Booking Statistics */}
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                              <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                Booking Stats
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">Total Bookings:</span>
                                  <span className="font-bold text-purple-700">{member._count.bookings}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">Total Spent:</span>
                                  <span className="font-bold text-purple-700">£{memberRevenue.toFixed(2)}</span>
                                </div>
                                {lastBooking && (
                                  <div className="flex justify-between">
                                    <span className="font-medium">Last Booking:</span>
                                    <span>{formatDateUK(lastBooking)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2 ml-6">
                          <MemberEditModal member={member} />
                          <PasswordResetButton memberId={member.id} memberName={member.name} />
                        </div>
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