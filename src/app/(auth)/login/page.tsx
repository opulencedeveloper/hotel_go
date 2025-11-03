"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Eye,
  EyeOff,
  AlertCircle,
  Hotel,
  Shield,
  Star,
  Clock,
  CheckCircle,
  Users,
} from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useHttp } from "@/hooks/useHttp";
import { tokenStorage } from "@/lib/auth-storage";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { isLoading, sendHttpRequest: loginReq, error } = useHttp();

  const router = useRouter();

  const loginReqSuccessResHandler = (res: any) => {
    const resData = res?.data;

    console.log("loginRes", resData);
    if (resData.message === "verify_email") {
      toast.success("Please check your email to verify your account.");
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/dashboard");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginReq({
      successRes: loginReqSuccessResHandler,
      requestConfig: {
        url: "/auth/login",
        method: "POST",
        body: {
          email,
          password,
        },
        successMessage: "Logged in successfully",
      },
    });
  };

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
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Features */}
          <div className="text-white space-y-8 hidden lg:block">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Hotel className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">HotelGo</h1>
                  <p className="text-blue-200 text-lg">
                    Hotel Management System
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold leading-tight">
                  Streamline Your Hotel Operations
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Complete hotel management solution for reservations, guest
                  services, staff coordination, and business analytics.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Guest Management</h3>
                <p className="text-blue-200 text-sm">
                  Complete guest lifecycle management from check-in to checkout
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Real-time Operations
                </h3>
                <p className="text-blue-200 text-sm">
                  Live updates and instant notifications across all departments
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Secure & Reliable
                </h3>
                <p className="text-blue-200 text-sm">
                  Enterprise-grade security with role-based access control
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Analytics & Reports
                </h3>
                <p className="text-blue-200 text-sm">
                  Comprehensive insights to optimize your hotel performance
                </p>
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

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
              {/* Mobile Logo */}
              <div className="flex items-center justify-center mb-8 lg:hidden">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Hotel className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold text-white">
                  HotelGo
                </span>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-blue-200">
                  Sign in to your hotel management dashboard
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
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-blue-200 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-blue-200 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all"
                        placeholder="Enter your password"
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
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-yellow-300 focus:ring-yellow-300 border-white/20 rounded bg-white/10"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-blue-200"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-medium text-yellow-300 hover:text-yellow-200 transition-colors"
                    >
                      Forgot password?
                    </Link>
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
                        <LoadingSpinner title="Signing in..." />
                        {/* <span className="ml-2">Signing in...</span> */}
                      </>
                    ) : (
                      <>
                        <Hotel className="h-5 w-5 mr-2" />
                        Sign In to Dashboard
                      </>
                    )}
                  </button>
                </div>
              </form>


              {/* Footer */}
              <div className="mt-8 space-y-4 text-center">
                <p className="text-sm text-blue-200">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-yellow-300 hover:text-yellow-200 transition-colors"
                  >
                    Register your hotel
                  </Link>
                </p>
                <div className="pt-4 border-t border-white/20">
                  <Link
                    href="/staff-login"
                    className="inline-flex items-center justify-center w-full py-2 px-4 text-sm font-medium text-blue-200 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Staff Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
