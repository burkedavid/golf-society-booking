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
        <Card className="w-full max-w-lg shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg relative p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <Image
                    src="/image-640x886.png"
                    alt="Irish Golf Society Scotland Logo"
                    width={40}
                    height={55}
                    className="sm:w-[50px] sm:h-[69px] rounded-lg shadow-md bg-white p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl">Booking Confirmed!</CardTitle>
                  <CardDescription className="text-green-100 text-sm sm:text-base">
                    Complete your payment via bank transfer
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-green-700 ml-2 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3 min-w-0">
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
                <PoundSterling className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Amount to Transfer</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-900">£{amount.toFixed(2)}</div>
            </div>

            {/* Bank Details */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center mb-3 sm:mb-4">
                <Building2 className="w-5 h-5 text-gray-600 mr-2 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Bank Transfer Details</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                  <span className="font-medium text-gray-700 text-sm">Account Name:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-900 text-sm break-all">{bankDetails.accountName}</span>
                    <Button
                      onClick={() => copyToClipboard(bankDetails.accountName, 'accountName')}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      {copied === 'accountName' ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                  <span className="font-medium text-gray-700 text-sm">Sort Code:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-900 text-sm">{bankDetails.sortCode}</span>
                    <Button
                      onClick={() => copyToClipboard(bankDetails.sortCode, 'sortCode')}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      {copied === 'sortCode' ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                  <span className="font-medium text-gray-700 text-sm">Account Number:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-900 text-sm">{bankDetails.accountNumber}</span>
                    <Button
                      onClick={() => copyToClipboard(bankDetails.accountNumber, 'accountNumber')}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      {copied === 'accountNumber' ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t pt-3 space-y-1 sm:space-y-0">
                  <span className="font-medium text-gray-700 text-sm">Reference:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gray-900 bg-yellow-100 px-2 py-1 rounded text-sm">
                      {bankDetails.reference}
                    </span>
                    <Button
                      onClick={() => copyToClipboard(bankDetails.reference, 'reference')}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0"
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Payment Information</h3>
                  <div className="mt-2 text-xs sm:text-sm text-yellow-700 space-y-1">
                    <p>• Please use the exact reference number provided above</p>
                    <p>• Payment must be received within 7 days to secure your booking</p>
                    <p>• You will receive email confirmation once payment is processed</p>
                    <p>• For any payment issues, contact us immediately</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={onClose}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-base"
              >
                Continue to Dashboard
              </Button>
              <Button
                onClick={() => copyToClipboard(`Account: ${bankDetails.accountName}\nSort Code: ${bankDetails.sortCode}\nAccount Number: ${bankDetails.accountNumber}\nReference: ${bankDetails.reference}\nAmount: £${amount.toFixed(2)}`, 'all')}
                variant="outline"
                className="flex-1 py-3 text-base"
              >
                {copied === 'all' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied All Details
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All Details
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 