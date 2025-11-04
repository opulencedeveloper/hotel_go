"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  Shield
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Static user data for development
  const user = {
    firstName: "Admin",
    lastName: "User",
  };

  const adminNavItems = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Hotels", href: "/admin/hotels", icon: Building2 },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-25"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-200 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-bold text-primary-600">Admin Panel</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-secondary-400 hover:text-secondary-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto pb-4">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full bg-white border-r border-secondary-200">
          <div className="flex items-center h-16 px-4 border-b border-secondary-200 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-primary-600" />
              <h1 className="text-xl font-bold text-primary-600">Admin Panel</h1>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto pb-4">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-secondary-200">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-secondary-400 hover:text-secondary-600 lg:hidden flex-shrink-0"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0 min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-secondary-900 truncate">
                  Admin Dashboard
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* User Profile */}
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="hidden sm:block min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-secondary-500 truncate">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

