"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Hotel,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
  Key,
} from "lucide-react";
import { useHttp } from "@/hooks/useHttp";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    sendHttpRequest: resetPasswordReq,
    isLoading,
    error: resetPasswordError,
  } = useHttp();
  const {
    sendHttpRequest: verifyTokenReq,
    isLoading: isVerifying,
    error: httpError,
  } = useHttp();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const otpParam = searchParams.get("otp");
    const emailParam = searchParams.get("email");

    if (otpParam) {
      setOtp(otpParam);
      setIsOtpVerified(true);
      setIsOtpValid(true);
    } else {
      setError(
        "Invalid or missing OTP. Please check your email for the correct link."
      );
    }

    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Handle HTTP errors
  useEffect(() => {
    if (httpError) {
      setError(
        typeof httpError === "string"
          ? httpError
          : "An error occurred. Please try again."
      );
      setIsOtpValid(false);
    }
  }, [httpError]);

  // Handle reset password errors
  useEffect(() => {
    if (resetPasswordError) {
      setError(
        typeof resetPasswordError === "string"
          ? resetPasswordError
          : "Failed to reset password. Please try again."
      );
      toast.error("Failed to reset password. Please try again.");
    }
  }, [resetPasswordError]);

  // Remove the verifyResetToken function since we're using OTP directly

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return {
      isValid: minLength && hasUppercase && hasLowercase && hasNumber,
      errors: {
        minLength: !minLength ? "At least 6 characters" : null,
        hasUppercase: !hasUppercase ? "One uppercase letter" : null,
        hasLowercase: !hasLowercase ? "One lowercase letter" : null,
        hasNumber: !hasNumber ? "One number" : null,
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const errors = Object.values(passwordValidation.errors).filter(Boolean);
      setError(`Password must contain: ${errors.join(", ")}`);
      return;
    }

    try {
      resetPasswordReq({
        successRes: (res: any) => {
          console.log("Password reset successful:", res);
          setSuccess(true);
          toast.success(
            "Password reset successfully! You can now sign in with your new password."
          );

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        },

        requestConfig: {
          url: "/auth/change-password-with-forgot-password",
          method: "POST",
          body: {
            otp,
            email,
            password,
            confirmPassword,
          },
        },
      });
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                Password Reset Successfully!
              </h1>

              <p className="text-blue-200 mb-6">
                Your password has been updated successfully. You can now sign in
                with your new password.
              </p>

              <div className="space-y-4">
                <Link
                  href="/login"
                  className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-slate-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Hotel className="h-5 w-5 mr-2" />
                  Sign In to Dashboard
                </Link>

                <p className="text-sm text-blue-200">
                  You will be redirected automatically in a few seconds...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Remove the token verification loading state since we're using OTP directly

  if (!isOtpValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          ></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>

              <h1 className="text-2xl font-bold text-white mb-4">
                Invalid Reset Link
              </h1>

              <p className="text-blue-200 mb-6">
                {error ||
                  "This password reset link is invalid or has expired. Please request a new one."}
              </p>

              <div className="space-y-4">
                <Link
                  href="/forgot-password"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 transition-all duration-200"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Request New Reset Link
                </Link>

                <Link
                  href="/login"
                  className="w-full flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
        ></div>
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
                  <Key className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Reset Your Password
              </h1>
              <p className="text-blue-200">
                {email && `Enter a new password for ${email}`}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-300" />
                    <div className="ml-3">
                      <p className="text-sm text-red-200">{error}</p>
                    </div>
                  </div>
                  {/* Show return button when there's an HTTP error */}
                  {(httpError || resetPasswordError) && (
                    <div className="mt-4 flex space-x-3">
                      <Link
                        href="/forgot-password"
                        className="flex-1 flex justify-center items-center py-2 px-4 border border-red-400/30 rounded-lg text-sm font-medium text-red-200 bg-red-500/10 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Request New Reset Link
                      </Link>
                      <Link
                        href="/login"
                        className="flex-1 flex justify-center items-center py-2 px-4 border border-white/20 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                      >
                        Back to Login
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-blue-200 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-blue-200 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-blue-200 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-blue-200">
                    Password must be at least 6 characters with uppercase,
                    lowercase, and number
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-blue-200 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-blue-200 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-blue-200 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-slate-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner title="Resetting..." />
                      <span className="ml-2">Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <Key className="h-5 w-5 mr-2" />
                      Reset Password
                    </>
                  )}
                </button>
              </div>
            </form>

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

          {/* Security Info */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="text-sm font-medium text-yellow-300 mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Password Security
            </h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Use a strong, unique password</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Add numbers and special characters</li>
              <li>• Avoid using personal information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
