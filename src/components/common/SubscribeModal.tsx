'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Key, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHttp } from '@/hooks/useHttp';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  description?: string;
  messageType?: 'invalid' | 'expired';
}

export default function SubscribeModal({
  isOpen,
  onClose,
  description,
  messageType = 'invalid',
}: SubscribeModalProps) {
  const router = useRouter();
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseKeyError, setLicenseKeyError] = useState('');
  const { isLoading, sendHttpRequest, error } = useHttp();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isLoading]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLicenseKey('');
      setLicenseKeyError('');
    }
  }, [isOpen]);

  const validateLicenseKey = (key: string): string => {
    if (!key || key.trim().length === 0) {
      return 'License key is required.';
    }
    if (key.trim().length < 10) {
      return 'License key must be at least 10 characters.';
    }
    return '';
  };

  const handleLicenseKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLicenseKey(value);
    if (licenseKeyError) {
      setLicenseKeyError('');
    }
  };

  const handleActivateLicense = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateLicenseKey(licenseKey);
    if (validationError) {
      setLicenseKeyError(validationError);
      return;
    }

      sendHttpRequest({
      successRes: (res: any) => {
        // License activated successfully
        setLicenseKey('');
        setLicenseKeyError('');
        onClose();
        // Optionally reload the page or redirect
        router.refresh();
      },
      requestConfig: {
        url: '/activate-license-key',
        method: 'PATCH',
        body: {
          licenceKey: licenseKey.trim(),
        },
        successMessage: 'License key activated successfully!',
      },
    });
  };

  const handleSubscribe = () => {
    onClose();
    router.push('/');
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 z-10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {messageType === 'expired' ? 'License Expired' : 'License Required'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {messageType === 'expired'
                    ? 'Your subscription has expired'
                    : 'A valid subscription is required'}
                </p>
                <p className="text-gray-600 text-sm">
                  {messageType === 'expired'
                    ? 'Please renew your subscription to continue using HotelGo.'
                    : 'Please subscribe to HotelGo or activate your license key to access this feature.'}
                </p>
              </div>

              {/* Description */}
              {description && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
                </div>
              )}

              {/* License Key Activation Form */}
              <form onSubmit={handleActivateLicense} className="space-y-4">
                <div>
                  <label htmlFor="licenseKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Activate License Key
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="licenseKey"
                      value={licenseKey}
                      onChange={handleLicenseKeyChange}
                      placeholder="Enter your license key (e.g., HOTELGO-XXXX-XXXX-XXXX-XXXX)"
                      className={`w-full pl-10 pr-3 py-2.5 border ${
                        licenseKeyError ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400`}
                      disabled={isLoading}
                    />
                  </div>
                  {licenseKeyError && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {licenseKeyError}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Activating...
                      </>
                    ) : (
                      'Activate License Key'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Subscribe Now
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

