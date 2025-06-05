'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { OutingEditModal } from '@/components/outing-edit-modal'
import { OutingDeleteButton } from '@/components/outing-delete-button'

interface AdminBookingClientProps {
  outing: {
    id: string
    name: string
    description: string
    date: string
    time: string
    venue: string
    capacity: number
    memberPrice: number
    guestPrice: number
    registrationDeadline: string
  }
  bookingCount: number
}

export function AdminBookingClient({ outing, bookingCount }: AdminBookingClientProps) {
  const [showEditModal, setShowEditModal] = useState(false)

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        onClick={() => setShowEditModal(true)}
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Outing
      </Button>

      <OutingDeleteButton 
        outingId={outing.id}
        outingName={outing.name}
        bookingCount={bookingCount}
      />

      <OutingEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        outing={outing}
      />
    </div>
  )
} 