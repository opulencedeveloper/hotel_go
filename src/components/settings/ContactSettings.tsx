'use client';

import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ContactSettingsProps {
  settings: {
    email: string;
    phone: string;
    address: string;
    website: string;
  };
  onSettingChange: (key: string, value: any) => void;
  isReadOnly?: boolean;
}

export default function ContactSettings({ settings, onSettingChange, isReadOnly = true }: ContactSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => onSettingChange('email', e.target.value)}
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.phone}
            onChange={(e) => onSettingChange('phone', e.target.value)}
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Address
          </label>
          <textarea
            value={settings.address}
            onChange={(e) => onSettingChange('address', e.target.value)}
            rows={3}
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <Globe className="w-4 h-4 inline mr-2" />
            Website
          </label>
          <input
            type="url"
            value={settings.website}
            onChange={(e) => onSettingChange('website', e.target.value)}
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>
    </div>
  );
}
