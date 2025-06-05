const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@irishgolfsocietyscotland.com' },
    update: {},
    create: {
      email: 'admin@irishgolfsocietyscotland.com',
      passwordHash: adminPassword,
      name: 'Admin McLoughlin',
      memberNumber: 'ADM001',
      handicap: 18,
      role: 'admin',
      phone: '07700 900000'
    }
  })

  // Create member users
  const memberPassword = await bcrypt.hash('member123', 12)
  
  const seamus = await prisma.user.upsert({
    where: { email: 'seamus@email.com' },
    update: {},
    create: {
      email: 'seamus@email.com',
      passwordHash: memberPassword,
      name: 'Seamus O\'Connor',
      memberNumber: 'IGS001',
      handicap: 12,
      phone: '07700 900123'
    }
  })

  const paddy = await prisma.user.upsert({
    where: { email: 'paddy@email.com' },
    update: {},
    create: {
      email: 'paddy@email.com',
      passwordHash: memberPassword,
      name: 'Paddy Murphy',
      memberNumber: 'IGS002',
      handicap: 24,
      phone: '07700 900124'
    }
  })

  const brendan = await prisma.user.upsert({
    where: { email: 'brendan@email.com' },
    update: {},
    create: {
      email: 'brendan@email.com',
      passwordHash: memberPassword,
      name: 'Brendan Kelly',
      memberNumber: 'IGS003',
      handicap: 8,
      phone: '07700 900125'
    }
  })

  // Create outings with realistic upcoming dates
  const lochLomondOuting = await prisma.outing.upsert({
    where: { id: 'loch-lomond-june-2025' },
    update: {
      name: 'Loch Lomond (Carrick Golf Course)',
      description: 'Scenic golf experience at Loch Lomond with excellent clubhouse dining',
      date: new Date('2025-06-20'),
      time: '13:00',
      venue: 'Loch Lomond, Cameron House, G83 8QZ',
      capacity: 44,
      memberPrice: 90.00,
      guestPrice: 105.00,
      registrationDeadline: new Date('2025-06-15T23:59:59Z'),
      status: 'open'
    },
    create: {
      id: 'loch-lomond-june-2025',
      name: 'Loch Lomond (Carrick Golf Course)',
      description: 'Scenic golf experience at Loch Lomond with excellent clubhouse dining',
      date: new Date('2025-06-20'),
      time: '13:00',
      venue: 'Loch Lomond, Cameron House, G83 8QZ',
      capacity: 44,
      memberPrice: 90.00,
      guestPrice: 105.00,
      registrationDeadline: new Date('2025-06-15T23:59:59Z'),
      status: 'open'
    }
  })

  const crudenBayOuting = await prisma.outing.upsert({
    where: { id: 'cruden-bay-august-2025' },
    update: {
      name: 'Cruden Bay Golf Club',
      description: 'Championship links golf on the dramatic Aberdeenshire coast',
      date: new Date('2025-08-29'),
      time: '10:00',
      venue: 'Cruden Bay Golf Club, Peterhead AB42 0NN',
      capacity: 40,
      memberPrice: 0.00,
      guestPrice: 0.00,
      registrationDeadline: new Date('2025-08-24T23:59:59Z'),
      status: 'open'
    },
    create: {
      id: 'cruden-bay-august-2025',
      name: 'Cruden Bay Golf Club',
      description: 'Championship links golf on the dramatic Aberdeenshire coast',
      date: new Date('2025-08-29'),
      time: '10:00',
      venue: 'Cruden Bay Golf Club, Peterhead AB42 0NN',
      capacity: 40,
      memberPrice: 0.00,
      guestPrice: 0.00,
      registrationDeadline: new Date('2025-08-24T23:59:59Z'),
      status: 'open'
    }
  })

  // Create menus with Main Course and Dessert options
  const lochLomondMenu = await prisma.menu.upsert({
    where: { outingId: lochLomondOuting.id },
    update: {},
    create: {
      outingId: lochLomondOuting.id,
      mainCourseOptions: JSON.stringify([
        {
          id: 'clubhouse-steak-pie',
          name: 'Clubhouse Steak Pie',
          description: 'Seasonal vegetables, Gravy, Fries',
          dietary: [],
          allergens: ['gluten', 'dairy']
        },
        {
          id: 'roasted-chicken-breast',
          name: 'Roasted Chicken Breast',
          description: 'Dauphinoise Potatoes, Roasted Root Vegetables, Pepper Jus',
          dietary: [],
          allergens: ['dairy']
        },
        {
          id: 'chefs-macaroni-cheese',
          name: 'Chef\'s Macaroni Cheese (V)',
          description: 'Garlic Bread',
          dietary: ['vegetarian'],
          allergens: ['gluten', 'dairy']
        }
      ]),
      dessertOptions: JSON.stringify([
        {
          id: 'sticky-toffee-pudding',
          name: 'Sticky Toffee Pudding',
          description: 'Salted Caramel, Vanilla Ice Cream',
          dietary: ['vegetarian'],
          allergens: ['gluten', 'dairy', 'eggs']
        },
        {
          id: 'chocolate-brownie',
          name: 'Chocolate Brownie',
          description: 'Salted Caramel Ice Cream',
          dietary: ['vegetarian'],
          allergens: ['gluten', 'dairy', 'eggs']
        },
        {
          id: 'ice-cream-sorbets',
          name: 'Selection of Ice Cream or Sorbets (V)',
          description: 'Fresh Berries',
          dietary: ['vegetarian'],
          allergens: ['dairy']
        }
      ])
    }
  })

  const crudenBayMenu = await prisma.menu.upsert({
    where: { outingId: crudenBayOuting.id },
    update: {},
    create: {
      outingId: crudenBayOuting.id,
      mainCourseOptions: JSON.stringify([
        {
          id: 'aberdeen-angus',
          name: 'Aberdeen Angus Steak',
          description: 'Prime Aberdeen Angus sirloin with peppercorn sauce and hand-cut chips',
          dietary: [],
          allergens: ['dairy']
        },
        {
          id: 'north-sea-haddock',
          name: 'North Sea Haddock',
          description: 'Fresh North Sea haddock with parsley sauce and new potatoes',
          dietary: [],
          allergens: ['fish', 'dairy']
        },
        {
          id: 'cullen-skink-chicken',
          name: 'Chicken with Cullen Skink Sauce',
          description: 'Roasted chicken breast with traditional Cullen Skink inspired cream sauce',
          dietary: [],
          allergens: ['fish', 'dairy']
        },
        {
          id: 'root-vegetable-wellington',
          name: 'Roasted Root Vegetable Wellington',
          description: 'Seasonal root vegetables in puff pastry with red wine jus',
          dietary: ['vegetarian'],
          allergens: ['gluten', 'dairy']
        },
        {
          id: 'lamb-shank',
          name: 'Slow-Braised Lamb Shank',
          description: 'Tender lamb shank with rosemary and garlic, served with mashed neeps',
          dietary: [],
          allergens: ['dairy']
        }
      ]),
      dessertOptions: JSON.stringify([
        {
          id: 'butteries-pudding',
          name: 'Aberdeen Butteries Bread Pudding',
          description: 'Traditional bread pudding made with Aberdeen butteries and custard',
          dietary: ['vegetarian'],
          allergens: ['gluten', 'dairy', 'eggs']
        },
        {
          id: 'oatcake-cheesecake',
          name: 'Oatcake Cheesecake',
          description: 'Creamy cheesecake with crushed oatcake base and berry compote',
          dietary: ['vegetarian'],
          allergens: ['dairy', 'gluten', 'eggs']
        },
        {
          id: 'sea-buckthorn-mousse',
          name: 'Sea Buckthorn Mousse',
          description: 'Light mousse made with local sea buckthorn berries',
          dietary: ['vegetarian'],
          allergens: ['dairy', 'eggs']
        },
        {
          id: 'apple-blackberry-crumble',
          name: 'Apple & Blackberry Crumble',
          description: 'Traditional crumble with local apples and blackberries, served with cream',
          dietary: ['vegetarian'],
          allergens: ['gluten', 'dairy']
        },
        {
          id: 'scottish-tablet',
          name: 'Homemade Scottish Tablet',
          description: 'Traditional Scottish tablet with vanilla ice cream',
          dietary: ['vegetarian'],
          allergens: ['dairy']
        }
      ])
    }
  })

  console.log('Database seeded successfully!')
  console.log('Admin login: admin@irishgolfsocietyscotland.com / admin123')
  console.log('Member login: seamus@email.com / member123')
  console.log('Member login: paddy@email.com / member123')
  console.log('Member login: brendan@email.com / member123')
  console.log('')
  console.log('Upcoming Outings:')
  console.log('1. Loch Lomond (Carrick Golf Course) - Friday 20th June 2025 - £90/£105')
  console.log('2. Cruden Bay Golf Club - Friday 29th August 2025 - TBC')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 