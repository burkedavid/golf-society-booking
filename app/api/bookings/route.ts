import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const mealChoiceSchema = z.object({
  mainCourse: z.string(),
  dessert: z.string()
})

const bookingSchema = z.object({
  outingId: z.string(),
  guestCount: z.number().min(0).max(3),
  guestNames: z.array(z.string()).optional(),
  guestHandicaps: z.array(z.number()).optional(),
  memberMeals: mealChoiceSchema,
  guestMeals: z.array(mealChoiceSchema).optional(),
  specialRequests: z.string().optional(),
  totalCost: z.number().positive()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = bookingSchema.parse(body)

    // Check if outing exists and has capacity
    const outing = await prisma.outing.findUnique({
      where: { id: validatedData.outingId },
      include: {
        bookings: true,
        _count: {
          select: { bookings: true }
        }
      }
    })

    if (!outing) {
      return NextResponse.json({ error: 'Outing not found' }, { status: 404 })
    }

    // Check if registration is still open
    if (new Date() > new Date(outing.registrationDeadline)) {
      return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 400 })
    }

    // Calculate current total people (members + guests)
    const currentTotalPeople = outing.bookings.reduce((total: number, booking: any) => {
      const guests = JSON.parse(booking.guests || '[]')
      return total + 1 + guests.length // 1 member + number of guests
    }, 0)

    // Check capacity
    const totalSpacesNeeded = 1 + validatedData.guestCount // Member + guests
    const availableSpaces = outing.capacity - currentTotalPeople
    
    if (totalSpacesNeeded > availableSpaces) {
      return NextResponse.json({ error: 'Not enough spaces available' }, { status: 400 })
    }

    // Check if user already has a booking for this outing
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        outingId: validatedData.outingId
      }
    })

    if (existingBooking) {
      return NextResponse.json({ error: 'You already have a booking for this outing' }, { status: 400 })
    }

    // Prepare guest data with handicaps and individual meal choices
    const guests = validatedData.guestNames?.map((name, index) => ({
      name,
      handicap: validatedData.guestHandicaps?.[index] || 28
    })) || []

    // Prepare member meals with special requests
    const memberMeals = {
      mainCourse: validatedData.memberMeals.mainCourse,
      dessert: validatedData.memberMeals.dessert,
      specialRequests: validatedData.specialRequests || ''
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        outingId: validatedData.outingId,
        memberHandicap: session.user.handicap,
        guests: JSON.stringify(guests),
        memberMeals: JSON.stringify(memberMeals),
        guestMeals: JSON.stringify(validatedData.guestMeals || []),
        totalCost: validatedData.totalCost,
        status: 'pending',
        paymentStatus: 'pending'
      },
      include: {
        outing: true,
        user: true
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }

    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 