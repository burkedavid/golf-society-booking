const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const COMMON_MAIN_COURSES = [
  {
    name: 'Clubhouse Steak Pie',
    description: 'Seasonal vegetables, Gravy, Fries',
    allergens: JSON.stringify(['gluten', 'dairy']),
    sortOrder: 1
  },
  {
    name: 'Roasted Chicken Breast',
    description: 'Dauphinoise Potatoes, Roasted Root Vegetables, Pepper Jus',
    allergens: JSON.stringify(['dairy']),
    sortOrder: 2
  },
  {
    name: 'Chef\'s Macaroni Cheese (V)',
    description: 'Garlic Bread',
    allergens: JSON.stringify(['gluten', 'dairy']),
    sortOrder: 3
  },
  {
    name: 'Fish & Chips',
    description: 'Beer battered fish with hand-cut chips and mushy peas',
    allergens: JSON.stringify(['fish', 'gluten']),
    sortOrder: 4
  },
  {
    name: 'Aberdeen Angus Steak',
    description: 'Prime Aberdeen Angus sirloin with peppercorn sauce',
    allergens: JSON.stringify(['dairy']),
    sortOrder: 5
  },
  {
    name: 'Pan-Seared Salmon',
    description: 'Fresh Scottish salmon with lemon butter sauce',
    allergens: JSON.stringify(['fish', 'dairy']),
    sortOrder: 6
  },
  {
    name: 'Vegetarian Wellington',
    description: 'Roasted vegetables in puff pastry with red wine jus',
    allergens: JSON.stringify(['gluten', 'dairy']),
    sortOrder: 7
  }
]

const COMMON_DESSERTS = [
  {
    name: 'Sticky Toffee Pudding',
    description: 'Salted Caramel, Vanilla Ice Cream',
    allergens: JSON.stringify(['gluten', 'dairy', 'eggs']),
    sortOrder: 1
  },
  {
    name: 'Chocolate Brownie',
    description: 'Salted Caramel Ice Cream',
    allergens: JSON.stringify(['gluten', 'dairy', 'eggs']),
    sortOrder: 2
  },
  {
    name: 'Selection of Ice Cream or Sorbets (V)',
    description: 'Fresh Berries',
    allergens: JSON.stringify(['dairy']),
    sortOrder: 3
  },
  {
    name: 'Traditional Cranachan',
    description: 'Scottish raspberries, toasted oats, honey and whisky cream',
    allergens: JSON.stringify(['dairy', 'gluten']),
    sortOrder: 4
  },
  {
    name: 'Apple Crumble',
    description: 'Warm apple crumble with custard or cream',
    allergens: JSON.stringify(['gluten', 'dairy']),
    sortOrder: 5
  },
  {
    name: 'Cheesecake',
    description: 'Classic cheesecake with berry compote',
    allergens: JSON.stringify(['dairy', 'gluten', 'eggs']),
    sortOrder: 6
  },
  {
    name: 'Scottish Cheese Selection',
    description: 'Selection of local cheeses with oatcakes and chutney',
    allergens: JSON.stringify(['dairy', 'gluten']),
    sortOrder: 7
  }
]

async function seedMenuOptions() {
  try {
    console.log('🌱 Seeding common menu options...')

    // Clear existing data
    await prisma.commonMainCourse.deleteMany()
    await prisma.commonDessert.deleteMany()

    // Seed main courses
    console.log('📝 Adding main courses...')
    for (const course of COMMON_MAIN_COURSES) {
      await prisma.commonMainCourse.create({
        data: course
      })
    }

    // Seed desserts
    console.log('🍰 Adding desserts...')
    for (const dessert of COMMON_DESSERTS) {
      await prisma.commonDessert.create({
        data: dessert
      })
    }

    console.log('✅ Menu options seeded successfully!')
    console.log(`📊 Added ${COMMON_MAIN_COURSES.length} main courses and ${COMMON_DESSERTS.length} desserts`)

  } catch (error) {
    console.error('❌ Error seeding menu options:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedMenuOptions()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = { seedMenuOptions } 