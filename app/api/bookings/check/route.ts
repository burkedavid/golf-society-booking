import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const outingId = searchParams.get('outingId')
    const userId = searchParams.get('userId')

    if (!outingId || !userId) {
      return NextResponse.json({ error: 'Missing outingId or userId' }, { status: 400 })
    }

    // Check if user already has a booking for this outing
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: userId,
        outingId: outingId
      },
      include: {
        outing: {
          select: {
            name: true,
            date: true,
            venue: true
          }
        }
      }
    })

    if (existingBooking) {
      return NextResponse.json({
        hasBooking: true,
        booking: {
          id: existingBooking.id,
          totalCost: existingBooking.totalCost,
          status: existingBooking.status,
          paymentStatus: existingBooking.paymentStatus,
          createdAt: existingBooking.createdAt,
          guests: JSON.parse(existingBooking.guests || '[]'),
          memberMeals: JSON.parse(existingBooking.memberMeals || '{}'),
          guestMeals: JSON.parse(existingBooking.guestMeals || '[]'),
          outing: existingBooking.outing
        }
      })
    }

    return NextResponse.json({ hasBooking: false })
  } catch (error) {
    console.error('Error checking existing booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 