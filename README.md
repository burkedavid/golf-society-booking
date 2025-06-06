# Irish Golf Society Scotland - Booking System

A comprehensive golf society management system built with Next.js, featuring member and admin dashboards, individual meal selection, booking management, member registration, and mobile-optimized design.

![Golf Society Logo](public/image-640x886.png)

## 🏌️ Features

### 📱 **Mobile-Optimized Member Experience**
- **Responsive Dashboard** - Mobile-first design with touch-friendly interfaces
- **Smart Booking System** - Complete golf outing booking with individual meal selection
- **Consolidated Information Display** - Streamlined booking status and progress tracking
- **Enhanced Desktop Layout** - Improved spacing and visual hierarchy for desktop users
- **Bank Transfer Integration** - Automated payment details with copy-to-clipboard functionality
- **Professional Sign-in/Sign-up** - Tabbed authentication with new member registration

### 🆕 **Member Registration System**
- **Self-Service Registration** - New members can sign up directly from the sign-in page
- **Flexible Profile Creation** - Email and password required, name/handicap/phone optional
- **Auto-Generated Member Numbers** - Sequential IGS member numbers (IGS001, IGS002, etc.)
- **Smart Defaults** - Default handicap of 28.0, "New Member" name if not provided
- **Profile Completion** - Members can update optional details after registration
- **Secure Password Handling** - bcrypt encryption for all passwords

### 💼 **Admin Management System**
- **Dashboard Overview** - Statistics, recent bookings, and system insights
- **Booking Management** - View, edit, and manage all member bookings
- **Member Management** - Complete member profiles with handicap tracking and password reset
- **Outing Creation** - Create outings with custom menus and pricing
- **Meal Coordination** - Detailed meal summaries for golf club catering
- **Enhanced UI** - Professional blue color scheme throughout admin interface

### 🍽️ **Advanced Meal System**
- **Individual Selection** - Separate meal choices for members and each guest
- **Main Course & Dessert** - Complete menu management system with seeded options
- **Dietary Requirements** - Special requests and allergy tracking
- **Catering Reports** - Meal totals and percentages for kitchen planning
- **Professional Styling** - Blue gradient styling for menu options

### 🎯 **Key Capabilities**
- **Real-time Availability** - Live capacity tracking and space management
- **Smart Progress Indicators** - Color-coded progress bars (green/yellow/red) based on capacity
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

# Seed the database with sample data and menu options
npm run db:seed
```

You should see:
```
Database seeded successfully!
Admin login: admin@irishgolfsocietyscotland.com / admin123
Member login: seamus@email.com / member123
Menu options seeded: 7 main courses, 7 desserts
```

### Step 6: Start the Development Server
```bash
# Start the local server
npm run dev
```

The app will be available at: **http://localhost:3000** (or next available port)

### Step 7: Test the System
1. **Open your browser** to `http://localhost:3000`
2. **Sign in as Admin:**
   - Email: `admin@irishgolfsocietyscotland.com`
   - Password: `admin123`
3. **Sign in as Member:**
   - Email: `seamus@email.com`
   - Password: `member123`
4. **Test Member Registration:**
   - Click "Sign Up" tab on sign-in page
   - Register a new member account

## 📱 Mobile Testing

To test the mobile experience:
1. **Open browser developer tools** (F12)
2. **Click the mobile device icon** (responsive design mode)
3. **Select a mobile device** (iPhone, Android, etc.)
4. **Test the member experience** - dashboard, booking, sign-in, registration

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Radix UI primitives
- **Authentication**: NextAuth.js with credentials provider + custom registration
- **Password Security**: bcryptjs for secure hashing
- **Form Validation**: Zod for schema validation
- **Hosting**: Vercel (production), Neon (database)

## 📊 Database Schema

### Users Table
- Member profiles with handicap tracking
- Admin and member role management
- Contact information and auto-generated member numbers
- Secure password storage with bcrypt hashing

### Outings Table
- Golf outing details (venue, date, pricing)
- Capacity management and registration deadlines
- Custom menu options (main courses and desserts)

### Bookings Table
- Member and guest information
- Individual meal selections for all participants
- Payment status and booking confirmation

### MenuOptions Table
- Main courses and desserts for outing menus
- Professional styling and categorization
- Seeded with sample Scottish golf club options

## 🎨 Design Features

### Golf-Themed UI
- **Professional Color Scheme**: Rich greens, blues, and emerald tones
- **Consistent Blue Styling**: Admin interface and menu options use professional blue gradients
- **Irish Golf Society Branding**: Logo integration throughout
- **Responsive Design**: Mobile-first approach with enhanced desktop optimization

### Mobile Optimizations
- **Touch-Friendly Buttons**: Minimum 44px touch targets
- **Responsive Typography**: Scales from mobile to desktop
- **Flexible Layouts**: Stack vertically on mobile, enhanced grid on desktop
- **Optimized Forms**: Large input fields and dropdowns for mobile
- **Tabbed Authentication**: Clean sign-in/sign-up interface

### Desktop Enhancements
- **Improved Spacing**: Enhanced grid gaps and padding for better visual hierarchy
- **Consolidated Information**: Reduced redundancy in booking status displays
- **Professional Layout**: Better use of desktop screen real estate
- **Enhanced Typography**: Larger text and better scaling for desktop viewing

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production (includes DB setup and seeding)
npm run start        # Start production server

# Database
npm run db:push      # Update database schema
npm run db:seed      # Seed database with sample data and menu options
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
   - Database tables will be created and seeded automatically

### 💰 Free Tier Hosting Costs

**✅ Completely Free Option:**
- **Vercel Free Tier**: Unlimited static deployments, 100GB bandwidth/month, 100GB-hours compute
- **Neon Free Tier**: 0.5GB PostgreSQL storage, sufficient for golf society data
- **Domain**: Optional ~$10-15/year (can use free vercel.app subdomain)
- **Total Cost**: $0-15/year

**⚠️ If You Outgrow Free Limits:**
- **Vercel Pro**: $20/month (team features, more bandwidth)
- **Neon Paid**: $19/month (more storage/compute)
- **Maximum Cost**: $39/month

**🎯 Perfect for Golf Societies:**
- Small user base (20-100 members)
- Seasonal usage patterns
- Simple data storage needs
- Should stay free indefinitely for typical golf society usage

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

### New Member Registration

**Self-Service Registration Available:**
- **Required Fields**: Email and password
- **Optional Fields**: Name, handicap, phone number
- **Auto-Generated**: Member numbers (IGS001, IGS002, etc.)
- **Default Values**: Name="New Member", handicap=28.0
- **Security**: Passwords encrypted with bcrypt

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
- **Input Validation**: Zod schema validation for all forms
- **Email Uniqueness**: Prevents duplicate registrations

## 📱 Mobile Features

### Member Dashboard
- **Responsive Cards**: Stack vertically on mobile, enhanced desktop grid
- **Touch-Friendly Buttons**: Full-width booking buttons
- **Optimized Info Display**: Clean, readable layout with consolidated information
- **Smart Progress Indicators**: Color-coded capacity tracking

### Authentication System
- **Tabbed Interface**: Clean sign-in/sign-up switching
- **Mobile-Optimized Forms**: Large input fields and touch-friendly buttons
- **Registration Flow**: Complete new member onboarding
- **Success Messaging**: Clear feedback and auto-redirect

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
- **New Member Oversight**: View and manage self-registered members

### For Members
- **Easy Registration**: Self-service account creation
- **Easy Booking**: Streamlined reservation process
- **Mobile Access**: Book from anywhere on any device
- **Payment Integration**: Clear bank transfer instructions
- **Profile Management**: Update details after registration

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

**Registration Issues:**
```bash
# Ensure database is properly seeded
npm run db:seed
# Check that email addresses are unique
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the terminal output for specific error messages
3. Ensure all environment variables are correctly set
4. Verify database connection and seeding
5. Test member registration flow with unique email addresses

## 🎉 What's Included

This system provides everything needed for a professional golf society:

✅ **Member Management** - Complete profiles and handicap tracking  
✅ **Self-Service Registration** - New members can sign up independently  
✅ **Booking System** - Individual meal selection for all participants  
✅ **Admin Dashboard** - Full management capabilities  
✅ **Mobile Experience** - Optimized for phones and tablets  
✅ **Enhanced Desktop UI** - Improved spacing and consolidated information  
✅ **Payment Integration** - Bank transfer with automated details  
✅ **Meal Coordination** - Detailed reports for golf clubs with seeded options  
✅ **Professional Design** - Golf-themed and branded interface with consistent styling  
✅ **Production Ready** - Deployed on Vercel with PostgreSQL  
✅ **Security Features** - Encrypted passwords and input validation  

The system is designed to handle real golf society operations with professional presentation, complete functionality for both members and administrators, and a streamlined onboarding process for new members.

## 🆕 Recent Updates

### Member Registration System
- Added self-service member registration from sign-in page
- Implemented tabbed authentication interface (Sign In/Sign Up)
- Auto-generated sequential member numbers (IGS001, IGS002, etc.)
- Secure password hashing with bcrypt
- Flexible profile creation with optional fields

### UI/UX Improvements
- Enhanced desktop layout with improved spacing and visual hierarchy
- Consolidated redundant booking information into efficient status cards
- Professional blue color scheme for admin interface and menu options
- Smart color-coded progress indicators based on booking capacity
- Mobile-optimized registration and authentication flows

### Database Enhancements
- Seeded menu options with sample Scottish golf club dishes
- Enhanced user model with auto-generated member numbers
- Improved data validation and security measures 