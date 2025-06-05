import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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

  // Create outings
  const springTournament = await prisma.outing.upsert({
    where: { id: 'spring-tournament-2025' },
    update: {},
    create: {
      id: 'spring-tournament-2025',
      name: 'Spring Tournament at Gleneagles',
      description: 'Annual spring tournament at prestigious Gleneagles',
      date: new Date('2025-03-15'),
      time: '09:00',
      venue: 'Gleneagles Golf Course, Perthshire',
      capacity: 40,
      memberPrice: 85.00,
      guestPrice: 95.00,
      registrationDeadline: new Date('2025-03-10T23:59:59Z'),
      status: 'open'
    }
  })

  const summerClassic = await prisma.outing.upsert({
    where: { id: 'summer-classic-2025' },
    update: {},
    create: {
      id: 'summer-classic-2025',
      name: 'Summer Classic at St Andrews',
      description: 'Experience the home of golf at St Andrews Links',
      date: new Date('2025-06-20'),
      time: '08:30',
      venue: 'St Andrews Old Course, Fife',
      capacity: 32,
      memberPrice: 120.00,
      guestPrice: 140.00,
      registrationDeadline: new Date('2025-06-15T23:59:59Z'),
      status: 'open'
    }
  })

  // Create menus
  const springMenu = await prisma.menu.upsert({
    where: { outingId: springTournament.id },
    update: {},
    create: {
      outingId: springTournament.id,
      lunchOptions: JSON.stringify([
        {
          id: 'fish-chips',
          name: 'Fish & Chips',
          description: 'Fresh haddock with hand-cut chips',
          dietary: [],
          allergens: ['fish', 'gluten']
        },
        {
          id: 'steak-pie',
          name: 'Steak & Kidney Pie',
          description: 'Traditional Scottish pie with seasonal vegetables',
          dietary: [],
          allergens: ['gluten']
        },
        {
          id: 'caesar-salad',
          name: 'Caesar Salad',
          description: 'Crisp romaine lettuce with parmesan and croutons',
          dietary: ['vegetarian'],
          allergens: ['dairy', 'gluten']
        }
      ]),
      dinnerOptions: JSON.stringify([
        {
          id: 'beef-wellington',
          name: 'Beef Wellington',
          description: 'Prime beef fillet wrapped in puff pastry',
          dietary: [],
          allergens: ['gluten', 'dairy']
        },
        {
          id: 'salmon-fillet',
          name: 'Pan-Seared Salmon',
          description: 'Scottish salmon with lemon butter sauce',
          dietary: [],
          allergens: ['fish', 'dairy']
        },
        {
          id: 'vegetarian-wellington',
          name: 'Vegetarian Wellington',
          description: 'Roasted vegetables and nuts in puff pastry',
          dietary: ['vegetarian'],
          allergens: ['gluten', 'nuts', 'dairy']
        }
      ])
    }
  })

  const summerMenu = await prisma.menu.upsert({
    where: { outingId: summerClassic.id },
    update: {},
    create: {
      outingId: summerClassic.id,
      lunchOptions: JSON.stringify([
        {
          id: 'club-sandwich',
          name: 'Club Sandwich',
          description: 'Triple-decker with chicken, bacon, and salad',
          dietary: [],
          allergens: ['gluten', 'dairy']
        },
        {
          id: 'soup-sandwich',
          name: 'Soup & Sandwich',
          description: 'Daily soup with artisan bread roll',
          dietary: ['vegetarian'],
          allergens: ['gluten', 'dairy']
        }
      ]),
      dinnerOptions: JSON.stringify([
        {
          id: 'haggis-neeps',
          name: 'Haggis, Neeps & Tatties',
          description: 'Traditional Scottish dish with whisky sauce',
          dietary: [],
          allergens: ['gluten']
        },
        {
          id: 'sea-bass',
          name: 'Sea Bass Fillet',
          description: 'Pan-fried with herb crust and vegetables',
          dietary: [],
          allergens: ['fish']
        },
        {
          id: 'mushroom-risotto',
          name: 'Wild Mushroom Risotto',
          description: 'Creamy arborio rice with seasonal mushrooms',
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 