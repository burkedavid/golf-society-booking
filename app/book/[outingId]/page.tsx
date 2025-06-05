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
import { BankTransferModal } from '@/components/bank-transfer-modal'
import { CalendarDays, Clock, MapPin, Users, PoundSterling, ArrowLeft, Utensils } from 'lucide-react'
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
    mainCourse: string[]
    dessert: string[]
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
  const [showBankModal, setShowBankModal] = useState(false)
  const [bookingReference, setBookingReference] = useState('')
  
  // Form state
  const [guestCount, setGuestCount] = useState(0)
  const [guestNames, setGuestNames] = useState<string[]>([])
  const [guestHandicaps, setGuestHandicaps] = useState<number[]>([])
  const [guestMainCourses, setGuestMainCourses] = useState<string[]>([])
  const [guestDesserts, setGuestDesserts] = useState<string[]>([])
  const [memberMainCourse, setMemberMainCourse] = useState('')
  const [memberDessert, setMemberDessert] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    fetchOuting()
  }, [session, status])

  const fetchOuting = async () => {
    try {
      const response = await fetch(`/api/outings/${params.outingId}`)
      if (response.ok) {
        const data = await response.json()
        setOuting(data)
      }
    } catch (error) {
      console.error('Error fetching outing:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count)
    // Initialize arrays for new guest count
    setGuestNames(Array(count).fill(''))
    setGuestHandicaps(Array(count).fill(28))
    setGuestMainCourses(Array(count).fill(''))
    setGuestDesserts(Array(count).fill(''))
  }

  const handleGuestNameChange = (index: number, name: string) => {
    const newNames = [...guestNames]
    newNames[index] = name
    setGuestNames(newNames)
  }

  const handleGuestHandicapChange = (index: number, handicap: number) => {
    const newHandicaps = [...guestHandicaps]
    newHandicaps[index] = handicap
    setGuestHandicaps(newHandicaps)
  }

  const handleGuestMainCourseChange = (index: number, mainCourse: string) => {
    const newMainCourses = [...guestMainCourses]
    newMainCourses[index] = mainCourse
    setGuestMainCourses(newMainCourses)
  }

  const handleGuestDessertChange = (index: number, dessert: string) => {
    const newDesserts = [...guestDesserts]
    newDesserts[index] = dessert
    setGuestDesserts(newDesserts)
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
          memberMeals: {
            mainCourse: memberMainCourse,
            dessert: memberDessert
          },
          guestMeals: Array.from({ length: guestCount }, (_, i) => ({
            mainCourse: guestMainCourses[i],
            dessert: guestDesserts[i]
          })),
          specialRequests,
          totalCost: calculateTotal()
        }),
      })

      if (response.ok) {
        const booking = await response.json()
        // Generate a booking reference (using booking ID or a custom format)
        const reference = `IGS-${booking.id.slice(-8).toUpperCase()}`
        setBookingReference(reference)
        setShowBankModal(true)
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

  const handleModalClose = () => {
    setShowBankModal(false)
    router.push('/dashboard?booking=success')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading outing details...</p>
        </div>
      </div>
    )
  }

  if (!outing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Outing Not Found</h1>
          <Link href="/dashboard">
            <Button className="bg-green-600 hover:bg-green-700">Back to Dashboard</Button>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Book Golf Outing</h1>
                <p className="text-green-100">Irish Golf Society Scotland</p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Outing Details & Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Outing Details */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">{outing.name}</CardTitle>
                <CardDescription className="text-green-100">{outing.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6 text-gray-700">
                  <div className="flex items-center bg-green-50 rounded-lg p-3">
                    <CalendarDays className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                      <p className="font-semibold">{new Date(outing.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-blue-50 rounded-lg p-3">
                    <Clock className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                      <p className="font-semibold">{outing.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-red-50 rounded-lg p-3">
                    <MapPin className="w-5 h-5 mr-3 text-red-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Venue</p>
                      <p className="font-semibold">{outing.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-purple-50 rounded-lg p-3">
                    <Users className="w-5 h-5 mr-3 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Available</p>
                      <p className="font-semibold">{availableSpaces} spaces</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Utensils className="w-6 h-6 mr-3" />
                  Booking Details
                </CardTitle>
                <CardDescription className="text-blue-100">Complete your booking information</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Guest Count */}
                  <div>
                    <Label htmlFor="guestCount" className="text-lg font-semibold text-gray-800">Number of Guests</Label>
                    <Select value={guestCount.toString()} onValueChange={(value: string) => handleGuestCountChange(parseInt(value))}>
                      <SelectTrigger className="mt-2">
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

                  {/* Member Meal Choices */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Utensils className="w-5 h-5 mr-2 text-green-600" />
                      Your Meal Choices
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="memberMainCourse" className="font-medium">Main Course</Label>
                        <Select value={memberMainCourse} onValueChange={setMemberMainCourse} required>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select main course" />
                          </SelectTrigger>
                          <SelectContent>
                            {outing.menu.mainCourse.map((option, index) => (
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="memberDessert" className="font-medium">Dessert</Label>
                        <Select value={memberDessert} onValueChange={setMemberDessert} required>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select dessert" />
                          </SelectTrigger>
                          <SelectContent>
                            {outing.menu.dessert.map((option, index) => (
                              <SelectItem key={index} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Guest Information */}
                  {guestCount > 0 && (
                    <div>
                      <Label className="text-lg font-semibold text-gray-800">Guest Information & Meal Choices</Label>
                      <div className="space-y-6 mt-4">
                        {Array.from({ length: guestCount }, (_, i) => (
                          <div key={i} className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                            <h4 className="font-semibold text-lg mb-4 text-blue-800">Guest {i + 1}</h4>
                            
                            {/* Guest Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div>
                                <Label htmlFor={`guest-name-${i}`} className="font-medium">Name</Label>
                                <Input
                                  id={`guest-name-${i}`}
                                  placeholder="Full name"
                                  value={guestNames[i] || ''}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleGuestNameChange(i, e.target.value)}
                                  required
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`guest-handicap-${i}`} className="font-medium">Handicap</Label>
                                <Input
                                  id={`guest-handicap-${i}`}
                                  type="number"
                                  min="0"
                                  max="54"
                                  placeholder="28"
                                  value={guestHandicaps[i]?.toString() || '28'}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleGuestHandicapChange(i, parseInt(e.target.value) || 28)}
                                  required
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            {/* Guest Meal Choices */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`guest-main-${i}`} className="font-medium">Main Course</Label>
                                <Select value={guestMainCourses[i] || ''} onValueChange={(value) => handleGuestMainCourseChange(i, value)} required>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select main course" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {outing.menu.mainCourse.map((option, index) => (
                                      <SelectItem key={index} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor={`guest-dessert-${i}`} className="font-medium">Dessert</Label>
                                <Select value={guestDesserts[i] || ''} onValueChange={(value) => handleGuestDessertChange(i, value)} required>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select dessert" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {outing.menu.dessert.map((option, index) => (
                                      <SelectItem key={index} value={option}>
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

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="specialRequests" className="text-lg font-semibold text-gray-800">Special Requests (Optional)</Label>
                    <Textarea
                      id="specialRequests"
                      placeholder="Any dietary requirements, allergies, or special requests..."
                      value={specialRequests}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSpecialRequests(e.target.value)}
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                    disabled={submitting || availableSpaces <= guestCount}
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Complete Booking - £${calculateTotal().toFixed(2)}`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Booking Summary */}
          <div>
            <Card className="sticky top-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <PoundSterling className="w-5 h-5 mr-2" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Member ({session?.user?.name})</span>
                    <span className="font-bold text-green-600">£{outing.memberPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Handicap: {session?.user?.handicap}</div>
                    {memberMainCourse && <div>Main: {memberMainCourse}</div>}
                    {memberDessert && <div>Dessert: {memberDessert}</div>}
                  </div>
                </div>
                
                {guestCount > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{guestCount} Guest{guestCount !== 1 ? 's' : ''}</span>
                      <span className="font-bold text-blue-600">£{(guestCount * outing.guestPrice).toFixed(2)}</span>
                    </div>
                    {guestNames.map((name, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-3">
                        <div className="font-medium">{name || `Guest ${index + 1}`}</div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Handicap: {guestHandicaps[index] || 28}</div>
                          {guestMainCourses[index] && <div>Main: {guestMainCourses[index]}</div>}
                          {guestDesserts[index] && <div>Dessert: {guestDesserts[index]}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-green-600">£{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2 bg-gray-50 rounded-lg p-4">
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Registration deadline: {new Date(outing.registrationDeadline).toLocaleDateString()}
                  </p>
                  <p>• Payment due on booking</p>
                  <p>• Cancellation policy applies</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showBankModal && (
        <BankTransferModal
          isOpen={showBankModal}
          amount={calculateTotal()}
          bookingReference={bookingReference}
          memberName={session?.user?.name || ''}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
} 