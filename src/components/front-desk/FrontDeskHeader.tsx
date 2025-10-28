'use client';

import Link from 'next/link';
import { Plus, Wifi, WifiOff, History } from "lucide-react";

interface FrontDeskHeaderProps {
  isOffline: boolean;
  onWalkInClick: () => void;
  onNewReservationClick: () => void;
}

export default function FrontDeskHeader({ 
  isOffline, 
  onWalkInClick, 
  onNewReservationClick 
}: FrontDeskHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Front Desk</h1>
        <p className="text-secondary-600">Manage arrivals, departures, and in-house guests</p>
      </div>
      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
        {/* Offline Status */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
          isOffline ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          <span>{isOffline ? 'Offline Mode' : 'Online'}</span>
        </div>
        
        {/* <div className="flex space-x-2">
          <Link 
            href="/stays"
            className="btn-secondary"
          >
            <History className="w-4 h-4 mr-2" />
            Guest History
          </Link>
          <button 
            onClick={onWalkInClick}
            className="btn-secondary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Walk-in
          </button>
          <button 
            onClick={onNewReservationClick}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Reservation
          </button>
        </div> */}
      </div>
    </div>
  );
}









