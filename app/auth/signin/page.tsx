'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Mail, Lock, Users, MapPin } from 'lucide-react'
import OrientationIndicator from '@/components/orientation-indicator'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        // Get the session to determine redirect
        const session = await getSession()
        if (session?.user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 relative overflow-hidden">
      {/* Orientation Prompt for Mobile */}
      <OrientationIndicator />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-emerald-900/20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          {/* Mobile-Optimized Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-2xl">
                <Image
                  src="/image-640x886.png"
                  alt="Irish Golf Society Scotland Logo"
                  width={60}
                  height={83}
                  className="sm:w-[80px] sm:h-[111px] rounded-lg"
                />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-yellow-400" />
              Welcome Back
            </h1>
            <p className="text-green-100 text-base sm:text-lg">
              Access your premium golf experience
            </p>
          </div>

          {/* Mobile-Optimized Sign In Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center pb-4 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-green-800">
                Irish Golf Society Scotland
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm sm:text-base">
                Sign in to manage your golf outings
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 rounded-md">
                    <div className="text-red-700 text-sm font-medium">
                      {error}
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 sm:py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-base"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Trophy className="w-5 h-5 mr-2" />
                      Sign In
                    </div>
                  )}
                </Button>
              </form>
              
              {/* Mobile-Optimized Test Accounts Section */}
              <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                <div className="text-center mb-3 sm:mb-4">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
                  <p className="font-bold text-blue-800 text-base sm:text-lg">Demo Accounts</p>
                  <p className="text-blue-600 text-xs sm:text-sm">Use these credentials to explore the system</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-blue-100">
                    <div className="flex items-center mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">Administrator</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded break-all">
                      admin@irishgolfsocietyscotland.com
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded mt-1">
                      admin123
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-blue-100">
                    <div className="flex items-center mb-2">
                      <Users className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="font-semibold text-gray-800 text-sm sm:text-base">Member</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                      seamus@email.com
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded mt-1">
                      member123
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile-Optimized Footer */}
          <div className="text-center text-green-100">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Premium Golf Experiences Across Scotland</span>
            </div>
            <p className="text-xs text-green-200">
              © 2024 Irish Golf Society Scotland. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 