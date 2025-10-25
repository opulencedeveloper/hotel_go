'use client';

interface BusinessSettingsProps {
  settings: {
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: string;
    petPolicy: string;
    smokingPolicy: string;
  };
  onSettingChange: (key: string, value: any) => void;
  isReadOnly?: boolean;
}

export default function BusinessSettings({ settings, onSettingChange, isReadOnly = true }: BusinessSettingsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">Business Policies</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Check-in Time
          </label>
          <input
            type="time"
            value={settings.checkInTime}
            onChange={(e) => onSettingChange('checkInTime', e.target.value)}
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Check-out Time
          </label>
          <input
            type="time"
            value={settings.checkOutTime}
            onChange={(e) => onSettingChange('checkOutTime', e.target.value)}
            readOnly={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Cancellation Policy
          </label>
          <select
            value={settings.cancellationPolicy}
            onChange={(e) => onSettingChange('cancellationPolicy', e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          >
            <option value="24h">24 hours</option>
            <option value="48h">48 hours</option>
            <option value="72h">72 hours</option>
            <option value="7d">7 days</option>
            <option value="non-refundable">Non-refundable</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Pet Policy
          </label>
          <select
            value={settings.petPolicy}
            onChange={(e) => onSettingChange('petPolicy', e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          >
            <option value="allowed">Pets Allowed</option>
            <option value="not-allowed">No Pets</option>
            <option value="service-only">Service Animals Only</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Smoking Policy
          </label>
          <select
            value={settings.smokingPolicy}
            onChange={(e) => onSettingChange('smokingPolicy', e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isReadOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          >
            <option value="non-smoking">Non-smoking</option>
            <option value="smoking-rooms">Smoking Rooms Available</option>
            <option value="designated-areas">Designated Areas Only</option>
          </select>
        </div>
      </div>
    </div>
  );
}
