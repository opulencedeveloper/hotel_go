'use client';

import { Shield } from 'lucide-react';

interface SecuritySettingsProps {
  settings: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordPolicy: string;
    loginAttempts: number;
  };
  onSettingChange: (key: string, value: any) => void;
  isReadOnly?: boolean;
}

export default function SecuritySettings({ settings, onSettingChange, isReadOnly = true }: SecuritySettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">Security Settings</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-secondary-900">Two-Factor Authentication</p>
              <p className="text-sm text-secondary-600">Add an extra layer of security</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type='checkbox'
                        checked={settings.twoFactorAuth}
                        onChange={(e) => onSettingChange('twoFactorAuth', e.target.checked)}
                        disabled={isReadOnly}
                        className='sr-only peer'
                      />
            <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => onSettingChange('sessionTimeout', parseInt(e.target.value))}
            min="5"
            max="480"
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Password Policy
          </label>
          <select
            value={settings.passwordPolicy}
            onChange={(e) => onSettingChange('passwordPolicy', e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          >
            <option value="basic">Basic (6+ characters)</option>
            <option value="medium">Medium (8+ chars, 1 number)</option>
            <option value="strong">Strong (8+ chars, mixed case, numbers, symbols)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={settings.loginAttempts}
            onChange={(e) => onSettingChange('loginAttempts', parseInt(e.target.value))}
            min="3"
            max="10"
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>
    </div>
  );
}
