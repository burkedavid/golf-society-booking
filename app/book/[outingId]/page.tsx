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
import { CalendarDays, Clock, MapPin, Users, PoundSterling, ArrowLeft, Utensils, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import OrientationIndicator from '@/components/orientation-indicator'

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
  const [existingBooking, setExistingBooking] = useState<any>(null)
  
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
        
        // Check for existing booking by this user
        if (session?.user?.id) {
          const existingBookingResponse = await fetch(`/api/bookings/check?outingId=${params.outingId}&userId=${session.user.id}`)
          if (existingBookingResponse.ok) {
            const existingBookingData = await existingBookingResponse.json()
            if (existingBookingData.hasBooking) {
              setExistingBooking(existingBookingData.booking)
            }
          }
        }
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

  // If user already has a booking for this outing, show booking management interface
  if (existingBooking) {
    const guests = existingBooking.guests || []
    const memberMeals = existingBooking.memberMeals || {}
    const guestMeals = existingBooking.guestMeals || []

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <OrientationIndicator />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-green-700 px-3 py-2">
                    <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="text-sm sm:text-base">Back</span>
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Your Booking</h1>
                  <p className="text-green-100 text-sm sm:text-base">Irish Golf Society Scotland</p>
                </div>
              </div>
              <div className="self-end sm:self-auto">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>

        {/* Existing Booking Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Already Booked Message */}
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl sm:text-2xl">
                <Users className="w-6 h-6 mr-3" />
                You're Already Booked!
              </CardTitle>
              <CardDescription className="text-blue-100">
                You already have a booking for this outing. Here are your details:
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Great! You're all set for {existingBooking.outing.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Booking Date:</span>
                      <span className="font-medium">{new Date(existingBooking.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-bold text-green-600">£{existingBooking.totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span className="font-medium">{guests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        existingBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {existingBooking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        existingBooking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {existingBooking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meal Choices */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">Meal Choices</h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded p-3">
                      <h4 className="font-medium text-green-800 mb-2">Your Meals</h4>
                      <div className="text-sm space-y-1">
                        <div><span className="font-medium">Main:</span> {memberMeals.mainCourse || 'Not selected'}</div>
                        <div><span className="font-medium">Dessert:</span> {memberMeals.dessert || 'Not selected'}</div>
                      </div>
                    </div>
                    
                    {guests.length > 0 && (
                      <div className="bg-white rounded p-3">
                        <h4 className="font-medium text-blue-800 mb-2">Guest Meals</h4>
                        <div className="space-y-2">
                          {guests.map((guest: any, index: number) => {
                            const guestMeal = guestMeals[index] || {}
                            return (
                              <div key={index} className="text-sm border-l-2 border-blue-200 pl-2">
                                <div className="font-medium">{guest.name}</div>
                                <div className="text-xs text-gray-600">
                                  Main: {guestMeal.mainCourse || 'Not selected'} | 
                                  Dessert: {guestMeal.dessert || 'Not selected'}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    // TODO: Implement booking management/editing
                    alert('Booking management feature coming soon! For now, please contact admin to make changes.')
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Booking
                </Button>
              </div>
            </CardContent>
          </Card>
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
      {/* Orientation Prompt for Mobile */}
      <OrientationIndicator />
      
      {/* Mobile-Optimized Header */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-green-700 px-3 py-2">
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="text-sm sm:text-base">Back</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Book Golf Outing</h1>
                <p className="text-green-100 text-sm sm:text-base">Irish Golf Society Scotland</p>
              </div>
            </div>
            <div className="self-end sm:self-auto">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Outing Details & Booking Form */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Mobile-Optimized Outing Details */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">{outing.name}</CardTitle>
                <CardDescription className="text-green-100 text-sm sm:text-base">{outing.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-gray-700">
                  <div className="flex items-center bg-green-50 rounded-lg p-3">
                    <CalendarDays className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                      <p className="font-semibold text-sm sm:text-base">{new Date(outing.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-blue-50 rounded-lg p-3">
                    <Clock className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                      <p className="font-semibold text-sm sm:text-base">{outing.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-red-50 rounded-lg p-3 sm:col-span-2 lg:col-span-1">
                    <MapPin className="w-5 h-5 mr-3 text-red-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Venue</p>
                      <p className="font-semibold text-sm sm:text-base truncate">{outing.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-purple-50 rounded-lg p-3">
                    <Users className="w-5 h-5 mr-3 text-purple-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Available</p>
                      <p className="font-semibold text-sm sm:text-base">{availableSpaces} spaces</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile-Optimized Booking Form */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Utensils className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Booking Details
                </CardTitle>
                <CardDescription className="text-blue-100 text-sm sm:text-base">Complete your booking information</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  {/* Guest Count */}
                  <div>
                    <Label htmlFor="guestCount" className="text-base sm:text-lg font-semibold text-gray-800">Number of Guests</Label>
                    <Select value={guestCount.toString()} onValueChange={(value: string) => handleGuestCountChange(parseInt(value))}>
                      <SelectTrigger className="mt-2 h-12 text-base">
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
                  <div className="bg-green-50 rounded-xl p-4 sm:p-6 border border-green-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Utensils className="w-5 h-5 mr-2 text-green-600" />
                      Your Meal Choices
                    </h3>
                    <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-4">
                      <div>
                        <Label htmlFor="memberMainCourse" className="font-medium text-sm sm:text-base">Main Course</Label>
                        <Select value={memberMainCourse} onValueChange={setMemberMainCourse} required>
                          <SelectTrigger className="mt-1 h-12 text-base">
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
                        <Label htmlFor="memberDessert" className="font-medium text-sm sm:text-base">Dessert</Label>
                        <Select value={memberDessert} onValueChange={setMemberDessert} required>
                          <SelectTrigger className="mt-1 h-12 text-base">
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
                      <Label className="text-base sm:text-lg font-semibold text-gray-800">Guest Information & Meal Choices</Label>
                      <div className="space-y-4 sm:space-y-6 mt-4">
                        {Array.from({ length: guestCount }, (_, i) => (
                          <div key={i} className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                            <h4 className="font-semibold text-base sm:text-lg mb-4 text-blue-800">Guest {i + 1}</h4>
                            
                            <div className="space-y-4">
                              {/* Guest Name and Handicap */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`guestName${i}`} className="font-medium text-sm sm:text-base">Name</Label>
                                  <Input
                                    id={`guestName${i}`}
                                    type="text"
                                    value={guestNames[i] || ''}
                                    onChange={(e) => handleGuestNameChange(i, e.target.value)}
                                    placeholder="Guest name"
                                    required
                                    className="mt-1 h-12 text-base"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`guestHandicap${i}`} className="font-medium text-sm sm:text-base">Handicap</Label>
                                  <Input
                                    id={`guestHandicap${i}`}
                                    type="number"
                                    min="0"
                                    max="54"
                                    value={guestHandicaps[i] || 28}
                                    onChange={(e) => handleGuestHandicapChange(i, parseInt(e.target.value) || 28)}
                                    className="mt-1 h-12 text-base"
                                  />
                                </div>
                              </div>

                              {/* Guest Meal Choices */}
                              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-4">
                                <div>
                                  <Label htmlFor={`guestMainCourse${i}`} className="font-medium text-sm sm:text-base">Main Course</Label>
                                  <Select 
                                    value={guestMainCourses[i] || ''} 
                                    onValueChange={(value) => handleGuestMainCourseChange(i, value)}
                                    required
                                  >
                                    <SelectTrigger className="mt-1 h-12 text-base">
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
                                  <Label htmlFor={`guestDessert${i}`} className="font-medium text-sm sm:text-base">Dessert</Label>
                                  <Select 
                                    value={guestDesserts[i] || ''} 
                                    onValueChange={(value) => handleGuestDessertChange(i, value)}
                                    required
                                  >
                                    <SelectTrigger className="mt-1 h-12 text-base">
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
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="specialRequests" className="text-base sm:text-lg font-semibold text-gray-800">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any dietary requirements or special requests..."
                      className="mt-2 min-h-[100px] text-base"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 text-base sm:text-lg h-auto"
                  >
                    {submitting ? 'Processing...' : `Complete Booking - £${calculateTotal().toFixed(2)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Mobile-Optimized Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm sticky top-6">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <PoundSterling className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600 text-sm sm:text-base">Member</span>
                    <span className="font-semibold text-sm sm:text-base">£{outing.memberPrice.toFixed(2)}</span>
                  </div>
                  {guestCount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600 text-sm sm:text-base">{guestCount} Guest{guestCount > 1 ? 's' : ''}</span>
                      <span className="font-semibold text-sm sm:text-base">£{(guestCount * outing.guestPrice).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3 border-t-2 border-green-200">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-green-600">£{calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mt-4">
                    <p className="text-xs sm:text-sm text-yellow-800">
                      <strong>Payment:</strong> Bank transfer details will be provided after booking confirmation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bank Transfer Modal */}
      {showBankModal && (
        <BankTransferModal
          isOpen={showBankModal}
          onClose={handleModalClose}
          bookingReference={bookingReference}
          amount={calculateTotal()}
          memberName={session?.user?.name || ''}
        />
      )}
    </div>
  )
} 