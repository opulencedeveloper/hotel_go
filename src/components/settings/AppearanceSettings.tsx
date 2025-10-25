'use client';

import { Settings, Sun, Moon, Monitor } from 'lucide-react';

interface AppearanceSettingsProps {
  settings: {
    theme: string;
    primaryColor: string;
    sidebarCollapsed: boolean;
    compactMode: boolean;
  };
  onSettingChange: (key: string, value: any) => void;
  isReadOnly?: boolean;
}

export default function AppearanceSettings({ settings, onSettingChange, isReadOnly = true }: AppearanceSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">Appearance Settings</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => onSettingChange('theme', 'light')}
              disabled={isReadOnly}
              className={`p-4 border-2 rounded-lg flex items-center space-x-3 ${
                settings.theme === 'light' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'
              } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Sun className="w-5 h-5" />
              <span className="font-medium">Light</span>
            </button>
            <button
              onClick={() => onSettingChange('theme', 'dark')}
              disabled={isReadOnly}
              className={`p-4 border-2 rounded-lg flex items-center space-x-3 ${
                settings.theme === 'dark' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'
              } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Moon className="w-5 h-5" />
              <span className="font-medium">Dark</span>
            </button>
            <button
              onClick={() => onSettingChange('theme', 'auto')}
              disabled={isReadOnly}
              className={`p-4 border-2 rounded-lg flex items-center space-x-3 ${
                settings.theme === 'auto' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'
              } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Monitor className="w-5 h-5" />
              <span className="font-medium">Auto</span>
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Primary Color
          </label>
          <div className="flex space-x-3">
            {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map((color) => (
                        <button
                          key={color}
                          onClick={() => onSettingChange('primaryColor', color)}
                          disabled={isReadOnly}
                          className={`w-10 h-10 rounded-full border-2 ${
                            settings.primaryColor === color ? 'border-gray-900' : 'border-gray-300'
                          } ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                          style={{ backgroundColor: color }}
                        />
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-secondary-900">Compact Mode</p>
              <p className="text-sm text-secondary-600">Use smaller spacing and fonts</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type='checkbox'
                        checked={settings.compactMode}
                        onChange={(e) => onSettingChange('compactMode', e.target.checked)}
                        disabled={isReadOnly}
                        className='sr-only peer'
                      />
            <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
