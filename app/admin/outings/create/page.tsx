'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Calendar, MapPin, Users, PoundSterling, Utensils, Plus, X } from 'lucide-react'

// Common menu items that golf courses typically offer
const COMMON_MAIN_COURSES = [
  {
    name: 'Clubhouse Steak Pie',
    description: 'Seasonal vegetables, Gravy, Fries',
    allergens: ['gluten', 'dairy']
  },
  {
    name: 'Roasted Chicken Breast',
    description: 'Dauphinoise Potatoes, Roasted Root Vegetables, Pepper Jus',
    allergens: ['dairy']
  },
  {
    name: 'Chef\'s Macaroni Cheese (V)',
    description: 'Garlic Bread',
    allergens: ['gluten', 'dairy']
  },
  {
    name: 'Fish & Chips',
    description: 'Beer battered fish with hand-cut chips and mushy peas',
    allergens: ['fish', 'gluten']
  },
  {
    name: 'Aberdeen Angus Steak',
    description: 'Prime Aberdeen Angus sirloin with peppercorn sauce',
    allergens: ['dairy']
  },
  {
    name: 'Pan-Seared Salmon',
    description: 'Fresh Scottish salmon with lemon butter sauce',
    allergens: ['fish', 'dairy']
  },
  {
    name: 'Vegetarian Wellington',
    description: 'Roasted vegetables in puff pastry with red wine jus',
    allergens: ['gluten', 'dairy']
  }
]

const COMMON_DESSERTS = [
  {
    name: 'Sticky Toffee Pudding',
    description: 'Salted Caramel, Vanilla Ice Cream',
    allergens: ['gluten', 'dairy', 'eggs']
  },
  {
    name: 'Chocolate Brownie',
    description: 'Salted Caramel Ice Cream',
    allergens: ['gluten', 'dairy', 'eggs']
  },
  {
    name: 'Selection of Ice Cream or Sorbets (V)',
    description: 'Fresh Berries',
    allergens: ['dairy']
  },
  {
    name: 'Traditional Cranachan',
    description: 'Scottish raspberries, toasted oats, honey and whisky cream',
    allergens: ['dairy', 'gluten']
  },
  {
    name: 'Apple Crumble',
    description: 'Warm apple crumble with custard or cream',
    allergens: ['gluten', 'dairy']
  },
  {
    name: 'Cheesecake',
    description: 'Classic cheesecake with berry compote',
    allergens: ['dairy', 'gluten', 'eggs']
  },
  {
    name: 'Scottish Cheese Selection',
    description: 'Selection of local cheeses with oatcakes and chutney',
    allergens: ['dairy', 'gluten']
  }
]

interface MenuItem {
  name: string
  description: string
  allergens: string[]
}

export default function CreateOutingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    capacity: '',
    memberPrice: '',
    guestPrice: '',
    registrationDeadline: ''
  })

  const [selectedMainCourses, setSelectedMainCourses] = useState<MenuItem[]>([])
  const [selectedDesserts, setSelectedDesserts] = useState<MenuItem[]>([])
  const [customMainCourse, setCustomMainCourse] = useState({ name: '', description: '', allergens: '' })
  const [customDessert, setCustomDessert] = useState({ name: '', description: '', allergens: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addCommonMainCourse = (item: MenuItem) => {
    if (!selectedMainCourses.find(course => course.name === item.name)) {
      setSelectedMainCourses([...selectedMainCourses, item])
    }
  }

  const addCommonDessert = (item: MenuItem) => {
    if (!selectedDesserts.find(dessert => dessert.name === item.name)) {
      setSelectedDesserts([...selectedDesserts, item])
    }
  }

  const addCustomMainCourse = () => {
    if (customMainCourse.name.trim()) {
      const newItem: MenuItem = {
        name: customMainCourse.name,
        description: customMainCourse.description,
        allergens: customMainCourse.allergens.split(',').map(a => a.trim()).filter(a => a)
      }
      setSelectedMainCourses([...selectedMainCourses, newItem])
      setCustomMainCourse({ name: '', description: '', allergens: '' })
    }
  }

  const addCustomDessert = () => {
    if (customDessert.name.trim()) {
      const newItem: MenuItem = {
        name: customDessert.name,
        description: customDessert.description,
        allergens: customDessert.allergens.split(',').map(a => a.trim()).filter(a => a)
      }
      setSelectedDesserts([...selectedDesserts, newItem])
      setCustomDessert({ name: '', description: '', allergens: '' })
    }
  }

  const removeMainCourse = (index: number) => {
    setSelectedMainCourses(selectedMainCourses.filter((_, i) => i !== index))
  }

  const removeDessert = (index: number) => {
    setSelectedDesserts(selectedDesserts.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (selectedMainCourses.length === 0) {
      setError('Please add at least one main course option')
      setLoading(false)
      return
    }

    if (selectedDesserts.length === 0) {
      setError('Please add at least one dessert option')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/outings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity),
          memberPrice: parseFloat(formData.memberPrice),
          guestPrice: parseFloat(formData.guestPrice),
          date: new Date(formData.date).toISOString(),
          registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
          mainCourseOptions: selectedMainCourses,
          dessertOptions: selectedDesserts
        }),
      })

      if (response.ok) {
        router.push('/admin/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create outing')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mr-4 text-white hover:bg-green-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Outing</h1>
              <p className="text-green-100">Add a new golf outing for members to book</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Outing Details */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle>Outing Details</CardTitle>
              <CardDescription className="text-blue-100">
                Fill in the details for the new golf outing
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Outing Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Loch Lomond Golf Club"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of the outing..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="venue">Venue *</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        placeholder="Golf course name and location"
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="capacity">Capacity *</Label>
                    <div className="relative mt-1">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="capacity"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        placeholder="Maximum number of players"
                        required
                        min="1"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="date">Outing Date *</Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="time">Tee Time *</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="memberPrice">Member Price (£) *</Label>
                    <div className="relative mt-1">
                      <PoundSterling className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="memberPrice"
                        name="memberPrice"
                        type="number"
                        step="0.01"
                        value={formData.memberPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        required
                        min="0"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="guestPrice">Guest Price (£) *</Label>
                    <div className="relative mt-1">
                      <PoundSterling className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="guestPrice"
                        name="guestPrice"
                        type="number"
                        step="0.01"
                        value={formData.guestPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        required
                        min="0"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Registration Deadline */}
                <div>
                  <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                  <Input
                    id="registrationDeadline"
                    name="registrationDeadline"
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Members won't be able to book after this date and time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Management */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Utensils className="w-6 h-6 mr-3" />
                Menu Options
              </CardTitle>
              <CardDescription className="text-orange-100">
                Select from common options or add custom menu items
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {/* Main Courses */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Main Courses *</h3>
                  
                  {/* Common Main Courses */}
                  <div className="mb-6">
                    <Label className="text-base font-medium">Quick Add - Common Options</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {COMMON_MAIN_COURSES.map((item, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          onClick={() => addCommonMainCourse(item)}
                          className="h-auto p-3 text-left justify-start hover:bg-green-50 min-h-[80px]"
                          disabled={selectedMainCourses.some(course => course.name === item.name)}
                        >
                          <Plus className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm leading-tight mb-1 break-words">{item.name}</div>
                            <div className="text-xs text-gray-500 leading-tight break-words line-clamp-2">{item.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Main Course */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <Label className="text-base font-medium">Add Custom Main Course</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      <Input
                        placeholder="Dish name"
                        value={customMainCourse.name}
                        onChange={(e) => setCustomMainCourse({...customMainCourse, name: e.target.value})}
                      />
                      <Input
                        placeholder="Description"
                        value={customMainCourse.description}
                        onChange={(e) => setCustomMainCourse({...customMainCourse, description: e.target.value})}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Allergens (comma separated)"
                          value={customMainCourse.allergens}
                          onChange={(e) => setCustomMainCourse({...customMainCourse, allergens: e.target.value})}
                        />
                        <Button type="button" onClick={addCustomMainCourse} disabled={!customMainCourse.name.trim()}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Selected Main Courses */}
                  <div>
                    <Label className="text-base font-medium">Selected Main Courses ({selectedMainCourses.length})</Label>
                    <div className="space-y-2 mt-2">
                      {selectedMainCourses.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.description}</div>
                            {item.allergens.length > 0 && (
                              <div className="text-xs text-orange-600">Allergens: {item.allergens.join(', ')}</div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMainCourse(index)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {selectedMainCourses.length === 0 && (
                        <p className="text-gray-500 italic">No main courses selected yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desserts */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Desserts *</h3>
                  
                  {/* Common Desserts */}
                  <div className="mb-6">
                    <Label className="text-base font-medium">Quick Add - Common Options</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {COMMON_DESSERTS.map((item, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          onClick={() => addCommonDessert(item)}
                          className="h-auto p-3 text-left justify-start hover:bg-purple-50 min-h-[80px]"
                          disabled={selectedDesserts.some(dessert => dessert.name === item.name)}
                        >
                          <Plus className="w-4 h-4 mr-2 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm leading-tight mb-1 break-words">{item.name}</div>
                            <div className="text-xs text-gray-500 leading-tight break-words line-clamp-2">{item.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Dessert */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <Label className="text-base font-medium">Add Custom Dessert</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      <Input
                        placeholder="Dessert name"
                        value={customDessert.name}
                        onChange={(e) => setCustomDessert({...customDessert, name: e.target.value})}
                      />
                      <Input
                        placeholder="Description"
                        value={customDessert.description}
                        onChange={(e) => setCustomDessert({...customDessert, description: e.target.value})}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Allergens (comma separated)"
                          value={customDessert.allergens}
                          onChange={(e) => setCustomDessert({...customDessert, allergens: e.target.value})}
                        />
                        <Button type="button" onClick={addCustomDessert} disabled={!customDessert.name.trim()}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Selected Desserts */}
                  <div>
                    <Label className="text-base font-medium">Selected Desserts ({selectedDesserts.length})</Label>
                    <div className="space-y-2 mt-2">
                      {selectedDesserts.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.description}</div>
                            {item.allergens.length > 0 && (
                              <div className="text-xs text-orange-600">Allergens: {item.allergens.join(', ')}</div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDessert(index)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {selectedDesserts.length === 0 && (
                        <p className="text-gray-500 italic">No desserts selected yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {loading ? 'Creating...' : 'Create Outing'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 