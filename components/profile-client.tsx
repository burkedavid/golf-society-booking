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
  // Use local state for current user data that can be updated
  const [currentUser, setCurrentUser] = useState(user)
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
        const result = await response.json()
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        
        // Update the local user state with the new data
        setCurrentUser(prev => ({
          ...prev,
          email: formData.email,
          phone: formData.phone || null,
          handicap: formData.handicap
        }))
        
        // Refresh the page to update session data
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
    <div className="space-y-6 sm:space-y-8">
      {/* Member Information Display - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center text-green-800">
              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Member Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
            <div>
              <Label className="text-xs sm:text-sm font-medium text-green-700">Full Name</Label>
              <p className="text-gray-900 font-semibold text-sm sm:text-base">{currentUser.name}</p>
            </div>
            <div>
              <Label className="text-xs sm:text-sm font-medium text-green-700">Member Number</Label>
              <p className="text-gray-900 font-semibold text-sm sm:text-base">#{currentUser.memberNumber}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-3 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center text-emerald-800">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Golf Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
            <div>
              <Label className="text-xs sm:text-sm font-medium text-emerald-700">Current Handicap</Label>
              <p className="text-xl sm:text-2xl font-bold text-emerald-800">{currentUser.handicap}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update Form - Mobile Optimized */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl flex items-center text-gray-800">
            <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Update Your Information
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Keep your contact details and handicap current for the best experience
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center text-sm font-medium">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full text-sm sm:text-base"
                required
              />
              <p className="text-xs text-gray-500">
                This email will be used for booking confirmations and society communications
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center text-sm font-medium">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-emerald-600" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full text-sm sm:text-base"
                placeholder="e.g., +44 7123 456789"
              />
              <p className="text-xs text-gray-500">
                Optional - for urgent communications about outings
              </p>
            </div>

            {/* Handicap */}
            <div className="space-y-2">
              <Label htmlFor="handicap" className="flex items-center text-sm font-medium">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-yellow-600" />
                Golf Handicap
              </Label>
              <Input
                id="handicap"
                type="number"
                min="0"
                max="54"
                value={formData.handicap}
                onChange={(e) => handleInputChange('handicap', parseInt(e.target.value) || 0)}
                className="w-full text-sm sm:text-base"
                required
              />
              <p className="text-xs text-gray-500">
                Keep this updated for accurate pairing and competition purposes
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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