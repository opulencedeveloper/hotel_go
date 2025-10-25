'use client';

import { Calendar, CreditCard, User } from "lucide-react";
import { StayType } from "@/utils/enum";

interface StaysTabsProps {
  selectedTab: StayType;
  onTabChange: (tab: StayType) => void;
  stays: any[];
}

export default function StaysTabs({ selectedTab, onTabChange, stays }: StaysTabsProps) {
  const tabs = [
    {
      value: StayType.RESERVED,
      label: "Reservations",
      count: stays.filter((s) => s.type === StayType.RESERVED).length,
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      value: StayType.BOOKED,
      label: "Bookings",
      count: stays.filter((s) => s.type === StayType.BOOKED).length,
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      value: StayType.WALK_IN,
      label: "Walk-ins",
      count: stays.filter((s) => s.type === StayType.WALK_IN).length,
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`${
              selectedTab === tab.value
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
            <span
              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                selectedTab === tab.value
                  ? "bg-primary-100 text-primary-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}






