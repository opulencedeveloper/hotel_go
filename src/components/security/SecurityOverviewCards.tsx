'use client';

import { UserCheck, UserX, Shield, AlertTriangle, UserMinus, Clock, Ban, Plus } from 'lucide-react';

interface SecurityOverviewCardsProps {
  activeUsers: number;
  suspendedUsers: number;
  inactiveUsers: number;
  onLeaveUsers: number;
  terminatedUsers: number;
  pendingUsers: number;
  recentEvents: number;
  criticalEvents: number;
}

export default function SecurityOverviewCards({
  activeUsers,
  suspendedUsers,
  inactiveUsers,
  onLeaveUsers,
  terminatedUsers,
  pendingUsers,
  recentEvents,
  criticalEvents,
}: SecurityOverviewCardsProps) {
  const cards = [
    {
      label: 'Active',
      value: activeUsers,
      subtitle: 'Working',
      icon: UserCheck,
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      subtitleColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      label: 'Suspended',
      value: suspendedUsers,
      subtitle: 'Disciplinary',
      icon: UserX,
      gradient: 'from-red-500 to-rose-600',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      subtitleColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
    {
      label: 'Inactive',
      value: inactiveUsers,
      subtitle: 'Deactivated',
      icon: UserMinus,
      gradient: 'from-gray-400 to-gray-500',
      iconBg: 'bg-gray-50',
      iconColor: 'text-gray-600',
      subtitleColor: 'text-gray-600',
      borderColor: 'border-gray-200',
    },
    {
      label: 'On Leave',
      value: onLeaveUsers,
      subtitle: 'Vacation',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      subtitleColor: 'text-amber-600',
      borderColor: 'border-amber-200',
    },
    {
      label: 'Terminated',
      value: terminatedUsers,
      subtitle: 'No longer employed',
      icon: Ban,
      gradient: 'from-red-600 to-pink-600',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      subtitleColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
    {
      label: 'Pending',
      value: pendingUsers,
      subtitle: 'Awaiting setup',
      icon: Plus,
      gradient: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      subtitleColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden"
          >
            {/* Decorative gradient background */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <div className="relative flex flex-col space-y-4">
              {/* Header with icon */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {card.value}
                  </p>
                  <p className={`text-xs font-medium ${card.subtitleColor}`}>
                    {card.subtitle}
                  </p>
                </div>
                <div className={`p-3 ${card.iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>

              {/* Bottom accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${card.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
