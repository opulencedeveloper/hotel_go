"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Users,
  Building2,
  ArrowLeft,
} from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useHttp } from "@/hooks/useHttp";
import { toast } from "sonner";
import { UserRole } from "@/utils/enum";
import logoImage from "@/assets/logo/app-icon.png";

export default function StaffLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { isLoading, sendHttpRequest: loginReq, error } = useHttp();

  const router = useRouter();

  /**
   * Get the default route for a user based on their role
   */
  const getDefaultRouteForRole = (role: string): string => {
    switch (role) {
      case UserRole.SuperAdmin:
      case UserRole.Manager:
        return "/dashboard";
      case UserRole.FrontDesk:
        return "/stays";
      case UserRole.HouseKeeping:
        return "/housekeeping";
      case UserRole.Kitchen:
        return "/kitchen";
      case UserRole.Maintenance:
        return "/facilities";
      case UserRole.Accounting:
        return "/accounting";
      case UserRole.Security:
        return "/security";
      case UserRole.GuestServices:
        return "/services";
      default:
        // Fallback to front-desk for unknown roles
        return "/front-desk";
    }
  };

  const loginReqSuccessResHandler = (res: any) => {
    const resData = res?.data;

    console.log("staffLoginRes", resData);
    if (resData.message === "verify_email") {
      toast.success("Please check your email to verify your account.");
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } else {
      // Get user role from response
      const userRole = resData?.data?.user?.role || resData?.user?.role;
      
      if (userRole) {
        // Redirect to role-specific page
        const defaultRoute = getDefaultRouteForRole(userRole);
        router.push(defaultRoute);
      } else {
        // Fallback to front-desk if role is not found
        router.push("/front-desk");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginReq({
      successRes: loginReqSuccessResHandler,
      requestConfig: {
        url: "/auth/staff-login",
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
        <div className="max-w-md w-full mx-auto">
          {/* Back to Main Login Button */}
          <div className="mb-6">
            <Link
              href="/login"
              className="inline-flex items-center text-blue-200 hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Login
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Mobile Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-2">
                <Image 
                  src={logoImage} 
                  alt="HotelGO Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
              </div>
              <span className="ml-3 text-2xl font-bold text-white">
                Staff Login
              </span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Staff Portal
              </h2>
              <p className="text-blue-200">
                Sign in to access your staff dashboard
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
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
                    className="h-4 w-4 text-blue-300 focus:ring-blue-300 border-white/20 rounded bg-white/10"
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
                    className="font-medium text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner title="Signing in..." />
                    </>
                  ) : (
                    <>
                      <Users className="h-5 w-5 mr-2" />
                      Sign In as Staff
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-blue-200">
                Need admin access?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Admin Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
