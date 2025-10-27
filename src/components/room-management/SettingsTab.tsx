'use client';

import { countries } from "@/resources/auth";

interface SettingsTabProps {
  hotelSettings: {
    country: string;
    currency: string;
    timezone: string;
    language: string;
  };
  onSettingsChange: (field: string, value: string) => void;
  onSaveSettings: () => void;
}

export default function SettingsTab({ 
  hotelSettings, 
  onSettingsChange, 
  onSaveSettings 
}: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900">
        Hotel Settings
      </h3>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <h4 className="text-md font-medium text-secondary-900 mb-4">
          General Settings
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Country
            </label>
            <select
              value={hotelSettings.country}
              onChange={(e) => onSettingsChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Currency
            </label>
            <select
              value={hotelSettings.currency}
              onChange={(e) => onSettingsChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CHF">CHF - Swiss Franc</option>
              <option value="CNY">CNY - Chinese Yuan</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="BRL">BRL - Brazilian Real</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Timezone
            </label>
            <select
              value={hotelSettings.timezone}
              onChange={(e) => onSettingsChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="UTC">
                UTC - Coordinated Universal Time
              </option>
              <option value="America/New_York">
                EST - Eastern Time
              </option>
              <option value="America/Chicago">
                CST - Central Time
              </option>
              <option value="America/Denver">
                MST - Mountain Time
              </option>
              <option value="America/Los_Angeles">
                PST - Pacific Time
              </option>
              <option value="Europe/London">
                GMT - Greenwich Mean Time
              </option>
              <option value="Europe/Paris">
                CET - Central European Time
              </option>
              <option value="Asia/Tokyo">
                JST - Japan Standard Time
              </option>
              <option value="Asia/Shanghai">
                CST - China Standard Time
              </option>
              <option value="Asia/Kolkata">
                IST - India Standard Time
              </option>
              <option value="Australia/Sydney">
                AEST - Australian Eastern Time
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Language
            </label>
            <select
              value={hotelSettings.language}
              onChange={(e) => onSettingsChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="zh">Chinese</option>
              <option value="ar">Arabic</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-secondary-200">
          <button
            onClick={onSaveSettings}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}








