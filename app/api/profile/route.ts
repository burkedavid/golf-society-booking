import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'member') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, phone, handicap } = body

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Valid email is required' }, { status: 400 })
    }

    if (typeof handicap !== 'number' || handicap < 0 || handicap > 54) {
      return NextResponse.json({ message: 'Handicap must be between 0 and 54' }, { status: 400 })
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
        id: {
          not: session.user.id
        }
      }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Email address is already in use' }, { status: 400 })
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        handicap: handicap
      }
    })

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        handicap: updatedUser.handicap
      }
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
} 