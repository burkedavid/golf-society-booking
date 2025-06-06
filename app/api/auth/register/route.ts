import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Full name is required'),
  handicap: z.number().min(0).max(54, 'Handicap must be between 0 and 54').optional(),
  phone: z.string().optional(),
  placeOfBirth: z.string().optional(),
  homeGolfClub: z.string().optional(),
  proposingMember: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

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

    // Create new member with default values for optional fields
    const newMember = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        name: validatedData.name,
        handicap: validatedData.handicap || 28.0,
        phone: validatedData.phone || null,
        placeOfBirth: validatedData.placeOfBirth || null,
        homeGolfClub: validatedData.homeGolfClub || null,
        proposingMember: validatedData.proposingMember || null,
        memberNumber,
        role: 'member'
      }
    })

    // Return member without password hash
    const { passwordHash: _, ...memberWithoutPassword } = newMember

    return NextResponse.json({ 
      success: true,
      message: 'Registration successful! You can now sign in.',
      member: memberWithoutPassword
    }, { status: 201 })

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