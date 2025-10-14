'use client';

interface ArrivalDeparture {
  guest: string;
  room: string;
  time: string;
  status: 'confirmed' | 'ready';
  date: string;
}

interface ArrivalsDeparturesProps {
  arrivals: ArrivalDeparture[];
  departures: ArrivalDeparture[];
}

export default function ArrivalsDepartures({ arrivals, departures }: ArrivalsDeparturesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Today's Arrivals */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Today's Arrivals</h3>
          <span className="text-sm text-secondary-600">Next 48h</span>
        </div>
        <div className="space-y-3">
          {arrivals.map((arrival, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">{arrival.guest}</p>
                  <p className="text-xs text-secondary-600">Room {arrival.room}</p>
                  <p className="text-xs text-secondary-500">{arrival.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-secondary-900">{arrival.time}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  arrival.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {arrival.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Departures */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Today's Departures</h3>
          <span className="text-sm text-secondary-600">Next 48h</span>
        </div>
        <div className="space-y-3">
          {departures.map((departure, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">{departure.guest}</p>
                  <p className="text-xs text-secondary-600">Room {departure.room}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-secondary-900">{departure.time}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  departure.status === 'ready' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {departure.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

