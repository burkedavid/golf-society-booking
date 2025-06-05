import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createOutingSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  date: z.string(),
  time: z.string(),
  venue: z.string().min(1),
  capacity: z.number().positive(),
  memberPrice: z.number().min(0),
  guestPrice: z.number().min(0),
  registrationDeadline: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      date,
      time,
      venue,
      capacity,
      memberPrice,
      guestPrice,
      registrationDeadline,
      mainCourseOptions,
      dessertOptions
    } = body

    // Validate required fields
    if (!name || !date || !time || !venue || !capacity || !memberPrice || !guestPrice || !registrationDeadline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate menu options
    if (!mainCourseOptions || !Array.isArray(mainCourseOptions) || mainCourseOptions.length === 0) {
      return NextResponse.json({ error: 'At least one main course option is required' }, { status: 400 })
    }

    if (!dessertOptions || !Array.isArray(dessertOptions) || dessertOptions.length === 0) {
      return NextResponse.json({ error: 'At least one dessert option is required' }, { status: 400 })
    }

    // Create the outing and menu in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create the outing
      const outing = await tx.outing.create({
        data: {
          name,
          description: description || '',
          date: new Date(date),
          time,
          venue,
          capacity: parseInt(capacity),
          memberPrice: parseFloat(memberPrice),
          guestPrice: parseFloat(guestPrice),
          registrationDeadline: new Date(registrationDeadline),
          status: 'open'
        }
      })

      // Create the menu
      const menu = await tx.menu.create({
        data: {
          outingId: outing.id,
          mainCourseOptions: JSON.stringify(mainCourseOptions.map((item: any, index: number) => ({
            id: item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            name: item.name,
            description: item.description || '',
            dietary: item.name.includes('(V)') ? ['vegetarian'] : [],
            allergens: item.allergens || []
          }))),
          dessertOptions: JSON.stringify(dessertOptions.map((item: any, index: number) => ({
            id: item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            name: item.name,
            description: item.description || '',
            dietary: item.name.includes('(V)') ? ['vegetarian'] : [],
            allergens: item.allergens || []
          })))
        }
      })

      return { outing, menu }
    })

    return NextResponse.json({ 
      success: true, 
      outing: result.outing,
      menu: result.menu
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating outing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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