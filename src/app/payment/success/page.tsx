'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Copy, 
  Mail, 
  ArrowRight,
  Shield,
  Calendar,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { useHttp } from '@/hooks/useHttp';
import { toast } from 'sonner';
import Link from 'next/link';

type PaymentStatus = 'verifying' | 'success' | 'failed' | 'pending';

interface PaymentData {
  licenseKey?: string;
  expiresAt?: string;
  billingPeriod?: 'yearly' | 'quarterly';
  planName?: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoading, sendHttpRequest } = useHttp();
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('verifying');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const status = searchParams.get('status');
  const txRef = searchParams.get('tx_ref');
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    // Verify payment if we have transaction details
    if (status && (transactionId || txRef)) {
      verifyPayment();
    } else if (status === 'cancelled' || status === 'failed') {
      setPaymentStatus('failed');
      setErrorMessage('Payment was cancelled or failed. Please try again.');
    } else {
      setPaymentStatus('failed');
      setErrorMessage('Missing payment information. Please contact support.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, transactionId, txRef]);

  const verifyPayment = () => {
    if (!transactionId && !txRef) {
      setPaymentStatus('failed');
      setErrorMessage('Transaction ID or reference is missing.');
      return;
    }

    sendHttpRequest({
      successRes: (res: any) => {
        const data = res?.data?.data;
        
        if (data?.licenseKey) {
          setPaymentStatus('success');
          setPaymentData({
            licenseKey: data.licenseKey,
            expiresAt: data.expiresAt,
            billingPeriod: data.billingPeriod,
            planName: data.planName,
          });
          
          toast.success('Payment verified successfully!');
        } else {
          // If no license key but payment was successful, it might be processing
          if (status === 'successful' || status === 'success') {
            setPaymentStatus('pending');
            setErrorMessage('Payment is being processed. You will receive an email with your license key shortly.');
          } else {
            setPaymentStatus('failed');
            setErrorMessage('Payment verification failed. Please contact support if the issue persists.');
          }
        }
      },
      requestConfig: {
        url: '/payment/verify',
        method: 'POST',
        body: {
          transaction_id: transactionId,
          tx_ref: txRef,
          status: status,
        },
      },
    });
  };

  const copyLicenseKey = () => {
    if (paymentData?.licenseKey) {
      navigator.clipboard.writeText(paymentData.licenseKey);
      toast.success('License key copied to clipboard!');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getBillingPeriodText = (period?: string) => {
    if (period === 'yearly') return 'Yearly';
    if (period === 'quarterly') return 'Quarterly';
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {paymentStatus === 'verifying' && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-6"
                >
                  <Loader2 className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  Verifying Payment...
                </h2>
                <p className="text-gray-600 text-lg">
                  Please wait while we verify your payment and activate your license.
                </p>
              </div>
            </motion.div>
          )}

          {paymentStatus === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Success Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 md:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <CheckCircle2 className="w-14 h-14 text-green-500" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Payment Successful!
                </h1>
                <p className="text-green-50 text-lg">
                  Your HotelGO subscription has been activated successfully.
                </p>
              </div>

              {/* License Key Section */}
              <div className="p-8 md:p-12">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-primary-600" />
                      Your License Key
                    </h3>
                    <button
                      onClick={copyLicenseKey}
                      className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 mb-4">
                    <p className="font-mono text-xl md:text-2xl font-bold text-white text-center tracking-wider break-all">
                      {paymentData?.licenseKey || 'Loading...'}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 text-center">
                    Save this license key securely. You'll need it to activate your account.
                  </p>
                </div>

                {/* Plan Details */}
                {paymentData && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Subscription Details</h4>
                    <div className="space-y-3">
                      {paymentData.planName && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Plan
                          </span>
                          <span className="font-semibold text-gray-800">{paymentData.planName}</span>
                        </div>
                      )}
                      {paymentData.billingPeriod && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Billing Period
                          </span>
                          <span className="font-semibold text-gray-800">
                            {getBillingPeriodText(paymentData.billingPeriod)}
                          </span>
                        </div>
                      )}
                      {paymentData.expiresAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Expires
                          </span>
                          <span className="font-semibold text-gray-800">
                            {formatDate(paymentData.expiresAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Email Notification */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-1">
                        Check Your Email
                      </p>
                      <p className="text-sm text-yellow-700">
                        We've sent your license key to your email address. Please check your inbox (and spam folder) for the confirmation email.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-900 transition-all shadow-lg hover:shadow-xl"
                  >
                    Activate Your Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  
                  <Link
                    href="/"
                    className="w-full flex items-center justify-center py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Back to Homepage
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {paymentStatus === 'failed' && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 md:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <XCircle className="w-14 h-14 text-red-500" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Payment Failed
                </h1>
                <p className="text-red-50 text-lg">
                  {errorMessage || 'We were unable to process your payment. Please try again.'}
                </p>
              </div>

              <div className="p-8 md:p-12">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800 mb-1">
                        What happened?
                      </p>
                      <p className="text-sm text-red-700">
                        Your payment could not be processed. This might be due to insufficient funds, card decline, or network issues. No charges were made to your account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    href="/"
                    className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-900 transition-all shadow-lg hover:shadow-xl"
                  >
                    Try Again
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  
                  <Link
                    href="/"
                    className="w-full flex items-center justify-center py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Back to Homepage
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {paymentStatus === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-8 md:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <Loader2 className="w-14 h-14 text-yellow-500 animate-spin" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Payment Processing
                </h1>
                <p className="text-yellow-50 text-lg">
                  Your payment is being processed. This may take a few minutes.
                </p>
              </div>

              <div className="p-8 md:p-12">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        Check Your Email
                      </p>
                      <p className="text-sm text-blue-700">
                        {errorMessage || 'Once your payment is confirmed, you will receive an email with your license key. This usually takes 1-5 minutes.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    href="/"
                    className="w-full flex items-center justify-center py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Back to Homepage
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

