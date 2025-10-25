'use client';

import { Search } from 'lucide-react';

interface FacilityFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'pool', label: 'Pool' },
  { value: 'gym', label: 'Gym' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bar', label: 'Bar' },
  { value: 'spa', label: 'Spa' },
  { value: 'business_center', label: 'Business Center' },
  { value: 'concierge', label: 'Concierge' },
  { value: 'parking', label: 'Parking' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'gift_shop', label: 'Gift Shop' },
  { value: 'event_space', label: 'Event Space' },
  { value: 'rooftop', label: 'Rooftop' },
  { value: 'lobby', label: 'Lobby' },
  { value: 'security', label: 'Security' }
];

export default function FacilityFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange
}: FacilityFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
      
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        {categories.map(category => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
      
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="all">All Status</option>
        <option value="operational">Operational</option>
        <option value="maintenance">Maintenance</option>
        <option value="closed">Closed</option>
        <option value="renovation">Renovation</option>
      </select>
      
    </div>
  );
}

