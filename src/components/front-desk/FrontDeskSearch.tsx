'use client';

import { Search, RefreshCw, Printer } from "lucide-react";

interface FrontDeskSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
  onPrintList: () => void;
}

export default function FrontDeskSearch({ 
  searchTerm, 
  onSearchChange, 
  onRefresh, 
  onPrintList 
}: FrontDeskSearchProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search guests, rooms, or booking references..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 input w-full"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={onRefresh} className="btn-secondary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
        <button onClick={onPrintList} className="btn-secondary">
          <Printer className="w-4 h-4 mr-2" />
          Print List
        </button>
      </div>
    </div>
  );
}











