'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { OutingEditModal } from '@/components/outing-edit-modal'

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
}

export function AdminBookingClient({ outing }: AdminBookingClientProps) {
  const [showEditModal, setShowEditModal] = useState(false)

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        onClick={() => setShowEditModal(true)}
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Outing
      </Button>

      <OutingEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        outing={outing}
      />
    </>
  )
} 