'use client';

import { CheckCircle, Clock, Search, Printer } from 'lucide-react';

interface QuickActionsProps {
  arrivalsCount: number;
  departuresCount: number;
  inHouseCount: number;
  onArrivalsClick: () => void;
  onDeparturesClick: () => void;
  onInHouseClick: () => void;
}

export default function QuickActions({
  arrivalsCount,
  departuresCount,
  inHouseCount,
  onArrivalsClick,
  onDeparturesClick,
  onInHouseClick
}: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button 
        onClick={onArrivalsClick}
        className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
      >
        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-green-700">Check In</p>
        <p className="text-xs text-green-600">{arrivalsCount} arrivals</p>
      </button>
      <button 
        onClick={onDeparturesClick}
        className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
      >
        <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-blue-700">Check Out</p>
        <p className="text-xs text-blue-600">{departuresCount} departures</p>
      </button>
      <button 
        onClick={onInHouseClick}
        className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
      >
        <Search className="w-8 h-8 text-purple-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-purple-700">In-House</p>
        <p className="text-xs text-purple-600">{inHouseCount} guests</p>
      </button>
      <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
        <Printer className="w-8 h-8 text-orange-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-orange-700">Print Reports</p>
        <p className="text-xs text-orange-600">Daily summary</p>
      </button>
    </div>
  );
}

