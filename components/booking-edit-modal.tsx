'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Save, X, Utensils, Users } from 'lucide-react'

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
  const guestMeals = JSON.parse(booking.guestMeals || '[]')
  
  // Form state
  const [memberHandicap, setMemberHandicap] = useState(booking.memberHandicap)
  const [guestData, setGuestData] = useState(guests)
  const [memberMainCourse, setMemberMainCourse] = useState(memberMeals.mainCourse || '')
  const [memberDessert, setMemberDessert] = useState(memberMeals.dessert || '')
  const [guestMealChoices, setGuestMealChoices] = useState(guestMeals)
  const [specialRequests, setSpecialRequests] = useState(memberMeals.specialRequests || '')
  const [bookingStatus, setBookingStatus] = useState(booking.status)
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus)

  // Parse menu options from the new structure
  const menuOptions = outing.menu ? {
    mainCourse: JSON.parse(outing.menu.mainCourseOptions || '[]').map((item: any) => item.name),
    dessert: JSON.parse(outing.menu.dessertOptions || '[]').map((item: any) => item.name)
  } : { mainCourse: [], dessert: [] }

  const handleGuestChange = (index: number, field: string, value: string | number) => {
    const updatedGuests = [...guestData]
    updatedGuests[index] = { ...updatedGuests[index], [field]: value }
    setGuestData(updatedGuests)
  }

  const handleGuestMealChange = (index: number, mealType: string, value: string) => {
    const updatedMeals = [...guestMealChoices]
    if (!updatedMeals[index]) {
      updatedMeals[index] = {}
    }
    updatedMeals[index][mealType] = value
    setGuestMealChoices(updatedMeals)
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
            mainCourse: memberMainCourse,
            dessert: memberDessert,
            specialRequests
          },
          guestMeals: guestMealChoices,
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
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Edit Booking - {booking.user.name}
          </DialogTitle>
          <DialogDescription>
            Update booking details, handicaps, meal choices, and status
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member Details */}
          <div className="border rounded-lg p-6 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Member Details
            </h3>
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
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="memberMainCourse">Main Course</Label>
                <Select value={memberMainCourse} onValueChange={setMemberMainCourse}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select main course" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuOptions.mainCourse.map((option: string, index: number) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="memberDessert">Dessert</Label>
                <Select value={memberDessert} onValueChange={setMemberDessert}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select dessert" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuOptions.dessert.map((option: string, index: number) => (
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
            <div className="border rounded-lg p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Guest Details ({guestData.length})
              </h3>
              <div className="space-y-6">
                {guestData.map((guest: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3">Guest {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor={`guest-name-${index}`}>Guest Name</Label>
                        <Input
                          id={`guest-name-${index}`}
                          value={guest.name || ''}
                          onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                          required
                          className="mt-1"
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
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`guest-main-${index}`}>Main Course</Label>
                        <Select 
                          value={guestMealChoices[index]?.mainCourse || ''} 
                          onValueChange={(value) => handleGuestMealChange(index, 'mainCourse', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select main course" />
                          </SelectTrigger>
                          <SelectContent>
                            {menuOptions.mainCourse.map((option: string, optIndex: number) => (
                              <SelectItem key={optIndex} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`guest-dessert-${index}`}>Dessert</Label>
                        <Select 
                          value={guestMealChoices[index]?.dessert || ''} 
                          onValueChange={(value) => handleGuestMealChange(index, 'dessert', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select dessert" />
                          </SelectTrigger>
                          <SelectContent>
                            {menuOptions.dessert.map((option: string, optIndex: number) => (
                              <SelectItem key={optIndex} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Updates */}
          <div className="border rounded-lg p-6 bg-gray-50 border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Booking Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bookingStatus">Booking Status</Label>
                <Select value={bookingStatus} onValueChange={setBookingStatus}>
                  <SelectTrigger className="mt-1">
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
                  <SelectTrigger className="mt-1">
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
              className="mt-1"
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