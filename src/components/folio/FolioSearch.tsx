'use client';

import { Search, Printer } from 'lucide-react';

interface FolioSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function FolioSearch({ searchTerm, onSearchChange }: FolioSearchProps) {
  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search by guest name, room, or folio ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 input"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select className="input">
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="pending">Pending</option>
          </select>
          <button className="btn-secondary">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
