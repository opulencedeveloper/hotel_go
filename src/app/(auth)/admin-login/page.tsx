"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  BarChart3,
  Building2,
  Users,
  Settings,
  CheckCircle,
  Lock,
  Activity,
  TrendingUp,
} from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useHttp } from "@/hooks/useHttp";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { isLoading, sendHttpRequest: loginReq, error } = useHttp();

  const router = useRouter();

  const loginReqSuccessResHandler = (res: any) => {
    const resData = res?.data;

    console.log("adminLoginRes", resData);
    if (resData.message === "verify_email") {
      toast.success("Please check your email to verify your account.");
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/admin");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginReq({
      successRes: loginReqSuccessResHandler,
      requestConfig: {
        url: "/admin/login",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>

      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Features */}
          <div className="text-white space-y-8 hidden lg:block">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">HotelGo Admin</h1>
                  <p className="text-purple-200 text-lg">
                    Platform Administration Panel
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold leading-tight">
                  Manage Your Hotel Platform
                </h2>
                <p className="text-xl text-purple-100 leading-relaxed">
                  Comprehensive admin dashboard for monitoring hotels, managing users, tracking revenue, and system-wide analytics.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Hotel Management</h3>
                <p className="text-purple-200 text-sm">
                  Monitor and manage all hotels on the platform
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  System Analytics
                </h3>
                <p className="text-purple-200 text-sm">
                  Real-time insights and performance metrics
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  User Management
                </h3>
                <p className="text-purple-200 text-sm">
                  Control access and manage user permissions
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Revenue Tracking
                </h3>
                <p className="text-purple-200 text-sm">
                  Monitor revenue across all hotels and regions
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 text-purple-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">1,250+ Hotels</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">45K+ Rooms</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">Enterprise Security</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
              {/* Mobile Logo */}
              <div className="flex items-center justify-center mb-8 lg:hidden">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold text-white">
                  HotelGo Admin
                </span>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Admin Access
                </h2>
                <p className="text-purple-200">
                  Sign in to the platform administration panel
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
                      className="block text-sm font-medium text-purple-200 mb-2"
                    >
                      Admin Email
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
                      placeholder="admin@hotelgo.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-purple-200 mb-2"
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
                        className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-purple-200 hover:text-white transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-purple-200 hover:text-white transition-colors" />
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
                      className="h-4 w-4 text-purple-300 focus:ring-purple-300 border-white/20 rounded bg-white/10"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-purple-200"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/forgot-password"
                      className="font-medium text-purple-300 hover:text-purple-200 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-slate-900 bg-gradient-to-r from-purple-300 to-indigo-400 hover:from-purple-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner title="Signing in..." />
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        Access Admin Panel
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="mt-8 space-y-4 text-center">
                <div className="pt-4 border-t border-white/20 space-y-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center w-full py-2 px-4 text-sm font-medium text-purple-200 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Hotel Manager Login
                  </Link>
                  <Link
                    href="/staff-login"
                    className="inline-flex items-center justify-center w-full py-2 px-4 text-sm font-medium text-purple-200 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all mt-2"
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

