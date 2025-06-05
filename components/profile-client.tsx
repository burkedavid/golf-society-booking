'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Phone, Trophy, Save, Loader2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  memberNumber: string
  handicap: number
  role: string
}

interface ProfileClientProps {
  user: User
}

export function ProfileClient({ user }: ProfileClientProps) {
  const [formData, setFormData] = useState({
    email: user.email,
    phone: user.phone || '',
    handicap: user.handicap
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        // Refresh the page to show updated data
        router.refresh()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'An error occurred while updating your profile' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-8">
      {/* Member Information Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-blue-800">
              <User className="w-5 h-5 mr-2" />
              Member Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-blue-700">Full Name</Label>
              <p className="text-gray-900 font-semibold">{user.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-blue-700">Member Number</Label>
              <p className="text-gray-900 font-semibold">#{user.memberNumber}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-green-800">
              <Trophy className="w-5 h-5 mr-2" />
              Golf Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-green-700">Current Handicap</Label>
              <p className="text-2xl font-bold text-green-800">{user.handicap}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update Form */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl flex items-center text-gray-800">
            <Save className="w-5 h-5 mr-2" />
            Update Your Information
          </CardTitle>
          <CardDescription>
            Keep your contact details and handicap current for the best experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center text-sm font-medium">
                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500">
                This email will be used for booking confirmations and society communications
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center text-sm font-medium">
                <Phone className="w-4 h-4 mr-2 text-green-600" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full"
                placeholder="e.g., +44 7123 456789"
              />
              <p className="text-xs text-gray-500">
                Optional - for urgent communications about outings
              </p>
            </div>

            {/* Handicap */}
            <div className="space-y-2">
              <Label htmlFor="handicap" className="flex items-center text-sm font-medium">
                <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                Golf Handicap
              </Label>
              <Input
                id="handicap"
                type="number"
                min="0"
                max="54"
                value={formData.handicap}
                onChange={(e) => handleInputChange('handicap', parseInt(e.target.value) || 0)}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500">
                Keep this updated for accurate pairing and competition purposes
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 