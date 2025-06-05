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
  DialogTitle 
} from '@/components/ui/dialog'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'

interface OutingDeleteButtonProps {
  outingId: string
  outingName: string
  bookingCount: number
}

export function OutingDeleteButton({ outingId, outingName, bookingCount }: OutingDeleteButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/outings/${outingId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        // Redirect to admin dashboard after successful deletion
        router.push('/admin/dashboard?deleted=true')
      } else {
        const error = await response.json()
        alert(`Failed to delete outing: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting outing:', error)
      alert('An error occurred while deleting the outing')
    } finally {
      setIsDeleting(false)
      setShowDialog(false)
    }
  }

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm"
        onClick={() => setShowDialog(true)}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Outing
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete Outing
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <p>
                Are you sure you want to delete <strong>"{outingName}"</strong>?
              </p>
              
              {bookingCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 font-medium">
                    ⚠️ This will permanently delete:
                  </p>
                  <ul className="text-red-700 text-sm mt-2 space-y-1">
                    <li>• {bookingCount} booking{bookingCount !== 1 ? 's' : ''}</li>
                    <li>• All guest information</li>
                    <li>• All meal selections</li>
                    <li>• All payment records</li>
                  </ul>
                </div>
              )}
              
              <p className="text-gray-600 text-sm">
                This action cannot be undone. All data associated with this outing will be permanently removed.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(false)}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 