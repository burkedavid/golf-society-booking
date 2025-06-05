'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, X, Save } from 'lucide-react'

interface Member {
  id: string
  name: string
  email: string
  phone?: string
  memberNumber: string
  handicap: number
}

interface MemberEditModalProps {
  member: Member
}

export function MemberEditModal({ member }: MemberEditModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: member.name,
    email: member.email,
    phone: member.phone || '',
    handicap: member.handicap.toString()
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/members/${member.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          handicap: parseInt(formData.handicap)
        }),
      })

      if (response.ok) {
        setIsOpen(false)
        window.location.reload() // Refresh the page to show updated data
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update member')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-blue-600 border-blue-200 hover:bg-blue-50"
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Member
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Edit Member</CardTitle>
                    <CardDescription className="text-blue-100">
                      Update member information
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-blue-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="handicap">Handicap *</Label>
                    <Input
                      id="handicap"
                      name="handicap"
                      type="number"
                      min="0"
                      max="54"
                      value={formData.handicap}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <strong>Member #{member.memberNumber}</strong>
                    <br />
                    Member number cannot be changed
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <div className="text-red-800 text-sm">{error}</div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  )
} 