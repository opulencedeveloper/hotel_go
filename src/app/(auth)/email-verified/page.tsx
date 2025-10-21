"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, CheckCircle, Mail, ArrowRight, RefreshCw, AlertCircle, Hotel, Shield, Clock, Users } from "lucide-react";
import { useHttp } from "@/hooks/useHttp";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { toast } from "sonner";

export default function EmailVerifiedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, sendHttpRequest: verifyEmailReq, error } = useHttp();

  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error" | "expired" | "network_error"
  >("verifying");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam) {
      setEmail(emailParam);
    }

    if (tokenParam) {
      setToken(tokenParam);
      verifyEmail(tokenParam, emailParam);
    } else {
      setVerificationStatus("error");
      setErrorMessage(
        "Invalid verification link. Please check your email for the correct link."
      );
    }
  }, [searchParams]);

  // Handle useHttp error
  useEffect(() => {
    if (error && verificationStatus === "verifying") {
      setVerificationStatus("network_error");
      setErrorMessage(
        typeof error === 'string' ? error : "Network error occurred. Please check your connection and try again."
      );
      toast.error("Verification failed due to network error. Please try again.");
    }
  }, [error, verificationStatus]);

  const verifyEmail = (verificationToken: string, userEmail: string | null) => {
    verifyEmailReq({
      successRes: (res: any) => {
        console.log("Email verification successful:", res);
        setVerificationStatus("success");
        toast.success("Email verified successfully! You can now log in.");
      },
      requestConfig: {
        url: "/auth/verify-email",
        method: "POST",
        body: {
          otp: verificationToken,
          email: userEmail,
        },
      },
    });
  };

  const handleRetryVerification = () => {
    if (!token) {
      toast.error("Verification token is required");
      return;
    }
    setVerificationStatus("verifying");
    setErrorMessage("");
    verifyEmail(token, email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}></div>
      </div>
      
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Hotel className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-4xl font-bold text-white">
              HotelGo
            </h1>
            <h2 className="mt-2 text-2xl font-semibold text-blue-100">
              Email Verification
            </h2>
            <p className="mt-2 text-sm text-blue-200">
              Verifying your hotel management account
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            {verificationStatus === "verifying" && (
              <div className="text-center">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-500/20 mb-6">
                  <LoadingSpinner title="" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Verifying Your Email Address
                </h3>
                <p className="text-blue-100 mb-6">
                  Please wait while we verify your hotel management account...
                </p>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-center space-x-2 text-blue-200">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Securing your account</span>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === "success" && (
              <div className="text-center">
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-green-500/20 mb-6">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Welcome to HotelGo!
                </h3>
                <p className="text-blue-100 mb-6">
                  Your email address <strong className="text-yellow-300">{email}</strong> has been verified.
                  Your hotel management account is now ready to use.
                </p>

                <div className="space-y-4">
                  <Link
                    href="/login"
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-slate-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Access Your Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-center space-x-2 text-blue-200 mb-3">
                      <Building2 className="h-5 w-5" />
                      <span className="font-medium">Your Hotel Management System</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-blue-100">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Guest Management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Reservations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === "error" && (
              <div className="text-center">
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-red-500/20 mb-6">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Verification Failed
                </h3>
                <p className="text-blue-100 mb-6">{errorMessage}</p>

                <div className="space-y-4">
                  <Link
                    href="/verify-email"
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Try Again
                  </Link>

                  <Link
                    href="/register"
                    className="w-full flex justify-center py-2 px-4 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors"
                  >
                    Back to Registration
                  </Link>
                </div>
              </div>
            )}

            {verificationStatus === "network_error" && (
              <div className="text-center">
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-orange-500/20 mb-6">
                  <AlertCircle className="h-12 w-12 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Connection Error
                </h3>
                <p className="text-blue-100 mb-6">{errorMessage}</p>

                <div className="space-y-4">
                  <button
                    onClick={handleRetryVerification}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? (
                      <LoadingSpinner title="Retrying..." />
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Verification
                      </>
                    )}
                  </button>

                  <Link
                    href="/verify-email"
                    className="w-full flex justify-center py-2 px-4 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors"
                  >
                    Try Different Method
                  </Link>

                  <Link
                    href="/register"
                    className="w-full flex justify-center py-2 px-4 border border-white/20 rounded-lg shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors"
                  >
                    Back to Registration
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-yellow-300" />
              Need Help?
            </h4>
            <ul className="text-sm text-blue-200 space-y-2">
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">•</span>
                <span>Make sure you clicked the correct verification link from your email</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">•</span>
                <span>Verification links expire after 24 hours for security</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">•</span>
                <span>Check your spam/junk folder for the verification email</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">•</span>
                <span>Contact our hotel support team if you continue to have issues</span>
              </li>
            </ul>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-yellow-300 hover:text-yellow-200 font-medium transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
