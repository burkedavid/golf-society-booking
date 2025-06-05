'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle, X, PoundSterling, Building2, CreditCard } from 'lucide-react'

interface BankTransferModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  bookingReference: string
  memberName: string
}

export function BankTransferModal({ isOpen, onClose, amount, bookingReference, memberName }: BankTransferModalProps) {
  const [copied, setCopied] = useState<string | null>(null)

  // Bank details (made up for now as requested)
  const bankDetails = {
    accountName: 'Irish Golf Society Scotland',
    sortCode: '80-22-60',
    accountNumber: '20462207',
    reference: bookingReference
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl bg-white">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src="/image-640x886.png"
                    alt="Irish Golf Society Scotland Logo"
                    width={50}
                    height={69}
                    className="rounded-lg shadow-md bg-white p-1"
                  />
                </div>
                <div>
                  <CardTitle className="text-xl">Booking Confirmed!</CardTitle>
                  <CardDescription className="text-green-100">
                    Complete your payment via bank transfer
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-green-700 absolute top-4 right-4"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Booking Successfully Created
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Thank you {memberName}! Your golf outing booking has been confirmed.
                      Please complete payment using the bank details below.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Amount */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <PoundSterling className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Amount to Transfer</span>
              </div>
              <div className="text-3xl font-bold text-blue-900">£{amount.toFixed(2)}</div>
            </div>

            {/* Bank Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Building2 className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Bank Transfer Details</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Account Name:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-900">{bankDetails.accountName}</span>
                    <Button
                      onClick={() => copyToClipboard(bankDetails.accountName, 'accountName')}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      {copied === 'accountName' ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Sort Code:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-900">{bankDetails.sortCode}</span>
                    <Button
                      onClick={() => copyToClipboard(bankDetails.sortCode, 'sortCode')}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      {copied === 'sortCode' ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Account Number:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-900">{bankDetails.accountNumber}</span>
                    <Button
                      onClick={() => copyToClipboard(bankDetails.accountNumber, 'accountNumber')}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      {copied === 'accountNumber' ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t pt-3">
                  <span className="font-medium text-gray-700">Reference:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-900 bg-yellow-100 px-2 py-1 rounded">
                      {bankDetails.reference}
                    </span>
                    <Button
                      onClick={() => copyToClipboard(bankDetails.reference, 'reference')}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      {copied === 'reference' ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">Important:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Please use the reference number exactly as shown above</li>
                  <li>Payment must be received within 7 days to secure your booking</li>
                  <li>You will receive email confirmation once payment is processed</li>
                  <li>Contact us if you have any payment issues</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Got It - I'll Transfer Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 