'use client';

import { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  icon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, icon: Icon, size = 'md' }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${getStatusColor(status)} ${sizeClasses[size]}`}>
      {Icon && <Icon className="w-4 h-4 mr-1" />}
      <span className="capitalize">{status.replace('-', ' ')}</span>
    </span>
  );
}

