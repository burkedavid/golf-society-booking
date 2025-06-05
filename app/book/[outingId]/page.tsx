'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserMenu } from '@/components/user-menu'
import { CalendarDays, Clock, MapPin, Users, PoundSterling, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Outing {
  id: string
  name: string
  description: string
  date: string
  time: string
  venue: string
  memberPrice: number
  guestPrice: number
  capacity: number
  registrationDeadline: string
  menu: {
    lunch: string[]
    dinner: string[]
  }
  _count: {
    bookings: number
  }
  bookings?: any[]
}

export default function BookOuting({ params }: { params: { outingId: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [outing, setOuting] = useState<Outing | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [guestCount, setGuestCount] = useState(0)
  const [guestNames, setGuestNames] = useState<string[]>([])
  const [guestHandicaps, setGuestHandicaps] = useState<number[]>([])
  const [lunchChoice, setLunchChoice] = useState('')
  const [dinnerChoice, setDinnerChoice] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchOuting()
    }
  }, [status, params.outingId])

  const fetchOuting = async () => {
    try {
      const response = await fetch(`/api/outings/${params.outingId}`)
      if (response.ok) {
        const data = await response.json()
        setOuting(data)
      } else {
        console.error('Failed to fetch outing')
      }
    } catch (error) {
      console.error('Error fetching outing:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count)
    const newGuestNames = Array(count).fill('').map((_, i) => guestNames[i] || '')
    const newGuestHandicaps = Array(count).fill(28).map((_, i) => guestHandicaps[i] || 28)
    setGuestNames(newGuestNames)
    setGuestHandicaps(newGuestHandicaps)
  }

  const handleGuestNameChange = (index: number, name: string) => {
    const newGuestNames = [...guestNames]
    newGuestNames[index] = name
    setGuestNames(newGuestNames)
  }

  const handleGuestHandicapChange = (index: number, handicap: number) => {
    const newGuestHandicaps = [...guestHandicaps]
    newGuestHandicaps[index] = handicap
    setGuestHandicaps(newGuestHandicaps)
  }

  const calculateTotal = () => {
    if (!outing) return 0
    return outing.memberPrice + (guestCount * outing.guestPrice)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!outing || !session) return

    setSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outingId: outing.id,
          guestCount,
          guestNames: guestNames.filter(name => name.trim() !== ''),
          guestHandicaps,
          lunchChoice,
          dinnerChoice,
          specialRequests,
          totalCost: calculateTotal()
        }),
      })

      if (response.ok) {
        router.push('/dashboard?booking=success')
      } else {
        const error = await response.json()
        alert(`Booking failed: ${error.message}`)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('An error occurred while creating your booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading outing details...</p>
        </div>
      </div>
    )
  }

  if (!outing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Outing Not Found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Calculate total people (members + guests) not just bookings
  const totalPeople = outing.bookings?.reduce((total: number, booking: any) => {
    const guests = JSON.parse(booking.guests || '[]')
    return total + 1 + guests.length // 1 member + number of guests
  }, 0) || 0
  
  const availableSpaces = outing.capacity - totalPeople
  const maxGuests = Math.min(3, availableSpaces - 1) // Member + up to 3 guests, but limited by available spaces

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Book Outing</h1>
                <p className="text-gray-600">Irish Golf Society Scotland</p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Outing Details */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-2xl">{outing.name}</CardTitle>
                <CardDescription>{outing.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2 text-gray-500" />
                    {new Date(outing.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    {outing.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {outing.venue}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    {availableSpaces} spaces available
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Complete your booking information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Guest Count */}
                  <div>
                    <Label htmlFor="guestCount">Number of Guests</Label>
                    <Select value={guestCount.toString()} onValueChange={(value: string) => handleGuestCountChange(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: maxGuests + 1 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i} {i === 1 ? 'guest' : 'guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Guest Information */}
                  {guestCount > 0 && (
                    <div>
                      <Label>Guest Information</Label>
                      <div className="space-y-4 mt-2">
                        {Array.from({ length: guestCount }, (_, i) => (
                          <div key={i} className="border rounded-lg p-4 bg-gray-50">
                            <h4 className="font-medium text-sm mb-3">Guest {i + 1}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor={`guest-name-${i}`} className="text-xs">Name</Label>
                                <Input
                                  id={`guest-name-${i}`}
                                  placeholder="Full name"
                                  value={guestNames[i] || ''}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleGuestNameChange(i, e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor={`guest-handicap-${i}`} className="text-xs">Handicap</Label>
                                <Input
                                  id={`guest-handicap-${i}`}
                                  type="number"
                                  min="0"
                                  max="54"
                                  placeholder="28"
                                  value={guestHandicaps[i]?.toString() || '28'}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleGuestHandicapChange(i, parseInt(e.target.value) || 28)}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Menu Choices */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lunch">Lunch Choice</Label>
                      <Select value={lunchChoice} onValueChange={setLunchChoice} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lunch option" />
                        </SelectTrigger>
                        <SelectContent>
                          {outing.menu.lunch.map((option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dinner">Dinner Choice</Label>
                      <Select value={dinnerChoice} onValueChange={setDinnerChoice} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dinner option" />
                        </SelectTrigger>
                        <SelectContent>
                          {outing.menu.dinner.map((option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Textarea
                      id="specialRequests"
                      placeholder="Any dietary requirements or special requests..."
                      value={specialRequests}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSpecialRequests(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={submitting || availableSpaces <= guestCount}
                  >
                    {submitting ? 'Processing...' : `Complete Booking - £${calculateTotal().toFixed(2)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PoundSterling className="w-5 h-5 mr-2" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Member ({session?.user?.name})</span>
                  <span>£{outing.memberPrice.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-500 ml-4">
                  Handicap: {session?.user?.handicap}
                </div>
                
                {guestCount > 0 && (
                  <div>
                    <div className="flex justify-between">
                      <span>{guestCount} Guest{guestCount !== 1 ? 's' : ''}</span>
                      <span>£{(guestCount * outing.guestPrice).toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 ml-4 space-y-1">
                      {guestNames.map((name, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{name || `Guest ${index + 1}`}</span>
                          <span>H: {guestHandicaps[index] || 28}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>£{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Registration deadline: {new Date(outing.registrationDeadline).toLocaleDateString()}</p>
                  <p>• Payment due on booking</p>
                  <p>• Cancellation policy applies</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 