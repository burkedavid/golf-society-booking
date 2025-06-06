import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const createMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  handicap: z.number().min(0).max(54, 'Handicap must be between 0 and 54'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all members with their booking statistics
    const members = await prisma.user.findMany({
      where: { role: 'member' },
      include: {
        bookings: {
          include: {
            outing: true
          }
        }
      },
      orderBy: { memberNumber: 'asc' }
    })

    // Calculate booking statistics for each member
    const membersWithStats = members.map((member: any) => {
      const totalBookings = member.bookings.length
      const totalSpent = member.bookings.reduce((sum: number, booking: any) => sum + booking.totalCost, 0)
      const lastBooking = member.bookings.length > 0 
        ? member.bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
        : null

      return {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        memberNumber: member.memberNumber,
        handicap: member.handicap,
        placeOfBirth: member.placeOfBirth,
        homeGolfClub: member.homeGolfClub,
        proposingMember: member.proposingMember,
        subscriptionPaid: member.subscriptionPaid,
        subscriptionYear: member.subscriptionYear,
        subscriptionPaidDate: member.subscriptionPaidDate,
        createdAt: member.createdAt,
        totalBookings,
        totalSpent,
        lastBookingDate: lastBooking?.createdAt || null
      }
    })

    return NextResponse.json(membersWithStats)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createMemberSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    // Generate member number
    const lastMember = await prisma.user.findFirst({
      where: { role: 'member' },
      orderBy: { memberNumber: 'desc' }
    })

    let nextNumber = 1
    if (lastMember && lastMember.memberNumber) {
      const lastNumber = parseInt(lastMember.memberNumber.replace('IGS', ''))
      nextNumber = lastNumber + 1
    }

    const memberNumber = `IGS${nextNumber.toString().padStart(3, '0')}`

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12)

    // Create new member
    const newMember = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        handicap: validatedData.handicap,
        memberNumber,
        passwordHash,
        role: 'member'
      }
    })

    // Return member without password hash
    const { passwordHash: _, ...memberWithoutPassword } = newMember

    return NextResponse.json(memberWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 