import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, handicap } = body

    // Validate required fields
    if (!name || !email || handicap === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate handicap range
    if (handicap < 0 || handicap > 54) {
      return NextResponse.json({ error: 'Handicap must be between 0 and 54' }, { status: 400 })
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: params.id }
      }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email address is already in use' }, { status: 400 })
    }

    // Update the member
    const updatedMember = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone: phone || null,
        handicap: parseInt(handicap)
      }
    })

    return NextResponse.json({ 
      success: true, 
      member: {
        id: updatedMember.id,
        name: updatedMember.name,
        email: updatedMember.email,
        phone: updatedMember.phone,
        handicap: updatedMember.handicap,
        memberNumber: updatedMember.memberNumber
      }
    })

  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'reset-password') {
      // Generate a new temporary password
      const tempPassword = Math.random().toString(36).slice(-8)
      const hashedPassword = await bcrypt.hash(tempPassword, 12)

      // Update the user's password
      await prisma.user.update({
        where: { id: params.id },
        data: {
          passwordHash: hashedPassword
        }
      })

      return NextResponse.json({ 
        success: true, 
        tempPassword,
        message: 'Password has been reset successfully'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error processing member action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 