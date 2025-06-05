'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Save, X } from 'lucide-react'

interface BookingEditModalProps {
  booking: any
  outing: any
}

export function BookingEditModal({ booking, outing }: BookingEditModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Parse existing data
  const guests = JSON.parse(booking.guests || '[]')
  const memberMeals = JSON.parse(booking.memberMeals || '{}')
  
  // Form state
  const [memberHandicap, setMemberHandicap] = useState(booking.memberHandicap)
  const [guestData, setGuestData] = useState(guests)
  const [lunchChoice, setLunchChoice] = useState(memberMeals.lunch || '')
  const [dinnerChoice, setDinnerChoice] = useState(memberMeals.dinner || '')
  const [specialRequests, setSpecialRequests] = useState(memberMeals.specialRequests || '')
  const [bookingStatus, setBookingStatus] = useState(booking.status)
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus)

  // Parse menu options
  const menuOptions = outing.menu ? {
    lunch: JSON.parse(outing.menu.lunchOptions).map((item: any) => item.name),
    dinner: JSON.parse(outing.menu.dinnerOptions).map((item: any) => item.name)
  } : { lunch: [], dinner: [] }

  const handleGuestChange = (index: number, field: string, value: string | number) => {
    const updatedGuests = [...guestData]
    updatedGuests[index] = { ...updatedGuests[index], [field]: value }
    setGuestData(updatedGuests)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberHandicap,
          guests: guestData,
          memberMeals: {
            lunch: lunchChoice,
            dinner: dinnerChoice,
            specialRequests
          },
          status: bookingStatus,
          paymentStatus
        }),
      })

      if (response.ok) {
        setOpen(false)
        router.refresh()
      } else {
        const error = await response.json()
        alert(`Update failed: ${error.message}`)
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('An error occurred while updating the booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Booking - {booking.user.name}</DialogTitle>
          <DialogDescription>
            Update booking details, handicaps, and meal choices
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member Details */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-900 mb-4">Member Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="memberHandicap">Member Handicap</Label>
                <Input
                  id="memberHandicap"
                  type="number"
                  min="0"
                  max="54"
                  value={memberHandicap}
                  onChange={(e) => setMemberHandicap(parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lunchChoice">Lunch Choice</Label>
                <Select value={lunchChoice} onValueChange={setLunchChoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lunch option" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuOptions.lunch.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dinnerChoice">Dinner Choice</Label>
                <Select value={dinnerChoice} onValueChange={setDinnerChoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dinner option" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuOptions.dinner.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Guest Details */}
          {guestData.length > 0 && (
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-green-900 mb-4">Guest Details ({guestData.length})</h3>
              <div className="space-y-4">
                {guestData.map((guest: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white rounded border">
                    <div>
                      <Label htmlFor={`guest-name-${index}`}>Guest {index + 1} Name</Label>
                      <Input
                        id={`guest-name-${index}`}
                        value={guest.name || ''}
                        onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`guest-handicap-${index}`}>Handicap</Label>
                      <Input
                        id={`guest-handicap-${index}`}
                        type="number"
                        min="0"
                        max="54"
                        value={guest.handicap || 28}
                        onChange={(e) => handleGuestChange(index, 'handicap', parseInt(e.target.value) || 28)}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Updates */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bookingStatus">Booking Status</Label>
                <Select value={bookingStatus} onValueChange={setBookingStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
              placeholder="Any dietary requirements or special requests..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 