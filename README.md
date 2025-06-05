# Irish Golf Society Scotland - Booking System

A comprehensive golf society management system built with Next.js, featuring member management, outing bookings, and meal coordination with golf clubs.

## 🏌️‍♂️ Features

### Member Features
- **Professional Dashboard** with upcoming outings and booking history
- **Individual Meal Selection** for members and each guest
- **Guest Management** with handicap tracking
- **Bank Transfer Integration** with automated payment details
- **Responsive Design** optimized for all devices

### Admin Features
- **Complete Member Management** with handicap and contact information
- **Outing Creation** with menu management and pricing
- **Booking Management** with full editing capabilities
- **Meal Summary for Catering** - detailed breakdown for golf club kitchens
- **Payment Tracking** and status management
- **Professional Reporting** for golf club coordination

### Golf Club Integration
- **Detailed Meal Counts** with percentages for kitchen preparation
- **Special Dietary Requirements** tracking
- **Individual Player Information** including handicaps
- **Professional Presentation** suitable for club coordination

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom golf-themed design
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/golf-society-booking.git
cd golf-society-booking
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

5. Set up the database:
```bash
npx prisma db push
npx prisma db seed
```

6. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📊 Default Accounts

### Admin Account
- **Email**: admin@irishgolfsocietyscotland.com
- **Password**: admin123
- **Role**: Full administrative access

### Member Account
- **Email**: seamus@email.com
- **Password**: member123
- **Role**: Standard member access

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard and management
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── book/              # Booking system
│   └── dashboard/         # Member dashboard
├── components/            # Reusable React components
│   └── ui/               # UI component library
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🎯 Key Features Explained

### Meal Management System
- **Individual Selection**: Each member and guest selects their own main course and dessert
- **Admin Visibility**: Complete meal breakdown with counts and percentages
- **Golf Club Integration**: Professional summary format for catering coordination

### Member Management
- **Comprehensive Profiles**: Name, email, phone, handicap, member number
- **Password Management**: Admin can reset member passwords
- **Booking History**: Complete tracking of all member bookings

### Booking System
- **Real-time Availability**: Live capacity tracking with visual progress
- **Guest Management**: Up to 3 guests per member with individual details
- **Payment Integration**: Bank transfer details with unique references

## 🌐 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
```

## 📝 Database Schema

The system uses a relational database with the following main entities:
- **Users**: Members and admins with authentication
- **Outings**: Golf events with pricing and capacity
- **Bookings**: Member reservations with guest and meal details
- **Menus**: Meal options for each outing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏌️‍♂️ About Irish Golf Society Scotland

A premier golf society organizing memorable golf experiences across Scotland's finest courses, combining competitive golf with excellent dining and camaraderie.

---

Built with ❤️ for the Irish Golf Society Scotland 