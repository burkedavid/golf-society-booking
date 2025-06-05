# Irish Golf Society Scotland - Outing Management System

A comprehensive Next.js web application for managing golf outings, member bookings, and event coordination for the Irish Golf Society Scotland.

## Features

- **User Authentication**: Secure login system with role-based access (Admin/Member)
- **Outing Management**: Create and manage golf outings with capacity limits and deadlines
- **Booking System**: Members can book places for themselves and guests
- **Menu Management**: Create and manage lunch/dinner menus for each outing
- **Payment Tracking**: Track payment status for bookings
- **Admin Dashboard**: Comprehensive overview of outings, bookings, and revenue
- **Member Dashboard**: Personal booking history and profile management

## Technology Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd golf-society-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema
   npm run db:push
   
   # Seed the database with test data
   npm run db:seed
   ```

4. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Test Accounts

After seeding the database, you can use these test accounts:

### Admin Account
- **Email**: admin@irishgolfsocietyscotland.com
- **Password**: admin123
- **Access**: Full system management

### Member Accounts
- **Email**: seamus@email.com | **Password**: member123
- **Email**: paddy@email.com | **Password**: member123  
- **Email**: brendan@email.com | **Password**: member123
- **Access**: Member booking and profile management

## Database Management

- **View database**: `npm run db:studio` (opens Prisma Studio)
- **Reset database**: Delete `prisma/dev.db` and run `npm run db:push && npm run db:seed`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard pages
│   ├── member/            # Member dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Key Features

### Admin Features
- Create and manage golf outings
- Set pricing for members and guests
- Manage registration deadlines
- Create lunch and dinner menus
- View booking reports and attendee lists
- Track payment status
- Export attendee data

### Member Features
- Browse available outings
- Book attendance with guest management
- Select meals for member and guests
- View booking history
- Update profile and handicap
- Track payment requirements

### Booking Process
1. Member selects an outing
2. Confirms attendance and adds guests
3. Selects meals for all attendees
4. Reviews booking summary and cost
5. Receives payment instructions
6. Admin tracks payment status

## Development

### Database Schema
The application uses SQLite with the following main models:
- **User**: Member and admin accounts
- **Outing**: Golf events with details and capacity
- **Menu**: Lunch and dinner options for each outing
- **Booking**: Member bookings with guests and meal selections

### Authentication
- NextAuth.js with credentials provider
- JWT-based sessions
- Role-based access control
- Secure password hashing with bcrypt

### Styling
- Tailwind CSS for utility-first styling
- shadcn/ui for consistent component design
- Responsive design for mobile and desktop
- Green/white color scheme matching golf theme

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary to the Irish Golf Society Scotland.

## Support

For technical support or feature requests, please contact the development team. 