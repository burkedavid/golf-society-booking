# Irish Golf Society Scotland - Booking System

A comprehensive golf society management system built with Next.js, featuring member and admin dashboards, individual meal selection, booking management, and mobile-optimized design.

![Golf Society Logo](public/image-640x886.png)

## 🏌️ Features

### 📱 **Mobile-Optimized Member Experience**
- **Responsive Dashboard** - Mobile-first design with touch-friendly interfaces
- **Booking System** - Complete golf outing booking with individual meal selection
- **Bank Transfer Integration** - Automated payment details with copy-to-clipboard functionality
- **Professional Sign-in** - Mobile-optimized authentication with demo accounts

### 💼 **Admin Management System**
- **Dashboard Overview** - Statistics, recent bookings, and system insights
- **Booking Management** - View, edit, and manage all member bookings
- **Member Management** - Complete member profiles with handicap tracking and password reset
- **Outing Creation** - Create outings with custom menus and pricing
- **Meal Coordination** - Detailed meal summaries for golf club catering

### 🍽️ **Advanced Meal System**
- **Individual Selection** - Separate meal choices for members and each guest
- **Main Course & Dessert** - Complete menu management system
- **Dietary Requirements** - Special requests and allergy tracking
- **Catering Reports** - Meal totals and percentages for kitchen planning

### 🎯 **Key Capabilities**
- **Real-time Availability** - Live capacity tracking and space management
- **Payment Tracking** - Bank transfer integration with unique booking references
- **Professional Design** - Golf-themed UI with Irish Golf Society branding
- **PostgreSQL Database** - Production-ready with Neon hosting
- **Vercel Deployment** - Optimized for serverless deployment

## 🚀 Quick Start (Baby Steps)

### Step 1: Prerequisites
Make sure you have these installed:
```bash
# Check if you have Node.js (version 18 or higher)
node --version

# Check if you have npm
npm --version

# Check if you have Git
git --version
```

If you don't have them:
- **Node.js**: Download from [nodejs.org](https://nodejs.org/)
- **Git**: Download from [git-scm.com](https://git-scm.com/)

### Step 2: Clone the Repository
```bash
# Clone the project
git clone https://github.com/burkedavid/golf-society-booking.git

# Navigate to the project folder
cd golf-society-booking
```

### Step 3: Install Dependencies
```bash
# Install all required packages (this might take a few minutes)
npm install
```

### Step 4: Set Up Environment Variables
```bash
# Copy the example environment file
copy .env.example .env.local
```

**Edit `.env.local` with your settings:**
```env
# For local development with PostgreSQL (recommended)
DATABASE_URL="postgresql://neondb_owner:npg_6brHkOd1LBeR@ep-aged-queen-abbvbz3u-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"

# For local development only
NEXTAUTH_URL="http://localhost:3000"

# Generate a secure secret (or use the provided one for testing)
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production-12345678901234567890"
```

### Step 5: Set Up the Database
```bash
# Create database tables
npm run db:push

# Seed the database with sample data
npm run db:seed
```

You should see:
```
Database seeded successfully!
Admin login: admin@irishgolfsocietyscotland.com / admin123
Member login: seamus@email.com / member123
```

### Step 6: Start the Development Server
```bash
# Start the local server
npm run dev
```

The app will be available at: **http://localhost:3000**

### Step 7: Test the System
1. **Open your browser** to `http://localhost:3000`
2. **Sign in as Admin:**
   - Email: `admin@irishgolfsocietyscotland.com`
   - Password: `admin123`
3. **Sign in as Member:**
   - Email: `seamus@email.com`
   - Password: `member123`

## 📱 Mobile Testing

To test the mobile experience:
1. **Open browser developer tools** (F12)
2. **Click the mobile device icon** (responsive design mode)
3. **Select a mobile device** (iPhone, Android, etc.)
4. **Test the member experience** - dashboard, booking, sign-in

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI primitives
- **Hosting**: Vercel (production), Neon (database)
- **Authentication**: NextAuth.js with credentials provider

## 📊 Database Schema

### Users Table
- Member profiles with handicap tracking
- Admin and member role management
- Contact information and member numbers

### Outings Table
- Golf outing details (venue, date, pricing)
- Capacity management and registration deadlines
- Custom menu options (main courses and desserts)

### Bookings Table
- Member and guest information
- Individual meal selections for all participants
- Payment status and booking confirmation

## 🎨 Design Features

### Golf-Themed UI
- **Professional Color Scheme**: Rich greens, blues, and emerald tones
- **Irish Golf Society Branding**: Logo integration throughout
- **Responsive Design**: Mobile-first approach with desktop optimization

### Mobile Optimizations
- **Touch-Friendly Buttons**: Minimum 44px touch targets
- **Responsive Typography**: Scales from mobile to desktop
- **Flexible Layouts**: Stack vertically on mobile, grid on desktop
- **Optimized Forms**: Large input fields and dropdowns for mobile

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Update database schema
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🌐 Deployment

### Vercel Deployment

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Set Environment Variables:**
   ```env
   DATABASE_URL=postgresql://your-neon-connection-string
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secure-secret-key
   ```

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Database tables will be created automatically

### Database Setup (Neon)

1. **Create Neon Account:** [neon.tech](https://neon.tech)
2. **Create Database:** Choose PostgreSQL 17, AWS Europe West 2 (London)
3. **Copy Connection String:** Use in `DATABASE_URL`

## 👥 User Accounts

### Test Accounts (Seeded Data)

**Administrator:**
- Email: `admin@irishgolfsocietyscotland.com`
- Password: `admin123`
- Access: Full system management

**Member:**
- Email: `seamus@email.com`
- Password: `member123`
- Access: Booking and profile management

### Sample Outings

1. **Loch Lomond (Carrick Golf Course)**
   - Date: Friday, June 20, 2025
   - Pricing: £90 members, £105 guests
   - Menu: Full Scottish golf club menu

2. **Cruden Bay Golf Club**
   - Date: Friday, August 29, 2025
   - Pricing: TBC
   - Menu: Traditional Scottish options

## 🔐 Security Features

- **NextAuth.js Authentication**: Secure session management
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access**: Admin and member permission levels
- **Environment Variables**: Secure configuration management

## 📱 Mobile Features

### Member Dashboard
- **Responsive Cards**: Stack vertically on mobile
- **Touch-Friendly Buttons**: Full-width booking buttons
- **Optimized Info Display**: Clean, readable layout

### Booking Form
- **Large Form Fields**: Easy touch input
- **Responsive Dropdowns**: Mobile-optimized selectors
- **Guest Management**: Easy addition and meal selection

### Bank Transfer Modal
- **Copy Functionality**: One-tap copying of bank details
- **Mobile Layout**: Stacked information for easy reading
- **Professional Design**: Branded and trustworthy appearance

## 🎯 Business Features

### For Golf Clubs
- **Meal Planning**: Exact dish counts and percentages
- **Capacity Management**: Real-time availability tracking
- **Member Information**: Handicaps and dietary requirements

### For Society Admins
- **Booking Overview**: Complete booking management
- **Member Management**: Profile updates and password resets
- **Financial Tracking**: Payment status monitoring

### For Members
- **Easy Booking**: Streamlined reservation process
- **Mobile Access**: Book from anywhere on any device
- **Payment Integration**: Clear bank transfer instructions

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Make sure your .env file has the correct DATABASE_URL
# Copy from .env.example and update with your Neon connection string
```

**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Port Already in Use:**
```bash
# Next.js will automatically try ports 3001, 3002, etc.
# Or specify a different port:
npm run dev -- -p 3001
```

**Environment Variables Not Loading:**
```bash
# Make sure your file is named .env.local (not .env.txt)
# Restart the development server after changes
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the terminal output for specific error messages
3. Ensure all environment variables are correctly set
4. Verify database connection and seeding

## 🎉 What's Included

This system provides everything needed for a professional golf society:

✅ **Member Management** - Complete profiles and handicap tracking  
✅ **Booking System** - Individual meal selection for all participants  
✅ **Admin Dashboard** - Full management capabilities  
✅ **Mobile Experience** - Optimized for phones and tablets  
✅ **Payment Integration** - Bank transfer with automated details  
✅ **Meal Coordination** - Detailed reports for golf clubs  
✅ **Professional Design** - Golf-themed and branded interface  
✅ **Production Ready** - Deployed on Vercel with PostgreSQL  

The system is designed to handle real golf society operations with professional presentation and complete functionality for both members and administrators. 