'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Edit, Trash2, Utensils, ChefHat, Save, X } from 'lucide-react'

// Simple toast replacement
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  alert(`${type.toUpperCase()}: ${message}`)
}

interface MenuItem {
  id: string
  name: string
  description: string
  allergens: string[]
  isActive: boolean
  sortOrder: number
}

interface MenuData {
  mainCourses: MenuItem[]
  desserts: MenuItem[]
}

export default function MenuOptionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [menuData, setMenuData] = useState<MenuData>({ mainCourses: [], desserts: [] })
  const [editingItem, setEditingItem] = useState<{ type: 'main' | 'dessert', item: MenuItem | null }>({ type: 'main', item: null })
  const [showAddForm, setShowAddForm] = useState<{ type: 'main' | 'dessert' | null }>({ type: null })

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    allergens: ''
  })

  useEffect(() => {
    fetchMenuOptions()
  }, [])

  const fetchMenuOptions = async () => {
    try {
      const response = await fetch('/api/admin/menu-options')
      if (response.ok) {
        const data = await response.json()
        setMenuData(data)
      } else {
        showToast('Failed to fetch menu options')
      }
    } catch (error) {
      console.error('Error fetching menu options:', error)
      showToast('Failed to fetch menu options')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      showToast('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const allergens = formData.allergens.split(',').map(a => a.trim()).filter(a => a)
      
      if (editingItem.item) {
        // Update existing item
        const response = await fetch(`/api/admin/menu-options/${editingItem.item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: editingItem.type,
            name: formData.name,
            description: formData.description,
            allergens
          })
        })

        if (response.ok) {
          showToast('Menu option updated successfully')
          fetchMenuOptions()
          setEditingItem({ type: 'main', item: null })
        } else {
          showToast('Failed to update menu option', 'error')
        }
      } else {
        // Create new item
        const response = await fetch('/api/admin/menu-options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: showAddForm.type,
            name: formData.name,
            description: formData.description,
            allergens
          })
        })

        if (response.ok) {
          showToast('Menu option created successfully')
          fetchMenuOptions()
          setShowAddForm({ type: null })
        } else {
          showToast('Failed to create menu option', 'error')
        }
      }

      setFormData({ name: '', description: '', allergens: '' })
    } catch (error) {
      console.error('Error saving menu option:', error)
      showToast('Failed to save menu option', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (type: 'main' | 'dessert', item: MenuItem) => {
    setEditingItem({ type, item })
    setFormData({
      name: item.name,
      description: item.description,
      allergens: item.allergens.join(', ')
    })
    setShowAddForm({ type: null })
  }

  const handleDelete = async (type: 'main' | 'dessert', id: string) => {
    if (!confirm('Are you sure you want to delete this menu option?')) return

    try {
      const response = await fetch(`/api/admin/menu-options/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })

      if (response.ok) {
        showToast('Menu option deleted successfully')
        fetchMenuOptions()
      } else {
        showToast('Failed to delete menu option', 'error')
      }
    } catch (error) {
      console.error('Error deleting menu option:', error)
      showToast('Failed to delete menu option', 'error')
    }
  }

  const handleAddNew = (type: 'main' | 'dessert') => {
    setShowAddForm({ type })
    setEditingItem({ type: 'main', item: null })
    setFormData({ name: '', description: '', allergens: '' })
  }

  const handleCancel = () => {
    setEditingItem({ type: 'main', item: null })
    setShowAddForm({ type: null })
    setFormData({ name: '', description: '', allergens: '' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading menu options...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
              <Utensils className="w-6 h-6 sm:w-8 sm:h-8 mr-3" />
              Manage Menu Options
            </h1>
            <p className="text-orange-100 mt-2">
              Manage common menu items that appear as quick-add options when creating outings
            </p>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm.type || editingItem.item) && (
          <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                {editingItem.item ? <Edit className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {editingItem.item ? 'Edit' : 'Add New'} {showAddForm.type === 'main' || editingItem.type === 'main' ? 'Main Course' : 'Dessert'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Clubhouse Steak Pie"
                  />
                </div>
                <div>
                  <Label htmlFor="allergens">Allergens (comma-separated)</Label>
                  <Input
                    id="allergens"
                    value={formData.allergens}
                    onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                    placeholder="e.g., gluten, dairy, nuts"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Seasonal vegetables, Gravy, Fries"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Courses */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <ChefHat className="w-5 h-5 mr-2" />
                    Main Courses ({menuData.mainCourses.length})
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Common main course options
                  </CardDescription>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAddNew('main')}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {menuData.mainCourses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No main courses added yet</p>
              ) : (
                <div className="space-y-3">
                  {menuData.mainCourses.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit('main', item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete('main', item.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      {item.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map((allergen) => (
                            <Badge key={allergen} variant="secondary" className="text-xs">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Desserts */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Utensils className="w-5 h-5 mr-2" />
                    Desserts ({menuData.desserts.length})
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Common dessert options
                  </CardDescription>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAddNew('dessert')}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {menuData.desserts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No desserts added yet</p>
              ) : (
                <div className="space-y-3">
                  {menuData.desserts.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit('dessert', item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete('dessert', item.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      {item.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map((allergen) => (
                            <Badge key={allergen} variant="secondary" className="text-xs">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 