'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Trash2, Loader2 } from 'lucide-react'

interface BookingDeleteButtonProps {
  bookingId: string
  memberName: string
  outingName: string
}

export function BookingDeleteButton({ bookingId, memberName, outingName }: BookingDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setIsOpen(false)
        // Refresh the page to show updated booking list
        router.refresh()
      } else {
        const error = await response.json()
        alert(`Delete failed: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('An error occurred while deleting the booking')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Booking
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <p>Are you sure you want to delete this booking?</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
              <p><strong>Member:</strong> {memberName}</p>
              <p><strong>Outing:</strong> {outingName}</p>
            </div>
            <p className="text-sm text-red-600 font-medium">
              ⚠️ This action cannot be undone. All booking data including guest details and meal choices will be permanently removed.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Booking
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 