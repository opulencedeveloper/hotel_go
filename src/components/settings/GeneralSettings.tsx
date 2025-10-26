'use client';

interface GeneralSettingsProps {
  settings: {
    propertyName: string;
    propertyType: string;
    timezone: string;
    currency: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
  };
  onSettingChange: (key: string, value: any) => void;
  isReadOnly?: boolean;
}

export default function GeneralSettings({ settings, onSettingChange, isReadOnly = true }: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">General Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Property Name
          </label>
          <input
            type="text"
            value={settings.propertyName}
            onChange={(e) => onSettingChange('propertyName', e.target.value)}
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
        
        {/* <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Property Type
          </label>
          <select
            value={settings.propertyType}
            onChange={(e) => onSettingChange('propertyType', e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          >
            <option value="hotel">Hotel</option>
            <option value="resort">Resort</option>
            <option value="motel">Motel</option>
            <option value="boutique">Boutique Hotel</option>
          </select>
        </div> */}
        
        {/* <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => onSettingChange('timezone', e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Paris (CET)</option>
            <option value="Asia/Tokyo">Tokyo (JST)</option>
          </select>
        </div> */}
        
        {/* <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Currency
          </label>
          <select
            value={settings.currency}
            onChange={(e) => onSettingChange('currency', e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
        </div> */}
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Date Format
          </label>
          <select
            value={settings.dateFormat}
            onChange={(e) => onSettingChange('dateFormat', e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Time Format
          </label>
          <select
            value={settings.timeFormat}
            onChange={(e) => onSettingChange('timeFormat', e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          >
            <option value="12h">12 Hour (AM/PM)</option>
            <option value="24h">24 Hour</option>
          </select>
        </div>
      </div>
    </div>
  );
}
