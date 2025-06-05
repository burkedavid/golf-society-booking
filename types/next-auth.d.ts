import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      memberNumber: string
      handicap: number
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    memberNumber: string
    handicap: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    memberNumber: string
    handicap: number
  }
} 