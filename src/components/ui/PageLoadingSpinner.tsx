import { Building2, Bed, Users, DollarSign } from "lucide-react";
import Image from "next/image";
import logoImage from "@/assets/logo/app-icon.png";

export default function PageLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        {/* Hotel-themed animated logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-pulse p-3">
            <Image 
              src={logoImage} 
              alt="HotelGO Logo" 
              width={72} 
              height={72} 
              className="object-contain"
            />
          </div>
          
          {/* Floating hotel icons */}
          <div className="absolute -top-2 -right-2 animate-bounce delay-100">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Bed className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="absolute -bottom-2 -left-2 animate-bounce delay-200">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="absolute top-1/2 -left-6 animate-bounce delay-300">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Loading text with hotel theme */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Hotel Management System</h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="text-gray-600 font-medium ml-3">Loading your dashboard</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-64 mx-auto">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
