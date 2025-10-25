'use client';

interface SecurityEvent {
  event_id: string;
  description: string;
  event_type: string;
  ip_address: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface SecurityEventsProps {
  events: SecurityEvent[];
  selectedSeverity: string;
  isClient: boolean;
  onSeverityFilterChange: (severity: string) => void;
}

export default function SecurityEvents({
  events,
  selectedSeverity,
  isClient,
  onSeverityFilterChange,
}: SecurityEventsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-900">Recent Security Events</h2>
          <select 
            value={selectedSeverity}
            onChange={(e) => onSeverityFilterChange(e.target.value)}
            className="border border-secondary-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.event_id} className="border border-secondary-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-secondary-900">{event.description}</h3>
                  <p className="text-sm text-secondary-600">
                    {event.event_type} • {event.ip_address}
                  </p>
                  <p className="text-sm text-secondary-500">
                    {isClient ? new Date(event.timestamp).toLocaleString() : '--/--/---- --:--:--'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {event.severity}
                  </span>
                  <p className="text-xs text-secondary-500 mt-1">
                    {event.resolved ? 'Resolved' : 'Open'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
