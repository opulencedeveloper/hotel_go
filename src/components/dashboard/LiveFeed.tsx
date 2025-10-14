'use client';

import { useState, useEffect } from 'react';

interface SyncEvent {
  sync_event_id: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  status: 'completed' | 'failed' | 'pending' | 'processing';
  created_at: string;
}

interface LiveFeedProps {
  events: SyncEvent[];
}

export default function LiveFeed({ events }: LiveFeedProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
        <span className="text-sm text-secondary-600">Live Feed</span>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {events.slice(0, 5).map((event) => (
          <div key={event.sync_event_id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${
              event.status === 'completed' ? 'bg-green-500' : 
              event.status === 'failed' ? 'bg-red-500' : 
              event.status === 'processing' ? 'bg-blue-500' : 'bg-yellow-500'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-900">
                {event.event_type === 'push' ? 'Data synced' : 
                 event.event_type === 'pull' ? 'Data updated' : 
                 event.event_type === 'conflict' ? 'Sync conflict' : 'Sync error'}
              </p>
              <p className="text-sm text-secondary-600">
                {event.entity_type} - {event.entity_id}
              </p>
            </div>
            <div className="text-sm text-secondary-500">
              {isClient ? new Date(event.created_at).toLocaleTimeString() : '--:--:--'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

