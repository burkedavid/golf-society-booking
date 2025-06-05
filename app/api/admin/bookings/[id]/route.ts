import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateBookingSchema = z.object({
  memberHandicap: z.number().min(0).max(54),
  guests: z.array(z.object({
    name: z.string(),
    handicap: z.number().min(0).max(54)
  })),
  memberMeals: z.object({
    mainCourse: z.string(),
    dessert: z.string(),
    specialRequests: z.string().optional()
  }),
  guestMeals: z.array(z.object({
    mainCourse: z.string().optional(),
    dessert: z.string().optional()
  })).optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  paymentStatus: z.enum(['pending', 'paid', 'refunded'])
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateBookingSchema.parse(body)

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        outing: true
      }
    })

    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        memberHandicap: validatedData.memberHandicap,
        guests: JSON.stringify(validatedData.guests),
        memberMeals: JSON.stringify(validatedData.memberMeals),
        guestMeals: JSON.stringify(validatedData.guestMeals || []),
        status: validatedData.status,
        paymentStatus: validatedData.paymentStatus
      },
      include: {
        user: true,
        outing: true
      }
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 