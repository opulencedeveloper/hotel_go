'use client';

import { Calendar, CheckCircle, Clock, Users } from 'lucide-react';

export default function QuickActions() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors">
          <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-primary-700">New Reservation</p>
        </button>
        <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-green-700">Check In Guest</p>
        </button>
        <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
          <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-blue-700">Check Out Guest</p>
        </button>
        <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-purple-700">Add Staff</p>
        </button>
      </div>
    </div>
  );
}

