import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { outingId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const outing = await prisma.outing.findUnique({
      where: {
        id: params.outingId
      },
      include: {
        menu: true,
        bookings: true,
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!outing) {
      return NextResponse.json({ error: 'Outing not found' }, { status: 404 })
    }

    // Format the response to match the expected structure
    const formattedOuting = {
      ...outing,
      menu: outing.menu ? {
        mainCourse: JSON.parse(outing.menu.mainCourseOptions).map((item: any) => item.name),
        dessert: JSON.parse(outing.menu.dessertOptions).map((item: any) => item.name)
      } : {
        mainCourse: [],
        dessert: []
      }
    }

    return NextResponse.json(formattedOuting)
  } catch (error) {
    console.error('Error fetching outing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 