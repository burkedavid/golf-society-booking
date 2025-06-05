import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PUT - Update menu option
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, name, description, allergens, isActive } = await request.json()
    const { id } = params

    if (!name || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const allergensJson = JSON.stringify(allergens || [])

    if (type === 'main') {
      const updatedMainCourse = await prisma.commonMainCourse.update({
        where: { id },
        data: {
          name,
          description,
          allergens: allergensJson,
          isActive: isActive !== undefined ? isActive : true
        }
      })
      
      return NextResponse.json({
        ...updatedMainCourse,
        allergens: JSON.parse(updatedMainCourse.allergens)
      })
    } else if (type === 'dessert') {
      const updatedDessert = await prisma.commonDessert.update({
        where: { id },
        data: {
          name,
          description,
          allergens: allergensJson,
          isActive: isActive !== undefined ? isActive : true
        }
      })
      
      return NextResponse.json({
        ...updatedDessert,
        allergens: JSON.parse(updatedDessert.allergens)
      })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error updating menu option:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete menu option (soft delete by setting isActive to false)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type } = await request.json()
    const { id } = params

    if (type === 'main') {
      await prisma.commonMainCourse.update({
        where: { id },
        data: { isActive: false }
      })
    } else if (type === 'dessert') {
      await prisma.commonDessert.update({
        where: { id },
        data: { isActive: false }
      })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting menu option:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 