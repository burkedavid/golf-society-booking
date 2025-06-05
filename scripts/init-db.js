const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

async function initDatabase() {
  try {
    // Create the database file if it doesn't exist
    const dbPath = path.join(process.cwd(), 'dev.db')
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, '')
      console.log('Created database file')
    }

    const prisma = new PrismaClient()
    
    // Test the connection
    await prisma.$connect()
    console.log('Database connection successful')
    
    await prisma.$disconnect()
  } catch (error) {
    console.log('Database initialization skipped:', error.message)
  }
}

initDatabase() 