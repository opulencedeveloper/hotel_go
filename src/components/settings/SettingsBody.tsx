'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Cog, Building, Clock, Bell, Shield, Palette, Info } from 'lucide-react';
import { RootState } from '@/store/redux';
import SettingsHeader from './SettingsHeader';
import GeneralSettings from './GeneralSettings';
import ContactSettings from './ContactSettings';
import BusinessSettings from './BusinessSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import AppearanceSettings from './AppearanceSettings';
import HotelInfoSettings from './HotelInfoSettings';

export default function SettingsBody() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('hotel-info');
  
  // Get hotel data from Redux state
  const hotel = useSelector((state: RootState) => state.hotel);
  const { hotels, selectedHotelId } = hotel;
  
  // Get the selected hotel data
  const selectedHotel = hotels.find(hotel => hotel._id === selectedHotelId) || hotels[0];
  
  // Create settings object from Redux state only (read-only)
  const settings = {
    // General Settings - Only from Redux state
    propertyName: selectedHotel?.hotelName || 'N/A',
    propertyType: 'hotel', // Default since not in Redux
    timezone: 'N/A', // Not available in Redux
    currency: selectedHotel?.currency || 'N/A',
    language: 'N/A', // Not available in Redux
    dateFormat: 'N/A', // Not available in Redux
    timeFormat: 'N/A', // Not available in Redux
    
    // Contact Information - Only from Redux state
    email: 'N/A', // Not available in Redux
    phone: 'N/A', // Not available in Redux
    address: selectedHotel?.address || 'N/A',
    website: 'N/A', // Not available in Redux
    
    // Business Settings - Not available in Redux
    checkInTime: 'N/A',
    checkOutTime: 'N/A',
    cancellationPolicy: 'N/A',
    petPolicy: 'N/A',
    smokingPolicy: 'N/A',
    
    // Notification Settings - Not available in Redux
    emailNotifications: false,
    smsNotifications: false,
    pushNotifications: false,
    bookingAlerts: false,
    maintenanceAlerts: false,
    systemAlerts: false,
    
    // Security Settings - Not available in Redux
    twoFactorAuth: false,
    sessionTimeout: 0,
    passwordPolicy: 'N/A',
    loginAttempts: 0,
    
    // Appearance Settings - Not available in Redux
    theme: 'N/A',
    primaryColor: 'N/A',
    sidebarCollapsed: false,
    compactMode: false,
    
    // Additional Redux data
    totalRooms: selectedHotel?.totalRooms || 0,
    totalRoomsOccupied: selectedHotel?.totalRoomsOccupied || 0,
    totalRoomsInMaintenance: selectedHotel?.totalRoomsInMaintenance || 0,
    amenities: selectedHotel?.amenities || [],
    createdAt: selectedHotel?.createdAt || 'N/A'
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Since settings are read-only, we don't need change handlers
  const handleSettingChange = () => {
    // No-op: settings are read-only
  };

  const handleSave = () => {
    alert('Settings are read-only. Contact your administrator to make changes.');
  };

  const handleReset = () => {
    alert('Settings are read-only. Contact your administrator to make changes.');
  };

  const tabs = [
    { id: 'hotel-info', name: 'Hotel Info', icon: Info },
    { id: 'general', name: 'General', icon: Cog },
    { id: 'contact', name: 'Contact', icon: Building },
    { id: 'business', name: 'Business', icon: Clock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <SettingsHeader onSave={handleSave} onReset={handleReset} />

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="border-b border-secondary-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab Content */}
          {activeTab === 'hotel-info' && (
            <HotelInfoSettings 
              settings={{
                propertyName: settings.propertyName,
                address: settings.address,
                currency: settings.currency,
                totalRooms: settings.totalRooms,
                totalRoomsOccupied: settings.totalRoomsOccupied,
                totalRoomsInMaintenance: settings.totalRoomsInMaintenance,
                amenities: settings.amenities,
                createdAt: settings.createdAt
              }}
              isReadOnly={true}
            />
          )}

          {activeTab === 'general' && (
              <GeneralSettings 
                settings={{
                  propertyName: settings.propertyName,
                  propertyType: settings.propertyType,
                  timezone: settings.timezone,
                  currency: settings.currency,
                  language: settings.language,
                  dateFormat: settings.dateFormat,
                  timeFormat: settings.timeFormat
                }}
                onSettingChange={handleSettingChange}
                isReadOnly={true}
              />
            )}

          {activeTab === 'contact' && (
            <ContactSettings 
              settings={{
                email: settings.email,
                phone: settings.phone,
                address: settings.address,
                website: settings.website
              }}
              onSettingChange={handleSettingChange}
              isReadOnly={true}
            />
          )}

          {activeTab === 'business' && (
            <BusinessSettings 
              settings={{
                checkInTime: settings.checkInTime,
                checkOutTime: settings.checkOutTime,
                cancellationPolicy: settings.cancellationPolicy,
                petPolicy: settings.petPolicy,
                smokingPolicy: settings.smokingPolicy
              }}
              onSettingChange={handleSettingChange}
              isReadOnly={true}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings 
              settings={{
                emailNotifications: settings.emailNotifications,
                smsNotifications: settings.smsNotifications,
                pushNotifications: settings.pushNotifications,
                bookingAlerts: settings.bookingAlerts,
                maintenanceAlerts: settings.maintenanceAlerts,
                systemAlerts: settings.systemAlerts
              }}
              onSettingChange={handleSettingChange}
              isReadOnly={true}
            />
          )}

          {activeTab === 'security' && (
            <SecuritySettings 
              settings={{
                twoFactorAuth: settings.twoFactorAuth,
                sessionTimeout: settings.sessionTimeout,
                passwordPolicy: settings.passwordPolicy,
                loginAttempts: settings.loginAttempts
              }}
              onSettingChange={handleSettingChange}
              isReadOnly={true}
            />
          )}

          {activeTab === 'appearance' && (
            <AppearanceSettings 
              settings={{
                theme: settings.theme,
                primaryColor: settings.primaryColor,
                sidebarCollapsed: settings.sidebarCollapsed,
                compactMode: settings.compactMode
              }}
              onSettingChange={handleSettingChange}
              isReadOnly={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
