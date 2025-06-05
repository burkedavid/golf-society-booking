import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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
    const {
      name,
      description,
      date,
      time,
      venue,
      capacity,
      memberPrice,
      guestPrice,
      registrationDeadline
    } = body

    // Validate required fields
    if (!name || !description || !date || !time || !venue || capacity === undefined || memberPrice === undefined || guestPrice === undefined || !registrationDeadline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update the outing
    const updatedOuting = await prisma.outing.update({
      where: { id: params.id },
      data: {
        name,
        description,
        date: new Date(date),
        time,
        venue,
        capacity: parseInt(capacity),
        memberPrice: parseFloat(memberPrice),
        guestPrice: parseFloat(guestPrice),
        registrationDeadline: new Date(registrationDeadline)
      }
    })

    return NextResponse.json(updatedOuting)
  } catch (error) {
    console.error('Error updating outing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 