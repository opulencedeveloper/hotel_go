'use client';

import { 
  Bed,
  Star,
  DollarSign,
  BarChart3,
  Settings
} from "lucide-react";

interface RoomManagementTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function RoomManagementTabs({ activeTab, onTabChange }: RoomManagementTabsProps) {
  const tabs = [
    { id: "rooms", name: "Rooms", icon: Bed },
    { id: "room-types", name: "Room Types", icon: Star },
    // { id: "rate-plans", name: "Rate Plans", icon: DollarSign },
    // { id: "analytics", name: "Analytics", icon: BarChart3 },
    // { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <div className="border-b border-secondary-200">
      <nav className="flex space-x-8 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}









