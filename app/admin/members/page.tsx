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
import { AddMemberModal } from '@/components/add-member-modal'
import { AdminMembersClient } from '@/components/admin-members-client'
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
              <AddMemberModal />
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
        <AdminMembersClient members={members} totalMembers={totalMembers} />
      </div>
    </div>
  )
} 