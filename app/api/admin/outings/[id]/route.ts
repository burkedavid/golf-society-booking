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
    if (!name || !date || !venue || capacity === undefined || memberPrice === undefined || guestPrice === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if outing exists
    const existingOuting = await prisma.outing.findUnique({
      where: { id: params.id }
    })

    if (!existingOuting) {
      return NextResponse.json({ error: 'Outing not found' }, { status: 404 })
    }

    // Update the outing
    const updatedOuting = await prisma.outing.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        date: new Date(date),
        time: time?.trim() || null,
        venue: venue.trim(),
        capacity: parseInt(capacity),
        memberPrice: parseFloat(memberPrice),
        guestPrice: parseFloat(guestPrice),
        registrationDeadline: new Date(registrationDeadline)
      }
    })

    return NextResponse.json({ 
      message: 'Outing updated successfully',
      outing: updatedOuting
    })
  } catch (error) {
    console.error('Error updating outing:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if outing exists and get booking count
    const existingOuting = await prisma.outing.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!existingOuting) {
      return NextResponse.json({ error: 'Outing not found' }, { status: 404 })
    }

    // Delete all associated data in the correct order (due to foreign key constraints)
    // 1. Delete all bookings (this will cascade to delete guest data and meal data)
    await prisma.booking.deleteMany({
      where: { outingId: params.id }
    })

    // 2. Delete menu items
    await prisma.menu.deleteMany({
      where: { outingId: params.id }
    })

    // 3. Finally delete the outing
    await prisma.outing.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      message: 'Outing and all associated data deleted successfully',
      deletedOuting: {
        id: existingOuting.id,
        name: existingOuting.name,
        bookingsDeleted: existingOuting._count.bookings
      }
    })
  } catch (error) {
    console.error('Error deleting outing:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 