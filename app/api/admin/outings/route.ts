import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createOutingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  date: z.string(),
  time: z.string(),
  venue: z.string().min(1, 'Venue is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  memberPrice: z.number().min(0, 'Member price must be positive'),
  guestPrice: z.number().min(0, 'Guest price must be positive'),
  registrationDeadline: z.string()
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createOutingSchema.parse(body)

    // Create the outing
    const outing = await prisma.outing.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || '',
        date: new Date(validatedData.date),
        time: validatedData.time,
        venue: validatedData.venue,
        capacity: validatedData.capacity,
        memberPrice: validatedData.memberPrice,
        guestPrice: validatedData.guestPrice,
        registrationDeadline: new Date(validatedData.registrationDeadline),
        status: 'open'
      }
    })

    return NextResponse.json(outing, { status: 201 })

  } catch (error) {
    console.error('Error creating outing:', error)
    
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

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all outings with booking counts
    const outings = await prisma.outing.findMany({
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json(outings)

  } catch (error) {
    console.error('Error fetching outings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 