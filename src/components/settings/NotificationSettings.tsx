'use client';

import { Mail, Bell, Calendar } from 'lucide-react';

interface NotificationSettingsProps {
  settings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    bookingAlerts: boolean;
    maintenanceAlerts: boolean;
    systemAlerts: boolean;
  };
  onSettingChange: (key: string, value: any) => void;
  isReadOnly?: boolean;
}

export default function NotificationSettings({ settings, onSettingChange, isReadOnly = true }: NotificationSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-secondary-900">Email Notifications</p>
              <p className="text-sm text-secondary-600">Receive notifications via email</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type='checkbox'
                        checked={settings.emailNotifications}
                        onChange={(e) => onSettingChange('emailNotifications', e.target.checked)}
                        disabled={isReadOnly}
                        className='sr-only peer'
                      />
            <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-secondary-900">SMS Notifications</p>
              <p className="text-sm text-secondary-600">Receive notifications via SMS</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type='checkbox'
                        checked={settings.smsNotifications}
                        onChange={(e) => onSettingChange('smsNotifications', e.target.checked)}
                        disabled={isReadOnly}
                        className='sr-only peer'
                      />
            <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-secondary-900">Push Notifications</p>
              <p className="text-sm text-secondary-600">Receive browser push notifications</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type='checkbox'
                        checked={settings.pushNotifications}
                        onChange={(e) => onSettingChange('pushNotifications', e.target.checked)}
                        disabled={isReadOnly}
                        className='sr-only peer'
                      />
            <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-medium text-secondary-900">Booking Alerts</p>
              <p className="text-sm text-secondary-600">Get notified of new bookings</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type='checkbox'
                        checked={settings.bookingAlerts}
                        onChange={(e) => onSettingChange('bookingAlerts', e.target.checked)}
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
