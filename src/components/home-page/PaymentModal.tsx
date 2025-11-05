'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertCircle, ChevronDown, User, Mail } from 'lucide-react';
import { useHttp } from '@/hooks/useHttp';
import { FLUTTERWAVE_SUPPORTED_CURRENCIES } from '@/lib/utils/flutterwave-currencies';
import Image from 'next/image';

import LogoIcon from "@/assets/logo/app-icon.png";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  currency: string;
  billingPeriod: 'yearly' | 'quarterly';
  usdPrice: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  planId,
  planName,
  currency,
  billingPeriod,
  usdPrice,
}: PaymentModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rateError, setRateError] = useState<string>('');
  const [rateSuccessfullyFetched, setRateSuccessfullyFetched] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(null);
  const currencyButtonRef = useRef<HTMLDivElement>(null);
  const { isLoading, sendHttpRequest, error } = useHttp();

  const {
    isLoading: isFetchingRate,
    sendHttpRequest: fetchRateRequest,
    error: rateFetchError,
  } = useHttp();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current overflow style
      const originalOverflow = document.body.style.overflow;
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      
      // Cleanup: restore original overflow when modal closes
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset form state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setEmail('');
      setEmailError('');
      setSelectedCurrency('USD');
      setExchangeRate(1);
      setIsProcessing(false);
      setIsCurrencyDropdownOpen(false);
      setRateError('');
      setRateSuccessfullyFetched(false);
    }
  }, [isOpen]);

  // Reset isProcessing when loading completes and there's an error
  // Success case is handled in successRes callback
  useEffect(() => {
    if (!isLoading && isProcessing && error) {
      setIsProcessing(false);
    }
  }, [isLoading, error, isProcessing]);

  // Fetch exchange rate when currency changes
  useEffect(() => {
    if (selectedCurrency === 'USD') {
      setExchangeRate(1);
      setIsLoadingRate(false);
      return;
    }

    setIsLoadingRate(true);
    setRateError('');
    setRateSuccessfullyFetched(false);
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;
    
    // Fetch rate exclusively from Flutterwave via our API
    fetchRateRequest({
      successRes: (res: { data?: { data?: { rate?: number; source?: string; currency?: string }; message?: string } }) => {
        if (!isMounted) return;
        
        // Clear timeout since we got a response
        if (timeoutId) clearTimeout(timeoutId);
        
        // Exchange rate API response received
        
        // Check if response indicates an error
        if (res?.data?.message && res.data.message.toLowerCase() !== 'success') {
          // API returned an error message
          // API returned error message
          setIsLoadingRate(false);
          setRateError('Unable to fetch exchange rate. Showing USD equivalent. You can still proceed with payment.');
          setExchangeRate(1);
          setRateSuccessfullyFetched(false);
          setSelectedCurrency('USD');
          return;
        }
        
        const rateData = res?.data?.data;
        // Rate data extracted from response
        
        // Check if data exists
        if (!rateData) {
          // No rate data in response
          setIsLoadingRate(false);
          setRateError('Invalid response from exchange rate API. Showing USD equivalent. You can still proceed with payment.');
          setExchangeRate(1);
          setRateSuccessfullyFetched(false);
          setSelectedCurrency('USD');
          return;
        }
        
        const rate = rateData?.rate;
        const source = rateData?.source;
        const currencyFromResponse = rateData?.currency;
        
        // Validating rate data
        
        // Validate that rate is valid and matches selected currency
        if (rate && typeof rate === 'number' && rate > 0 && isFinite(rate)) {
          // Accept rates from Flutterwave, cache, or estimated sources
          // Ensure currency matches selected currency
          const isValidSource = source === 'flutterwave' || source === 'cache' || source === 'cache-expired' || source === 'estimated' || !source;
          const currencyMatches = !currencyFromResponse || currencyFromResponse.toUpperCase() === selectedCurrency.toUpperCase();
          
          if (isValidSource && currencyMatches) {
            // Store the rate - this is the rate for 1 USD to selected currency
            // Example: rate = 1500 means 1 USD = 1500 NGN
            // So for $100 USD, converted price = 100 * 1500 = 150,000 NGN
            // Rate successfully fetched and validated
            
            // Set warning message if rate is from cache-expired or estimated
            if (source === 'cache-expired') {
              setRateError('Using cached rate (may be slightly outdated)');
            } else if (source === 'estimated') {
              setRateError('Using estimated rate (may not be accurate)');
            } else {
              setRateError('');
            }
            
            setExchangeRate(rate);
            setIsLoadingRate(false);
            setRateSuccessfullyFetched(true); // Mark that rate was successfully fetched
          } else {
            // If rate source is invalid or currency mismatch, reject it
            // Rate rejected: source or currency mismatch
            setExchangeRate(1);
            setIsLoadingRate(false);
            setRateError('');
            setRateSuccessfullyFetched(false);
            // Reset currency to USD when rate doesn't match
            if (selectedCurrency !== 'USD') {
              setSelectedCurrency('USD');
            }
          }
        } else {
          // Invalid rate, default to 1 (will show USD amount)
          // Rate is invalid
          setExchangeRate(1);
          setIsLoadingRate(false);
          setRateError('');
          setRateSuccessfullyFetched(false);
          // Reset currency to USD when rate is invalid
          if (selectedCurrency !== 'USD') {
            setSelectedCurrency('USD');
          }
        }
      },
      requestConfig: {
        url: `/exchange-rate?currency=${selectedCurrency}`,
        method: 'GET',
      },
    });
    
    // Fallback: Reset loading state if request takes too long or fails (12 seconds - longer than server timeout)
    timeoutId = setTimeout(() => {
      if (isMounted && !rateSuccessfullyFetched) {
        setIsLoadingRate(false);
        setExchangeRate(1);
        setRateError('Rate fetch timed out. Showing USD equivalent. You can still proceed with payment.');
        setRateSuccessfullyFetched(false);
        // Reset currency to USD when rate fetch times out
        setSelectedCurrency('USD');
      }
    }, 12000); // 12 second timeout (longer than API timeout of 8 seconds)
    
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency]);

  // Handle rate fetch errors separately
  // Only trigger when error exists AND we're not currently loading (error occurred)
  useEffect(() => {
    if (rateFetchError && !isFetchingRate && !rateSuccessfullyFetched) {
      // Clear any pending timeout since we got an error response
      const timeoutError = rateFetchError.includes('timed out') || 
                          rateFetchError.includes('504') || 
                          rateFetchError.includes('Gateway Timeout') ||
                          rateFetchError.includes('Request timed out');
      
      const networkError = rateFetchError.includes('Network error') ||
                          rateFetchError.includes('network') ||
                          rateFetchError.includes('503') ||
                          rateFetchError.includes('Unable to connect') ||
                          rateFetchError.includes('check your internet connection') ||
                          rateFetchError.includes('fetch failed') ||
                          rateFetchError.includes('ECONNREFUSED') ||
                          rateFetchError.includes('ENOTFOUND');
      
      setIsLoadingRate(false);
      setRateSuccessfullyFetched(false);
      
      // Set specific error message based on error type
      if (networkError) {
        setRateError('Network error: Unable to connect to exchange rate service. Please check your internet connection and try again.');
      } else if (timeoutError) {
        setRateError('Exchange rate service timed out. Please try again.');
      } else {
        setRateError(rateFetchError || 'Failed to fetch exchange rate. Showing USD equivalent. You can still proceed with payment.');
      }
      
      if (timeoutError) {
        setRateError('Rate fetch timed out. Showing USD equivalent. You can still proceed with payment.');
        setExchangeRate(1);
        // Reset currency to USD when rate fetch fails
        setSelectedCurrency('USD');
      } else {
        // Other errors (network, etc.)
        setRateError('Unable to fetch exchange rate. Showing USD equivalent. You can still proceed with payment.');
        setExchangeRate(1);
        setSelectedCurrency('USD');
      }
    } else if (!rateFetchError && rateSuccessfullyFetched) {
      // Clear error when rate is successfully fetched
      setRateError('');
    }
  }, [rateFetchError, isFetchingRate, rateSuccessfullyFetched]);

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (isCurrencyDropdownOpen && currencyButtonRef.current) {
      const rect = currencyButtonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownHeight = 256; // max-h-64 = 256px
      const padding = 16; // Padding from viewport edges
      
      // Calculate if dropdown should open above or below
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      
      // Calculate top position
      let top: number;
      if (openAbove) {
        top = rect.top - dropdownHeight - 8;
      } else {
        top = rect.bottom + 8;
      }
      
      // Ensure dropdown doesn't go off-screen
      top = Math.max(padding, Math.min(top, viewportHeight - dropdownHeight - padding));
      
      // Calculate left position (ensure it doesn't go off-screen)
      let left = rect.left;
      const maxLeft = viewportWidth - rect.width - padding;
      left = Math.max(padding, Math.min(left, maxLeft));
      
      // Calculate max height based on available space
      const availableSpace = viewportHeight - top - padding;
      const calculatedMaxHeight = Math.min(256, availableSpace);
      
      setDropdownPosition({
        top,
        left,
        width: rect.width,
        maxHeight: calculatedMaxHeight,
      });
    } else {
      setDropdownPosition(null);
    }
  }, [isCurrencyDropdownOpen]);

  // Currency name mapping for display
  const getCurrencyName = (code: string): string => {
    const currencyNames: { [key: string]: string } = {
      'USD': 'US Dollar',
      'NGN': 'Nigerian Naira',
      'GHS': 'Ghanaian Cedi',
      'KES': 'Kenyan Shilling',
      'ZAR': 'South African Rand',
      'GBP': 'British Pound',
      'EUR': 'Euro',
      'CAD': 'Canadian Dollar',
      'AUD': 'Australian Dollar',
      'JPY': 'Japanese Yen',
      'CHF': 'Swiss Franc',
      'CNY': 'Chinese Yuan',
      'INR': 'Indian Rupee',
      'SGD': 'Singapore Dollar',
      'AED': 'UAE Dirham',
      'SAR': 'Saudi Riyal',
    };
    return currencyNames[code] || code;
  };

  // Format price with selected currency
  const formatPrice = (amount: number, currencyCode: string = selectedCurrency): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Convert USD price to selected currency using Flutterwave exchange rate
  const convertPrice = (usdAmount: number): number => {
    // If USD, no conversion needed
    if (selectedCurrency === 'USD') {
      return usdAmount;
    }
    
    // Only convert if we have a valid rate that was successfully fetched
    if (!rateSuccessfullyFetched) {
      // Return USD amount as fallback if rate wasn't successfully fetched
      return usdAmount;
    }
    
    // If rate is still loading or invalid, show USD amount as fallback
    if (isLoadingRate || !exchangeRate || exchangeRate <= 0 || !isFinite(exchangeRate)) {
      // Return USD amount as fallback - will be formatted in selected currency
      return usdAmount;
    }
    
    // If exchange rate is 1, it might be a default/error state for non-USD currencies
    if (exchangeRate === 1 && selectedCurrency !== 'USD') {
      // Rate might not be loaded yet, return USD amount
      return usdAmount;
    }
    
    // Calculate converted amount: USD amount × exchange rate
    // Exchange rate from Flutterwave represents: 1 USD = rate (in selected currency)
    // Example: rate = 1500 means 1 USD = 1500 NGN
    // So $100 USD × 1500 = 150,000 NGN
    const converted = usdAmount * exchangeRate;
    
    // Price conversion completed
    
    // Round based on currency type
    // Currencies that typically don't use decimal places
    const wholeNumberCurrencies = ['NGN', 'JPY', 'KRW', 'VND', 'UGX', 'TZS', 'GHS', 'KES', 'ZAR', 'RWF', 'ETB', 'ZMW', 'BWP', 'MZN', 'AOA', 'SLL', 'GMD', 'LRD', 'SLE', 'MWK'];
    if (wholeNumberCurrencies.includes(selectedCurrency)) {
      return Math.round(converted);
    }
    
    // For other currencies, round to 2 decimal places
    return Math.round(converted * 100) / 100;
  };

  // Calculate converted price - always show in selected currency
  const convertedPrice = convertPrice(usdPrice);
  
  // Determine if we have a valid conversion rate
  // For USD, rate is always valid (1)
  // For other currencies, rate is valid if:
  // 1. Rate was successfully fetched from Flutterwave
  // 2. Not currently loading
  // 3. No error encountered
  // 4. Rate is a positive finite number
  const hasValidRate = selectedCurrency === 'USD' || 
    (rateSuccessfullyFetched && 
     !isLoadingRate && 
     !rateError && 
     exchangeRate > 0 && 
     isFinite(exchangeRate));
  
  // Determine the currency to display - use USD if rate is unavailable
  const displayCurrency = hasValidRate ? selectedCurrency : 'USD';

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop any event bubbling
    
    setEmailError('');

    if (!name.trim()) {
      setEmailError('Name is required');
      return;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);

    // Guard to prevent double execution
    let hasHandledPayment = false;

    sendHttpRequest({
      successRes: (res: { data?: { data?: { paymentLink?: string } } }) => {
        // Prevent double execution
        if (hasHandledPayment) {
          return;
        }
        hasHandledPayment = true;

        const paymentLink = res?.data?.data?.paymentLink;
        
        if (paymentLink && typeof paymentLink === 'string' && paymentLink.trim().length > 0) {
          // Validate URL format
          try {
            new URL(paymentLink);
            
            // Open payment link in current tab
            setIsProcessing(false);
            onClose();
            setName('');
            setEmail('');
            
            // Redirect current tab to payment link
            window.location.href = paymentLink;
          } catch (urlError) {
            setEmailError('Invalid payment link received. Please contact support.');
            setIsProcessing(false);
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
          name: name.trim(),
          email: email.trim(),
          currency: selectedCurrency,
          billingPeriod,
        },
        successMessage: 'Redirecting to payment...',
      },
    });
  };

  const handleClose = () => {
    if (!isLoading && !isProcessing) {
      setName('');
      setEmail('');
      setEmailError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto my-auto z-10 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8 flex-1 min-h-0">
            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={isLoading || isProcessing}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Image
                src={LogoIcon}
                alt="HotelGo Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Purchase License Key
            </h2>
            <p className="text-gray-600 text-sm mb-3">
              You're purchasing a <span className="font-semibold text-primary-700">{planName}</span> license key
            </p>
            
            {/* Price Display */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-3 sm:p-4 mb-3">
              <div className="text-center">
                <p className="text-xs text-primary-600 font-medium mb-1">
                  Price {selectedCurrency !== 'USD' && '(via Flutterwave)'}
                </p>
                {isLoadingRate ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                    <span className="text-base sm:text-lg font-semibold text-primary-700">
                      Fetching rate...
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-primary-700">
                      {formatPrice(convertedPrice, displayCurrency)}
                    </p>
                    {hasValidRate && selectedCurrency !== 'USD' && (
                      <p className="text-xs text-primary-500 mt-1">
                        Rate: 1 USD = {exchangeRate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {selectedCurrency}
                      </p>
                    )}
                    {!hasValidRate && selectedCurrency !== 'USD' && !rateError && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Rate unavailable, showing USD equivalent
                      </p>
                    )}
                    {rateError && (
                      <p className="text-xs text-yellow-600 mt-1">
                        {rateError}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-xs text-primary-500 mt-1">
                  {billingPeriod === 'yearly' ? 'per year' : 'per quarter'}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3 text-left">
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>What you'll receive:</strong> After payment, you'll receive a unique license key via email that will activate your {planName} plan subscription. This license key will be valid for your selected billing period ({billingPeriod === 'yearly' ? '1 year' : '3 months'}).
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="space-y-3 sm:space-y-4">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (emailError && emailError.includes('Name')) {
                      setEmailError('');
                    }
                  }}
                  disabled={isLoading || isProcessing}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    emailError && emailError.includes('Name') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  disabled={isLoading || isProcessing}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    emailError && !emailError.includes('Name') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Currency Dropdown */}
            <div className="relative">
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Currency
              </label>
              <div className="relative" ref={currencyButtonRef}>
                {isCurrencyDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsCurrencyDropdownOpen(false)}
                  />
                )}
                <motion.button
                  type="button"
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  disabled={isLoading || isProcessing}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isLoading || isProcessing ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading || isProcessing ? 1 : 0.99 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-medium">
                      {selectedCurrency}
                    </span>
                    <span className="text-gray-500 text-sm">
                      - {getCurrencyName(selectedCurrency)}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isCurrencyDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </motion.button>
                
                {isCurrencyDropdownOpen && dropdownPosition && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="fixed z-[60] bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden"
                    style={{
                      top: `${dropdownPosition.top}px`,
                      left: `${dropdownPosition.left}px`,
                      width: `${dropdownPosition.width}px`,
                      maxHeight: `${dropdownPosition.maxHeight}px`,
                    }}
                  >
                    <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: `${dropdownPosition.maxHeight}px` }}>
                      {FLUTTERWAVE_SUPPORTED_CURRENCIES.map((currency) => (
                        <button
                          key={currency}
                          type="button"
                          onClick={() => {
                            setSelectedCurrency(currency);
                            setIsCurrencyDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                            selectedCurrency === currency ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{currency}</span>
                            <span className="text-xs text-gray-500">{getCurrencyName(currency)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {emailError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{emailError}</span>
              </motion.div>
            )}

            {/* API Error Message */}
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
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || isProcessing || !name.trim() || !email.trim() || isLoadingRate}
              whileHover={{ scale: isLoading || isProcessing || isLoadingRate ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || isProcessing || isLoadingRate ? 1 : 0.98 }}
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
          <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-2">
            <p className="text-center text-xs text-gray-500">
              You'll be redirected to Flutterwave's secure payment page
            </p>
            <p className="text-center text-xs text-gray-400">
              Your license key will be sent to the email address you provide
            </p>
          </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

