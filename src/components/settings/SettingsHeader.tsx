'use client';

import { Save, RefreshCw, Database } from 'lucide-react';

interface SettingsHeaderProps {
  onSave: () => void;
  onReset: () => void;
}

export default function SettingsHeader({ onSave, onReset }: SettingsHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl p-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Property Settings</h1>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              <span className="text-sm font-medium">System Configuration</span>
            </div>
          </div>
          
          <p className="text-gray-100 text-lg mb-6">
            Configure your hotel property settings, preferences, and system options.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <Database className="w-4 h-4" />
              <span className="text-gray-100">Settings Active</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-gray-200">Last Updated:</span>
              <span className="font-medium">Today</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
              <span className="text-gray-200">Config Version:</span>
              <span className="font-medium">v2.1.4</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <div className="flex flex-col gap-3">
            <button 
              onClick={onSave}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button 
              onClick={onReset}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset to Default</span>
            </button>
            <button className="bg-white text-gray-600 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
              <Database className="w-4 h-4" />
              <span>Export Config</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
