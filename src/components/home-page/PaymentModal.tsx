'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useHttp } from '@/hooks/useHttp';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  currency: string;
  billingPeriod: 'yearly' | 'quarterly';
}

export default function PaymentModal({
  isOpen,
  onClose,
  planId,
  planName,
  currency,
  billingPeriod,
}: PaymentModalProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { isLoading, sendHttpRequest, error } = useHttp();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);

    sendHttpRequest({
      successRes: (res: any) => {
        const paymentLink = res?.data?.data?.paymentLink;
        
        if (paymentLink) {
          // Try to open in new tab
          const newWindow = window.open(paymentLink, '_blank');
          
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            // Browser blocked popup, redirect in same tab
            window.location.href = paymentLink;
          } else {
            // Successfully opened in new tab, close modal after a delay
            setTimeout(() => {
              onClose();
              setEmail('');
              setIsProcessing(false);
            }, 1000);
          }
        } else {
          setEmailError('Payment link not received. Please try again.');
          setIsProcessing(false);
        }
      },
      requestConfig: {
        url: '/payment/initiate',
        method: 'POST',
        body: {
          planId,
          email: email.trim(),
          currency,
          billingPeriod,
        },
        successMessage: 'Redirecting to payment...',
      },
    });
  };

  const handleClose = () => {
    if (!isLoading && !isProcessing) {
      setEmail('');
      setEmailError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={isLoading || isProcessing}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-800 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get Started with {planName}
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your email to proceed with payment
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  disabled={isLoading || isProcessing}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    emailError ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {emailError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-5 left-0 flex items-center text-red-600 text-xs mt-1"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {emailError}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || isProcessing || !email.trim()}
              whileHover={{ scale: isLoading || isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || isProcessing ? 1 : 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading || isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Continue to Payment</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            You'll be redirected to Flutterwave's secure payment page
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

