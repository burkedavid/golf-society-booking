# Golf Society Booking System - Setup Guide

## Quick Start

Follow these steps to get the Irish Golf Society Scotland booking system running on your local machine.

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
```

### 3. Set up the Database

```bash
# Generate Prisma client
npx prisma generate

# Create and push database schema
npm run db:push

# Seed the database with test data
npm run db:seed
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Access the Application

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Test Accounts

After seeding the database, you can log in with these accounts:

### Admin Account
- **Email**: `admin@irishgolfsocietyscotland.com`
- **Password**: `admin123`
- **Features**: Full system management, create outings, view all bookings

### Member Accounts
- **Email**: `seamus@email.com` | **Password**: `member123`
- **Email**: `paddy@email.com` | **Password**: `member123`
- **Email**: `brendan@email.com` | **Password**: `member123`
- **Features**: Book outings, manage profile, view booking history

## Database Management

### View Database
```bash
npm run db:studio
```
This opens Prisma Studio in your browser for visual database management.

### Reset Database
If you need to reset the database:
```bash
# Delete the database file
rm prisma/dev.db

# Recreate and seed
npm run db:push
npm run db:seed
```

## Project Structure

```
golf-society-booking/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth configuration
│   ├── auth/              # Authentication pages
│   │   └── signin/        # Sign-in page
│   ├── admin/             # Admin dashboard
│   │   └── dashboard/     # Admin overview
│   ├── member/            # Member dashboard
│   │   └── dashboard/     # Member overview
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects)
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── auth-provider.tsx  # NextAuth provider
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Seed data
│   └── dev.db            # SQLite database (created after setup)
├── types/                # TypeScript definitions
│   └── next-auth.d.ts    # NextAuth type extensions
└── package.json          # Dependencies and scripts
```

## Key Features Implemented

### Authentication
- ✅ NextAuth.js with credentials provider
- ✅ Role-based access (Admin/Member)
- ✅ Secure password hashing
- ✅ Session management

### Database
- ✅ SQLite database with Prisma ORM
- ✅ User management (Admin/Member roles)
- ✅ Outing management
- ✅ Menu system
- ✅ Booking system
- ✅ Seed data with test accounts

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ View all outings with capacity tracking
- ✅ Revenue and booking analytics
- ✅ Visual progress indicators

### Member Features
- ✅ Member dashboard
- ✅ View available outings
- ✅ Capacity and deadline tracking
- ✅ Booking history
- ✅ Payment status tracking

### UI/UX
- ✅ Modern, responsive design
- ✅ Green/white golf theme
- ✅ shadcn/ui components
- ✅ Tailwind CSS styling
- ✅ Mobile-friendly interface

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database commands
npm run db:push     # Push schema changes
npm run db:studio   # Open database viewer
npm run db:seed     # Seed test data
```

## Next Steps

The foundation is complete! You can now extend the system with:

1. **Booking Flow**: Complete member booking process with guest management
2. **Menu Selection**: Meal selection during booking
3. **Payment Integration**: Stripe or bank transfer processing
4. **Email Notifications**: Booking confirmations and reminders
5. **Admin Management**: Create/edit outings and menus
6. **Reporting**: Export attendee lists and financial reports

## Troubleshooting

### Common Issues

1. **Database connection errors**: Ensure `npm run db:push` was successful
2. **Authentication errors**: Check `.env.local` file exists with correct variables
3. **Module not found errors**: Run `npm install` to ensure all dependencies are installed
4. **Port already in use**: Change port with `npm run dev -- -p 3001`

### Getting Help

- Check the browser console for error messages
- Review the terminal output for server errors
- Ensure all setup steps were completed in order
- Verify test accounts are working by trying to log in

The application is now ready for development and testing! 