'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MemberEditModal } from '@/components/member-edit-modal'
import { PasswordResetButton } from '@/components/password-reset-button'
import { Users, Mail, Phone, Trophy, Search, X } from 'lucide-react'
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

interface AdminMembersClientProps {
  members: Member[]
  totalMembers: number
}

export function AdminMembersClient({ members, totalMembers }: AdminMembersClientProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter members based on search term
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members

    const searchLower = searchTerm.toLowerCase().trim()
    
    return members.filter((member) => {
      return (
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.memberNumber.toLowerCase().includes(searchLower) ||
        member.handicap.toString().includes(searchLower) ||
        (member.phone && member.phone.toLowerCase().includes(searchLower))
      )
    })
  }, [members, searchTerm])

  const clearSearch = () => {
    setSearchTerm('')
  }

  return (
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
        {/* Search Filter */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search members by name, email, member number, or handicap..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-3 w-full border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              Showing {filteredMembers.length} of {totalMembers} members
              {filteredMembers.length !== totalMembers && (
                <span className="ml-2 text-indigo-600 font-medium">
                  matching "{searchTerm}"
                </span>
              )}
            </p>
          )}
        </div>

        {filteredMembers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              {searchTerm ? (
                <Search className="h-12 w-12 text-gray-400" />
              ) : (
                <Users className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No members found' : 'No members found'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No members match "${searchTerm}". Try a different search term.`
                : 'Start by adding your first member to the system.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMembers.map((member: Member) => {
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
  )
} 