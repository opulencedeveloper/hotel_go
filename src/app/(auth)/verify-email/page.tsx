'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Mail, CheckCircle, AlertCircle, RefreshCw, Hotel, Shield, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { useHttp } from '@/hooks/useHttp';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';
import logoImage from '@/assets/logo/app-icon.png';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, sendHttpRequest: verifyEmailReq } = useHttp();
  const { isLoading: resendLoading, sendHttpRequest: resendEmailReq } = useHttp();
  
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'success' | 'error' | 'expired'>('pending');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    if (emailParam) {
      setEmail(emailParam);
    }
    
    if (tokenParam) {
      setToken(tokenParam);
      // If token is 6 digits, auto-populate OTP inputs
      if (tokenParam.length === 6 && /^\d+$/.test(tokenParam)) {
        const tokenDigits = tokenParam.split('');
        setOtp(tokenDigits);
        // Auto-verify if token is in URL
        setVerificationStatus('verifying');
        verifyEmail(tokenParam);
      } else if (tokenParam.length === 6) {
        // Still try to verify even if not all digits
        setVerificationStatus('verifying');
        verifyEmail(tokenParam);
      }
    }
  }, [searchParams]);

  const verifyEmail = (verificationToken: string) => {
    verifyEmailReq({
      successRes: (res: any) => {
        console.log('Email verification successful:', res);
        setVerificationStatus('success');
        toast.success('Email verified successfully! You can now log in.');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      },
      requestConfig: {
        url: '/auth/verify-email',
        method: 'POST',
        body: {
          otp: verificationToken,
          email: email
        }
      }
    });
  };

  const resendVerificationEmail = () => {
    if (!email) {
      toast.error('Email address is required');
      return;
    }

    resendEmailReq({
      successRes: (res: any) => {
        console.log('Verification email resent:', res);
        toast.success('Verification email sent! Please check your inbox.');
        setVerificationStatus('pending');
        setErrorMessage('');
      },
      requestConfig: {
        url: '/auth/resend-email-verify-otp',
        method: 'POST',
        body: {
          email: email
        }
      }
    });
  };

  const handleRetryVerification = () => {
    if (!token) {
      toast.error('Verification token is required');
      return;
    }
    setVerificationStatus('verifying');
    setErrorMessage('');
    verifyEmail(token);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.length === 6) {
      const otpString = newOtp.join('');
      setVerificationStatus('verifying');
      verifyEmail(otpString);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Only process if it's 6 digits
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      const otpString = digits.join('');
      
      // Focus the last input
      inputRefs.current[5]?.focus();
      
      // Auto-verify
      setVerificationStatus('verifying');
      verifyEmail(otpString);
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    if (!/^\d+$/.test(otpString)) {
      toast.error('OTP must contain only digits');
      return;
    }
    setVerificationStatus('verifying');
    setErrorMessage('');
    verifyEmail(otpString);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>

      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding & Features */}
          <div className="text-white space-y-8 hidden lg:block">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl p-2">
                  <Image 
                    src={logoImage} 
                    alt="HotelGO Logo" 
                    width={48} 
                    height={48} 
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">HotelGo</h1>
                  <p className="text-blue-200 text-lg">Email Verification</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold leading-tight">
                  Almost There!
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Complete your email verification to access your hotel management dashboard and start streamlining your operations.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Verification</h3>
                <p className="text-blue-200 text-sm">Enterprise-grade security with encrypted email verification</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quick Setup</h3>
                <p className="text-blue-200 text-sm">Get started in minutes with our intuitive dashboard</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Team Ready</h3>
                <p className="text-blue-200 text-sm">Invite your team and manage roles seamlessly</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Premium Support</h3>
                <p className="text-blue-200 text-sm">24/7 customer support for all your needs</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 text-blue-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">500+ Hotels</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Side - Verification Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
              {/* Mobile Logo */}
              <div className="flex items-center justify-center mb-8 lg:hidden">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Hotel className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold text-white">HotelGo</span>
              </div>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Verify Your Email
                </h2>
                <p className="text-blue-200">
                  Complete your account setup
                </p>
              </div>

              <div className="space-y-6">
                {/* Email Display */}
                {email && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Email Address</p>
                        <p className="text-sm text-blue-200">{email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verification Status */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  {verificationStatus === 'pending' && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-8 w-8 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        Enter Verification Code
                      </h3>
                      <p className="text-sm text-blue-200 mb-6">
                        Please enter the 6-digit verification code sent to{' '}
                        <strong className="text-yellow-300">{email || 'your email'}</strong>
                      </p>

                      {/* OTP Input */}
                      <div className="mb-6">
                        <div className="flex justify-center gap-3 mb-4">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              ref={(el) => {
                                inputRefs.current[index] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              onPaste={index === 0 ? handleOtpPaste : undefined}
                              className="w-12 h-14 text-center text-xl font-bold text-white bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none transition-all duration-200"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={handleVerifyOtp}
                          disabled={otp.some(digit => !digit) || isLoading}
                          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-slate-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {isLoading ? (
                            <LoadingSpinner title="Verifying..." />
                          ) : (
                            <>
                              Verify Email
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </button>
                        <button
                          onClick={resendVerificationEmail}
                          disabled={resendLoading}
                          className="w-full flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 transition-all"
                        >
                          {resendLoading ? (
                            <LoadingSpinner title="Sending..." />
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Resend Verification Email
                            </>
                          )}
                        </button>
                      </div>

                      <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-center space-x-2 text-blue-200 mb-2">
                          <Shield className="h-4 w-4" />
                          <span className="text-xs font-medium">Security Tip</span>
                        </div>
                        <p className="text-xs text-blue-200">
                          You can paste the 6-digit code or enter it manually
                        </p>
                      </div>
                    </div>
                  )}

                  {verificationStatus === 'verifying' && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LoadingSpinner title="Verifying your email..." />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        Verifying Email
                      </h3>
                      <p className="text-sm text-blue-200">
                        Please wait while we verify your email address...
                      </p>
                    </div>
                  )}

                  {verificationStatus === 'success' && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        Email Verified Successfully!
                      </h3>
                      <p className="text-sm text-blue-200 mb-6">
                        Your email has been verified. You can now access your hotel management dashboard.
                      </p>
                      <div className="space-y-3">
                        <Link
                          href="/login"
                          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-slate-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <Hotel className="h-4 w-4 mr-2" />
                          Go to Dashboard
                        </Link>
                        <p className="text-xs text-blue-200">
                          You will be redirected automatically in a few seconds...
                        </p>
                      </div>
                    </div>
                  )}

                  {verificationStatus === 'error' && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-red-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        Verification Failed
                      </h3>
                      <p className="text-sm text-blue-200 mb-6">
                        {errorMessage || 'There was an error verifying your email. The link may be invalid or expired.'}
                      </p>

                      {/* OTP Input for Retry */}
                      <div className="mb-6">
                        <p className="text-blue-200 text-sm mb-4">
                          Please enter the 6-digit verification code again
                        </p>
                        <div className="flex justify-center gap-3 mb-4">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              ref={(el) => {
                                inputRefs.current[index] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              onPaste={index === 0 ? handleOtpPaste : undefined}
                              className="w-12 h-14 text-center text-xl font-bold text-white bg-white/10 backdrop-blur-sm border-2 border-red-400/50 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none transition-all duration-200"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={handleVerifyOtp}
                          disabled={otp.some(digit => !digit) || isLoading}
                          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {isLoading ? (
                            <LoadingSpinner title="Retrying..." />
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Verify Again
                            </>
                          )}
                        </button>
                        <button
                          onClick={resendVerificationEmail}
                          disabled={resendLoading}
                          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {resendLoading ? (
                            <LoadingSpinner title="Sending..." />
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Resend Verification Email
                            </>
                          )}
                        </button>
                        <Link
                          href="/register"
                          className="w-full flex justify-center py-3 px-4 border border-white/20 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                        >
                          Back to Registration
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Help Section */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h4 className="text-sm font-medium text-yellow-300 mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Need Help?
                  </h4>
                  <ul className="text-sm text-blue-200 space-y-2">
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">•</span>
                      <span>Check your spam/junk folder for the verification email</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">•</span>
                      <span>Make sure you entered the correct email address</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">•</span>
                      <span>Verification links expire after 24 hours</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-300 mr-2">•</span>
                      <span>Contact our 24/7 support team if you need assistance</span>
                    </li>
                  </ul>
                </div>

                {/* Footer */}
                <div className="text-center">
                  <p className="text-sm text-blue-200 mb-4">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-yellow-300 hover:text-yellow-200 transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                  <div className="flex items-center justify-center space-x-6 text-xs text-blue-300">
                    <a href="#" className="hover:text-yellow-300 transition-colors">Support</a>
                    <a href="#" className="hover:text-yellow-300 transition-colors">Documentation</a>
                    <a href="#" className="hover:text-yellow-300 transition-colors">Privacy Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
