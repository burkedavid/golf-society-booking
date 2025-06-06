'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Mail, Lock, Users, MapPin, UserPlus, Phone, Target, Building } from 'lucide-react'
import OrientationIndicator from '@/components/orientation-indicator'

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  // Sign Up Form State
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpName, setSignUpName] = useState('')
  const [signUpHandicap, setSignUpHandicap] = useState<number | ''>('')
  const [signUpPhone, setSignUpPhone] = useState('')
  const [signUpPlaceOfBirth, setSignUpPlaceOfBirth] = useState('')
  const [signUpHomeGolfClub, setSignUpHomeGolfClub] = useState('')
  const [signUpProposingMember, setSignUpProposingMember] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: signInEmail,
        password: signInPassword,
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signUpEmail,
          password: signUpPassword,
          name: signUpName,
          handicap: signUpHandicap !== '' ? Number(signUpHandicap) : undefined,
          phone: signUpPhone || undefined,
          placeOfBirth: signUpPlaceOfBirth || undefined,
          homeGolfClub: signUpHomeGolfClub || undefined,
          proposingMember: signUpProposingMember || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
      } else {
        setSuccess(data.message)
        // Clear form
        setSignUpEmail('')
        setSignUpPassword('')
        setSignUpName('')
        setSignUpHandicap('')
        setSignUpPhone('')
        setSignUpPlaceOfBirth('')
        setSignUpHomeGolfClub('')
        setSignUpProposingMember('')
        // Switch to sign in tab after successful registration
        setTimeout(() => {
          setActiveTab('signin')
          setSuccess('')
        }, 2000)
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
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl space-y-6 sm:space-y-8">
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
              {activeTab === 'signin' ? 'Welcome Back' : 'Join Our Society'}
            </h1>
            <p className="text-green-100 text-base sm:text-lg">
              {activeTab === 'signin' ? 'Book your next golf society outing' : 'Become a member and start booking'}
            </p>
          </div>

          {/* Mobile-Optimized Auth Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-4 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-green-800">
                Irish Golf Society Scotland
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm sm:text-base">
                {activeTab === 'signin' ? 'Sign in to manage your golf outings' : 'Create your member account'}
              </CardDescription>
              
              {/* Tab Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1 mt-4">
                <button
                  onClick={() => {
                    setActiveTab('signin')
                    setError('')
                    setSuccess('')
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'signin'
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Lock className="w-4 h-4 inline mr-2" />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab('signup')
                    setError('')
                    setSuccess('')
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'signup'
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <UserPlus className="w-4 h-4 inline mr-2" />
                  Sign Up
                </button>
              </div>
            </CardHeader>
            
            <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              {/* Sign In Form */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="signin-email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="signin-email"
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="signin-password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="signin-password"
                        type="password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-base"
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
              )}

              {/* Sign Up Form */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="signup-email"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="signup-password"
                        type="password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="signup-name"
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                        placeholder="e.g. Seamus O'Connor"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="signup-handicap" className="block text-sm font-semibold text-gray-700 mb-2">
                        Handicap (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Target className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="signup-handicap"
                          type="number"
                          min="0"
                          max="54"
                          step="0.1"
                          value={signUpHandicap}
                          onChange={(e) => setSignUpHandicap(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                          placeholder="e.g. 18.5"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="signup-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="signup-phone"
                          type="tel"
                          value={signUpPhone}
                          onChange={(e) => setSignUpPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                          placeholder="07700 900000"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-place-of-birth" className="block text-sm font-semibold text-gray-700 mb-2">
                      Place of Birth (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="signup-place-of-birth"
                        type="text"
                        value={signUpPlaceOfBirth}
                        onChange={(e) => setSignUpPlaceOfBirth(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                        placeholder="e.g. Dublin, Ireland"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-home-golf-club" className="block text-sm font-semibold text-gray-700 mb-2">
                      Home Golf Club (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="signup-home-golf-club"
                        type="text"
                        value={signUpHomeGolfClub}
                        onChange={(e) => setSignUpHomeGolfClub(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                        placeholder="e.g. Royal Dublin Golf Club"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-proposing-member" className="block text-sm font-semibold text-gray-700 mb-2">
                      Member Referral (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="signup-proposing-member"
                        type="text"
                        value={signUpProposingMember}
                        onChange={(e) => setSignUpProposingMember(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-base"
                        placeholder="e.g. Seamus O'Connor"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                      <strong>Note:</strong> You can update your handicap, phone number, place of birth, home golf club, and member referral details later in your profile. 
                      Email, password, and full name are required to get started.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Account
                      </div>
                    )}
                  </Button>
                </form>
              )}

              {/* Error and Success Messages */}
              {error && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 rounded-md">
                  <div className="text-red-700 text-sm font-medium">
                    {error}
                  </div>
                </div>
              )}

              {success && (
                <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 rounded-md">
                  <div className="text-green-700 text-sm font-medium">
                    {success}
                  </div>
                </div>
              )}
              
              {/* Demo Accounts Section - Only show on Sign In tab */}
              {activeTab === 'signin' && (
                <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                  <div className="text-center mb-3 sm:mb-4">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-bold text-blue-800 text-base sm:text-lg">Demo Accounts</p>
                    <p className="text-blue-600 text-xs sm:text-sm">Use these credentials to explore the system</p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Administrator Account */}
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

                    {/* Member Accounts */}
                    <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-blue-100">
                      <div className="flex items-center mb-3">
                        <Users className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="font-semibold text-gray-800 text-sm sm:text-base">Members</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-gray-50 p-3 rounded border">
                          <p className="text-xs font-medium text-gray-700 mb-1">Seamus O'Connor (HC: 12)</p>
                          <p className="text-xs text-gray-600 font-mono bg-white p-1 rounded">seamus@email.com</p>
                          <p className="text-xs text-gray-600 font-mono bg-white p-1 rounded mt-1">member123</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border">
                          <p className="text-xs font-medium text-gray-700 mb-1">Paddy Murphy (HC: 24)</p>
                          <p className="text-xs text-gray-600 font-mono bg-white p-1 rounded">paddy@email.com</p>
                          <p className="text-xs text-gray-600 font-mono bg-white p-1 rounded mt-1">member123</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border">
                          <p className="text-xs font-medium text-gray-700 mb-1">Liam O'Sullivan (HC: 16)</p>
                          <p className="text-xs text-gray-600 font-mono bg-white p-1 rounded">liam@email.com</p>
                          <p className="text-xs text-gray-600 font-mono bg-white p-1 rounded mt-1">member123</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border">
                          <p className="text-xs font-medium text-gray-700 mb-1">Declan Walsh (HC: 20)</p>
                          <p className="text-xs text-gray-600 font-mono bg-white p-1 rounded">declan@email.com</p>
                          <p className="text-xs text-gray-600 font-mono bg-white p-1 rounded mt-1">member123</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mobile-Optimized Footer */}
          <div className="text-center text-green-100">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{new Date().getFullYear()} Golf Society Outings Across Scotland</span>
            </div>
            <p className="text-xs text-green-200">
              © {new Date().getFullYear()} Irish Golf Society Scotland. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 