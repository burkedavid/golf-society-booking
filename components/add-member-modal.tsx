'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { UserPlus, Loader2, Mail, Phone, Trophy, Lock, User } from 'lucide-react'

interface AddMemberModalProps {
  onMemberAdded?: () => void
}

export function AddMemberModal({ onMemberAdded }: AddMemberModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    handicap: 28,
    password: ''
  }) 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone || undefined
        }),
      })

      if (response.ok) {
        setIsOpen(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          handicap: 28,
          password: ''
        })
        
        // Refresh the page to show the new member
        router.refresh()
        
        if (onMemberAdded) {
          onMemberAdded()
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create member')
      }
    } catch (error) {
      console.error('Error creating member:', error)
      setError('An error occurred while creating the member')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
            Add New Member
          </DialogTitle>
          <DialogDescription>
            Create a new member account for the Irish Golf Society Scotland
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-4 h-4 mr-2 text-green-600" />
              Personal Information
            </h3>
            
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number (optional)"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Golf Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-green-600" />
              Golf Information
            </h3>
            
            <div>
              <Label htmlFor="handicap" className="text-sm font-medium">Handicap *</Label>
              <Input
                id="handicap"
                type="number"
                min="0"
                max="54"
                step="0.1"
                value={formData.handicap}
                onChange={(e) => handleInputChange('handicap', parseFloat(e.target.value) || 0)}
                placeholder="Enter handicap (e.g., 17.2)"
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Account Security */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-green-600" />
              Account Security
            </h3>
            
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter password (min 6 characters)"
                  required
                  minLength={6}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Member
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 