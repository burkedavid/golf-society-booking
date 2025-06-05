# 🚀 Quick Setup Guide

## Copy-Paste Commands for Local Development

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/burkedavid/golf-society-booking.git
cd golf-society-booking

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Create environment file (Windows)
copy .env.example .env.local

# Or on Mac/Linux
cp .env.example .env.local
```

**Edit `.env.local` with these values:**
```env
DATABASE_URL="postgresql://neondb_owner:npg_6brHkOd1LBeR@ep-aged-queen-abbvbz3u-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production-12345678901234567890"
```

### 3. Database Setup
```bash
# Set up database tables
npm run db:push

# Add sample data
npm run db:seed
```

### 4. Start Development
```bash
# Start the server
npm run dev
```

**Open:** http://localhost:3000

## 🔑 Test Accounts

**Admin Login:**
- Email: `admin@irishgolfsocietyscotland.com`
- Password: `admin123`

**Member Login:**
- Email: `seamus@email.com`
- Password: `member123`

## 📱 Mobile Testing

1. Open browser developer tools (F12)
2. Click mobile device icon
3. Select iPhone or Android
4. Test member experience

## ✅ What You Should See

After setup, you'll have:
- ✅ Working admin dashboard
- ✅ Mobile-optimized member interface
- ✅ Sample golf outings
- ✅ Complete booking system
- ✅ Bank transfer integration
- ✅ Member management

## 🚨 If Something Goes Wrong

**Database Issues:**
```bash
# Make sure .env.local has the correct DATABASE_URL
# Restart the dev server
npm run dev
```

**Port Issues:**
```bash
# Next.js will try ports 3001, 3002 automatically
# Or specify a port:
npm run dev -- -p 3001
```

**Build Issues:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

That's it! You now have a fully functional golf society booking system running locally. 