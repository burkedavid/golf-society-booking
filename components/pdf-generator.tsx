'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Download, Loader2 } from 'lucide-react'

interface Guest {
  name: string
  email?: string
  phone?: string
}

interface Booking {
  id: string
  user: {
    name: string
    email: string
    phone?: string
    memberNumber: string
  }
  guests: string
  memberMeals: string
  guestMeals: string
  totalCost: number
  createdAt: Date
}

interface Outing {
  id: string
  name: string
  description?: string
  date: Date
  time?: string
  venue?: string
  capacity: number
  memberPrice: number
  guestPrice: number
  registrationDeadline: Date
}

interface PDFGeneratorProps {
  outing: Outing
  bookings: Booking[]
}

export function PDFGenerator({ outing, bookings }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    
    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import('jspdf')).default
      const autoTable = (await import('jspdf-autotable')).default

      const doc = new jsPDF()
      
      // Set up fonts and colors
      const primaryColor: [number, number, number] = [34, 197, 94] // Green
      const secondaryColor: [number, number, number] = [59, 130, 246] // Blue
      const textColor: [number, number, number] = [31, 41, 55] // Gray-800
      const lightGray: [number, number, number] = [243, 244, 246] // Gray-100
      
      let yPosition = 20

      // Header with logo space and title
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.rect(0, 0, 210, 35, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('Irish Golf Society Scotland', 20, 20)
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      doc.text('Outing Booking & Meal Summary Report', 20, 28)
      
      yPosition = 50

      // Outing Information Section
      doc.setTextColor(textColor[0], textColor[1], textColor[2])
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('Outing Details', 20, yPosition)
      yPosition += 10

      // Outing details table
      const outingData = [
        ['Event Name', outing.name],
        ['Date', new Date(outing.date).toLocaleDateString('en-GB', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })],
        ['Time', outing.time || 'TBC'],
        ['Venue', outing.venue || 'TBC'],
        ['Capacity', `${outing.capacity} players`],
        ['Member Price', `£${outing.memberPrice.toFixed(2)}`],
        ['Guest Price', `£${outing.guestPrice.toFixed(2)}`],
        ['Registration Deadline', new Date(outing.registrationDeadline).toLocaleDateString('en-GB')]
      ]

      autoTable(doc, {
        startY: yPosition,
        head: [],
        body: outingData,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: lightGray },
          1: { cellWidth: 120 }
        },
        margin: { left: 20, right: 20 }
      })

      yPosition = (doc as any).lastAutoTable.finalY + 20

      // Calculate meal totals
      const mealTotals = {
        mainCourse: {} as Record<string, number>,
        dessert: {} as Record<string, number>
      }

      let totalPeople = 0

      bookings.forEach((booking) => {
        totalPeople += 1 // Member
        const guests = JSON.parse(booking.guests || '[]')
        totalPeople += guests.length

        // Count member meals
        const memberMeals = JSON.parse(booking.memberMeals || '{}')
        if (memberMeals.mainCourse) {
          mealTotals.mainCourse[memberMeals.mainCourse] = (mealTotals.mainCourse[memberMeals.mainCourse] || 0) + 1
        }
        if (memberMeals.dessert) {
          mealTotals.dessert[memberMeals.dessert] = (mealTotals.dessert[memberMeals.dessert] || 0) + 1
        }

        // Count guest meals
        const guestMeals = JSON.parse(booking.guestMeals || '[]')
        guestMeals.forEach((guestMeal: any) => {
          if (guestMeal.mainCourse) {
            mealTotals.mainCourse[guestMeal.mainCourse] = (mealTotals.mainCourse[guestMeal.mainCourse] || 0) + 1
          }
          if (guestMeal.dessert) {
            mealTotals.dessert[guestMeal.dessert] = (mealTotals.dessert[guestMeal.dessert] || 0) + 1
          }
        })
      })

      // Summary Statistics
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('Booking Summary', 20, yPosition)
      yPosition += 10

      const summaryData = [
        ['Total Bookings', bookings.length.toString()],
        ['Total People', totalPeople.toString()],
        ['Available Spaces', (outing.capacity - totalPeople).toString()],
        ['Total Revenue', `£${bookings.reduce((sum, booking) => sum + booking.totalCost, 0).toFixed(2)}`]
      ]

      autoTable(doc, {
        startY: yPosition,
        head: [],
        body: summaryData,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: lightGray },
          1: { cellWidth: 120 }
        },
        margin: { left: 20, right: 20 }
      })

      yPosition = (doc as any).lastAutoTable.finalY + 20

      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      // Meal Summary Section
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('Meal Summary for Kitchen', 20, yPosition)
      yPosition += 15

      // Main Course Summary
      if (Object.keys(mealTotals.mainCourse).length > 0) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Main Course Orders', 20, yPosition)
        yPosition += 5

        const mainCourseData = Object.entries(mealTotals.mainCourse)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .map(([dish, count]) => [dish, count.toString()])

        autoTable(doc, {
          startY: yPosition,
          head: [['Dish', 'Quantity']],
          body: mainCourseData,
          theme: 'striped',
          headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          styles: {
            fontSize: 10,
            cellPadding: 4,
          },
          columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 30, halign: 'center', fontStyle: 'bold' }
          },
          margin: { left: 20, right: 20 }
        })

        yPosition = (doc as any).lastAutoTable.finalY + 15
      }

      // Dessert Summary
      if (Object.keys(mealTotals.dessert).length > 0) {
        // Check if we need a new page
        if (yPosition > 220) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Dessert Orders', 20, yPosition)
        yPosition += 5

        const dessertData = Object.entries(mealTotals.dessert)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .map(([dish, count]) => [dish, count.toString()])

        autoTable(doc, {
          startY: yPosition,
          head: [['Dessert', 'Quantity']],
          body: dessertData,
          theme: 'striped',
          headStyles: {
            fillColor: secondaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          styles: {
            fontSize: 10,
            cellPadding: 4,
          },
          columnStyles: {
            0: { cellWidth: 140 },
            1: { cellWidth: 30, halign: 'center', fontStyle: 'bold' }
          },
          margin: { left: 20, right: 20 }
        })

        yPosition = (doc as any).lastAutoTable.finalY + 20
      }

      // New page for detailed bookings
      doc.addPage()
      yPosition = 20

      // Detailed Bookings Section
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('Detailed Booking List', 20, yPosition)
      yPosition += 15

      // Create detailed booking data
      const bookingDetails: any[] = []
      
      bookings.forEach((booking, index) => {
        const guests = JSON.parse(booking.guests || '[]')
        const memberMeals = JSON.parse(booking.memberMeals || '{}')
        const guestMeals = JSON.parse(booking.guestMeals || '[]')

        // Member row
        bookingDetails.push([
          (index + 1).toString(),
          booking.user.name,
          `#${booking.user.memberNumber}`,
          'Member',
          booking.user.email,
          booking.user.phone || 'N/A',
          memberMeals.mainCourse || 'N/A',
          memberMeals.dessert || 'N/A'
        ])

        // Guest rows
        guests.forEach((guest: Guest, guestIndex: number) => {
          const guestMeal = guestMeals[guestIndex] || {}
          bookingDetails.push([
            '',
            guest.name,
            '',
            'Guest',
            guest.email || 'N/A',
            guest.phone || 'N/A',
            guestMeal.mainCourse || 'N/A',
            guestMeal.dessert || 'N/A'
          ])
        })
      })

      autoTable(doc, {
        startY: yPosition,
        head: [['#', 'Name', 'Member #', 'Type', 'Email', 'Phone', 'Main Course', 'Dessert']],
        body: bookingDetails,
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 35 },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 45 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 }
        },
        margin: { left: 5, right: 5 },
        didDrawPage: (data) => {
          // Add page numbers
          const pageCount = (doc as any).internal.getNumberOfPages()
          const pageSize = doc.internal.pageSize
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
          
          doc.setFontSize(10)
          doc.setTextColor(textColor[0], textColor[1], textColor[2])
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            pageSize.width - 30,
            pageHeight - 10,
            { align: 'right' }
          )
          
          // Add generation timestamp
          doc.text(
            `Generated: ${new Date().toLocaleString('en-GB')}`,
            20,
            pageHeight - 10
          )
        }
      })

      // Save the PDF
      const fileName = `${outing.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_booking_summary_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      className="bg-red-600 hover:bg-red-700 text-white"
      size="sm"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Generate PDF Report</span>
          <span className="sm:hidden">PDF</span>
        </>
      )}
    </Button>
  )
} 