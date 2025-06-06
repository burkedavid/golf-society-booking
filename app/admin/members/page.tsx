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
import OrientationIndicator from '@/components/orientation-indicator'

interface Member {
  id: string
  name: string
  email: string
  phone: string | undefined
  memberNumber: string
  handicap: number
  createdAt: Date
  subscriptionPaid: boolean
  subscriptionYear: number
  subscriptionPaidDate: Date | null
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

  // Fetch all members with their booking statistics and subscription data
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

  const totalMembers = members.length

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
                <h1 className="text-xl sm:text-3xl font-bold text-white">Member Management</h1>
                <p className="text-green-100 text-sm sm:text-base hidden sm:block">Manage member profiles, handicaps, and account settings</p>
                <p className="text-green-100 text-sm sm:hidden">Manage members</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <AddMemberModal />
              <ClientUserMenu variant="header" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Members List - Direct without stats cards */}
        <AdminMembersClient members={members} totalMembers={totalMembers} />
      </div>
    </div>
  )
} 