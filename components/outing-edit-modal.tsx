'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CalendarDays, MapPin, Users, PoundSterling, Clock, Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OutingEditModalProps {
  isOpen: boolean
  onClose: () => void
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

export function OutingEditModal({ isOpen, onClose, outing }: OutingEditModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: outing.name,
    description: outing.description || '',
    date: new Date(outing.date).toISOString().split('T')[0],
    time: outing.time || '',
    venue: outing.venue || '',
    capacity: outing.capacity.toString(),
    memberPrice: outing.memberPrice.toString(),
    guestPrice: outing.guestPrice.toString(),
    registrationDeadline: new Date(outing.registrationDeadline).toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/outings/${outing.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          date: new Date(formData.date).toISOString(),
          time: formData.time,
          venue: formData.venue,
          capacity: parseInt(formData.capacity),
          memberPrice: parseFloat(formData.memberPrice),
          guestPrice: parseFloat(formData.guestPrice),
          registrationDeadline: new Date(formData.registrationDeadline).toISOString()
        }),
      })

      if (response.ok) {
        router.refresh()
        onClose()
      } else {
        console.error('Failed to update outing')
      }
    } catch (error) {
      console.error('Error updating outing:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <CalendarDays className="w-5 h-5 mr-2 text-green-600" />
            Edit Outing Details
          </DialogTitle>
          <DialogDescription>
            Update the outing information. Changes will be reflected immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Outing Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="mt-1"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center">
                <CalendarDays className="w-4 h-4 mr-1" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="time" className="text-sm font-medium text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Time
              </Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="mt-1"
                placeholder="e.g., 10:00 AM"
                required
              />
            </div>
          </div>

          {/* Venue and Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="venue" className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Venue
              </Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="capacity" className="text-sm font-medium text-gray-700 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Capacity
              </Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                className="mt-1"
                min="1"
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="memberPrice" className="text-sm font-medium text-gray-700 flex items-center">
                <PoundSterling className="w-4 h-4 mr-1" />
                Member Price
              </Label>
              <Input
                id="memberPrice"
                type="number"
                step="0.01"
                value={formData.memberPrice}
                onChange={(e) => handleChange('memberPrice', e.target.value)}
                className="mt-1"
                min="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="guestPrice" className="text-sm font-medium text-gray-700 flex items-center">
                <PoundSterling className="w-4 h-4 mr-1" />
                Guest Price
              </Label>
              <Input
                id="guestPrice"
                type="number"
                step="0.01"
                value={formData.guestPrice}
                onChange={(e) => handleChange('guestPrice', e.target.value)}
                className="mt-1"
                min="0"
                required
              />
            </div>
          </div>

          {/* Registration Deadline */}
          <div>
            <Label htmlFor="registrationDeadline" className="text-sm font-medium text-gray-700">
              Registration Deadline
            </Label>
            <Input
              id="registrationDeadline"
              type="date"
              value={formData.registrationDeadline}
              onChange={(e) => handleChange('registrationDeadline', e.target.value)}
              className="mt-1"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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