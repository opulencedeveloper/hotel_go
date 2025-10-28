'use client';

import { ArrowRight, ArrowLeft, UserCheck } from "lucide-react";

interface FrontDeskTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  arrivalsCount: number;
  departuresCount: number;
  inHouseCount: number;
}

export default function FrontDeskTabs({ 
  selectedTab, 
  onTabChange, 
  arrivalsCount, 
  departuresCount, 
  inHouseCount 
}: FrontDeskTabsProps) {
  const tabs = [
    { id: 'arrivals', name: 'Arrivals', count: arrivalsCount, icon: ArrowRight },
    { id: 'departures', name: 'Departures', count: departuresCount, icon: ArrowLeft },
    { id: 'inhouse', name: 'In-House', count: inHouseCount, icon: UserCheck }
  ];

  return (
    <div className="border-b border-secondary-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              selectedTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.name}</span>
            <span className={`py-0.5 px-2 rounded-full text-xs ${
              selectedTab === tab.id
                ? 'bg-primary-100 text-primary-600'
                : 'bg-secondary-100 text-secondary-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}









