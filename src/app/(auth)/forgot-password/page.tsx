"use client";

import { useState } from "react";
import Link from "next/link";
import { Hotel, Mail, ArrowLeft, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { useHttp } from "@/hooks/useHttp";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { sendHttpRequest: forgotPasswordReq, isLoading } = useHttp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      forgotPasswordReq({
        successRes: (res: any) => {
          console.log("Password reset email sent:", res);
          setIsSubmitted(true);
          toast.success("Password reset instructions sent to your email!");
        },
        requestConfig: {
          url: "/auth/forgot-password",
          method: "POST",
          body: {
            email: email,
          },
        },
      });
   
  };

  const handleResendEmail = () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    handleSubmit(new Event("submit") as any);
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
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Forgot Password?
              </h1>
              <p className="text-blue-200">
                {isSubmitted 
                  ? "Check your email for reset instructions" 
                  : "Enter your email address and we'll send you reset instructions"
                }
              </p>
            </div>

            {!isSubmitted ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-300" />
                      <div className="ml-3">
                        <p className="text-sm text-red-200">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-slate-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner title="Sending Reset Instructions...." />
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5 mr-2" />
                        Send Reset Instructions
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    Check Your Email
                  </h3>
                  <p className="text-blue-200 text-sm">
                    We've sent password reset instructions to:
                  </p>
                  <p className="text-yellow-300 font-medium">{email}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-sm font-medium text-yellow-300 mb-2">
                    What's Next?
                  </h4>
                  <ul className="text-xs text-blue-200 space-y-1 text-left">
                    <li>• Check your email inbox (and spam folder)</li>
                    <li>• Click the reset link in the email</li>
                    <li>• Create a new secure password</li>
                    <li>• Sign in with your new password</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 transition-all"
                  >
                    {isLoading ? (
                      <LoadingSpinner title="Resending..." />
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Resend Email
                      </>
                    )}
                  </button>

                  <Link
                    href="/login"
                    className="w-full flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Link>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-blue-200">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-medium text-yellow-300 hover:text-yellow-200 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-sm font-medium text-yellow-300 mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Need Help?
            </h4>
            <ul className="text-sm text-blue-200 space-y-2">
              <li>• Check your spam/junk folder for the reset email</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Reset links expire after 1 hour for security</li>
              <li>• Contact support if you continue to have issues</li>
            </ul>
            <div className="mt-4 text-center">
              <a
                href="mailto:support@hotelgo.com"
                className="text-yellow-300 hover:text-yellow-200 font-medium text-sm transition-colors"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
