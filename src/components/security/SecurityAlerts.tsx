'use client';

import { AlertTriangle } from 'lucide-react';

interface SecurityEvent {
  event_id: string;
  description: string;
  event_type: string;
  ip_address: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface SecurityAlertsProps {
  criticalEvents: SecurityEvent[];
  isClient: boolean;
}

export default function SecurityAlerts({ criticalEvents, isClient }: SecurityAlertsProps) {
  if (criticalEvents.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h2 className="text-lg font-semibold text-red-800">Critical Security Alerts</h2>
      </div>
      <div className="space-y-3">
        {criticalEvents.slice(0, 3).map((event) => (
          <div key={event.event_id} className="bg-white border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-secondary-900">{event.description}</h3>
                <p className="text-sm text-secondary-600">
                  {event.event_type} • {event.ip_address} • {isClient ? new Date(event.timestamp).toLocaleString() : '--/--/---- --:--:--'}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                event.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {event.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





