"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getNavigationItems } from "@/lib/auth";

import {
  Home,
  Calendar,
  Bed,
  Users,
  ShoppingCart,
  Settings,
  X,
  TrendingUp,
  Shield,
  Database,
  ChefHat,
  Wrench,
  FileText,
  Package,
  Building,
  ChevronDown,
  Wifi,
  Star,
  WifiOff,
  Clock,
  Globe,
  CreditCard,
  UserCheck,
  ClipboardList,
  Calculator,
  Heart,
  Truck,
  PieChart,
  Download,
  Lock,
  Archive,
  CheckCircle,
  Save,
} from "lucide-react";

const iconMap: Record<string, any> = {
  Home,
  Calendar,
  Bed,
  UserCheck,
  Star,
  Building,
  CreditCard,
  ShoppingCart,
  ChefHat,
  Wrench,
  Users,
  TrendingUp,
  Calculator,
  Heart,
  Truck,
  PieChart,
  Download,
  Lock,
  Archive,
  Settings,
};

interface NavigationProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Navigation({ sidebarOpen, setSidebarOpen }: NavigationProps) {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);
  const navItems = getNavigationItems(user?.userRole || null);

  return (
    <>
      {/* Mobile sidebar */}
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
            <h1 className="text-xl font-bold text-primary-600">HotelGo</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-secondary-400 hover:text-secondary-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto pb-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = iconMap[item.icon] || Home;
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

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full bg-white border-r border-secondary-200">
          <div className="flex items-center h-16 px-4 border-b border-secondary-200 flex-shrink-0">
            <h1 className="text-xl font-bold text-primary-600">HotelGo</h1>
          </div>
          <nav className="flex-1 overflow-y-auto pb-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = iconMap[item.icon] || Home;
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
    </>
  );
}
