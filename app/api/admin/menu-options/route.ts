import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all common menu options
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [mainCourses, desserts] = await Promise.all([
      prisma.commonMainCourse.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      }),
      prisma.commonDessert.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' }
      })
    ])

    return NextResponse.json({
      mainCourses: mainCourses.map((course: any) => ({
        ...course,
        allergens: JSON.parse(course.allergens)
      })),
      desserts: desserts.map((dessert: any) => ({
        ...dessert,
        allergens: JSON.parse(dessert.allergens)
      }))
    })
  } catch (error) {
    console.error('Error fetching menu options:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new menu option
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, name, description, allergens } = await request.json()

    if (!type || !name || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const allergensJson = JSON.stringify(allergens || [])

    if (type === 'main') {
      const newMainCourse = await prisma.commonMainCourse.create({
        data: {
          name,
          description,
          allergens: allergensJson
        }
      })
      
      return NextResponse.json({
        ...newMainCourse,
        allergens: JSON.parse(newMainCourse.allergens)
      })
    } else if (type === 'dessert') {
      const newDessert = await prisma.commonDessert.create({
        data: {
          name,
          description,
          allergens: allergensJson
        }
      })
      
      return NextResponse.json({
        ...newDessert,
        allergens: JSON.parse(newDessert.allergens)
      })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error creating menu option:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 