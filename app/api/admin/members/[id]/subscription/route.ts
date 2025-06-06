import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateSubscriptionSchema = z.object({
  subscriptionPaid: z.boolean(),
  subscriptionYear: z.number().min(2020).max(2030),
  subscriptionPaidDate: z.string().optional()
})

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
    const validatedData = updateSubscriptionSchema.parse(body)

    // Check if member exists
    const existingMember = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingMember) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Update subscription status
    const updatedMember = await prisma.user.update({
      where: { id: params.id },
      data: {
        subscriptionPaid: validatedData.subscriptionPaid,
        subscriptionYear: validatedData.subscriptionYear,
        subscriptionPaidDate: validatedData.subscriptionPaidDate 
          ? new Date(validatedData.subscriptionPaidDate)
          : validatedData.subscriptionPaid 
            ? new Date() 
            : null
      }
    })

    return NextResponse.json({ 
      success: true, 
      member: {
        id: updatedMember.id,
        name: updatedMember.name,
        memberNumber: updatedMember.memberNumber,
        subscriptionPaid: updatedMember.subscriptionPaid,
        subscriptionYear: updatedMember.subscriptionYear,
        subscriptionPaidDate: updatedMember.subscriptionPaidDate
      }
    })

  } catch (error) {
    console.error('Error updating subscription:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 