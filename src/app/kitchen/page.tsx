'use client';

import Layout from '@/components/Layout';
import { ChefHat, Clock, Utensils, Users, AlertTriangle, CheckCircle, Timer, Flame } from 'lucide-react';

export default function KitchenPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Kitchen & Restaurant</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">Culinary Operations</span>
                </div>
              </div>
              
              <p className="text-orange-100 text-lg mb-6">
                Manage kitchen operations, orders, and restaurant service efficiently.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Flame className="w-4 h-4" />
                  <span className="text-orange-100">Kitchen Active</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-orange-200">Active Orders:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-orange-200">Avg. Prep Time:</span>
                  <span className="font-medium">18 min</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Utensils className="w-4 h-4" />
                  <span>View Orders</span>
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Timer className="w-4 h-4" />
                  <span>Kitchen Timer</span>
                </button>
                <button className="bg-white text-orange-600 hover:bg-orange-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <ChefHat className="w-4 h-4" />
                  <span>Menu Manager</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="card text-center py-12">
          <ChefHat className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Kitchen Module Coming Soon</h2>
          <p className="text-secondary-600 mb-6">
            Advanced kitchen and restaurant management features are currently in development.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center space-x-2 text-orange-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Planned Features</span>
            </div>
            <p className="text-orange-700 text-sm mt-2">
              This module will include order management, kitchen display systems, inventory tracking, and staff scheduling.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
