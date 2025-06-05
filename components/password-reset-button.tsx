'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RotateCcw, X, Copy, CheckCircle } from 'lucide-react'

interface PasswordResetButtonProps {
  memberId: string
  memberName: string
}

export function PasswordResetButton({ memberId, memberName }: PasswordResetButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const handleResetPassword = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reset-password'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTempPassword(data.tempPassword)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to reset password')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy password:', err)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setTempPassword('')
    setError('')
    setCopied(false)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-orange-600 border-orange-200 hover:bg-orange-50"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Password
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription className="text-orange-100">
                      Generate new password for {memberName}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-white hover:bg-orange-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {!tempPassword ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <RotateCcw className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Password Reset Confirmation
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              This will generate a new temporary password for <strong>{memberName}</strong>.
                              The member will need to use this new password to log in.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <div className="text-red-800 text-sm">{error}</div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {loading ? 'Resetting...' : 'Reset Password'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">
                            Password Reset Successful
                          </h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>
                              A new temporary password has been generated for <strong>{memberName}</strong>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Temporary Password
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 font-mono text-lg">
                          {tempPassword}
                        </div>
                        <Button
                          onClick={copyToClipboard}
                          variant="outline"
                          size="sm"
                          className={copied ? 'text-green-600 border-green-200' : ''}
                        >
                          {copied ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {copied ? 'Password copied to clipboard!' : 'Click the copy button to copy the password'}
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Important:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>Share this password securely with the member</li>
                          <li>The member should change this password after logging in</li>
                          <li>This password will work immediately</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleClose}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  )
} 