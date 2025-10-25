"use client";

import { useState, useEffect } from "react";
import { mockRooms, mockRoomTypes, mockRatePlans } from "@/data/mockData";
import { Room, RoomType, RatePlan } from "@/types";
import AddRoomModal from "@/components/room-management/AddRoomModal";
import AddRoomTypeModal from "@/components/room-management/AddRoomTypeModal";
import RoomManagementCard from "./RoomManagementCard";
import { RoomStatus } from "@/types/room-management/enum";
import Rooms from "./Rooms";
import RoomTypes from "./RoomTypes";

// Import individual room management components
import RoomManagementTabs from './RoomManagementTabs';
import RatePlansTab from './RatePlansTab';
import AnalyticsTab from './AnalyticsTab';
import SettingsTab from './SettingsTab';
import RoomDetailsModal from './RoomDetailsModal';
import NewRatePlanModal from './NewRatePlanModal';

export default function RoomManagementBody() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("rooms");
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [ratePlans, setRatePlans] = useState<RatePlan[]>(mockRatePlans);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [showNewRoomType, setShowNewRoomType] = useState(false);
  const [showNewRatePlan, setShowNewRatePlan] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Hotel settings state
  const [hotelSettings, setHotelSettings] = useState({
    country: "",
    currency: "USD",
    timezone: "UTC",
    language: "en",
  });

  // New Rate Plan Form State
  const [newRatePlanForm, setNewRatePlanForm] = useState({
    name: "",
    code: "",
    description: "",
    status: "active",
    rates: {
      "2024-01-01": 150,
    },
    rules: {
      min_los: 1,
      max_los: 30,
      advance_booking_days: 0,
      cancellation_policy: "24 hours",
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleNewRatePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating new rate plan:", newRatePlanForm);
    setShowNewRatePlan(false);
    // Reset form
    setNewRatePlanForm({
      name: "",
      code: "",
      description: "",
      status: "active",
      rates: {
        "2024-01-01": 150,
      },
      rules: {
        min_los: 1,
        max_los: 30,
        advance_booking_days: 0,
        cancellation_policy: "24 hours",
      },
    });
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <RoomManagementCard
        addRatePlan={() => setShowNewRatePlan(true)}
        addRoomType={() => setShowNewRoomType(true)}
        addRoom={() => setShowNewRoom(true)}
      />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <RoomManagementTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="p-6">
          {/* Rooms Tab */}
          {activeTab === "rooms" && (
            <Rooms />
          )}

          {/* Room Types Tab */}
          {activeTab === "room-types" && (
            <RoomTypes />
          )}

          {/* Rate Plans Tab */}
          {activeTab === "rate-plans" && (
            <RatePlansTab
              ratePlans={ratePlans}
              onAddRatePlan={() => setShowNewRatePlan(true)}
              onEditRatePlan={(plan) => console.log('Edit rate plan:', plan)}
              onDeleteRatePlan={(planId) => console.log('Delete rate plan:', planId)}
            />
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <AnalyticsTab />
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <SettingsTab
              hotelSettings={hotelSettings}
              onSettingsChange={(field, value) => setHotelSettings({
                          ...hotelSettings,
                [field]: value
              })}
              onSaveSettings={() => {
                      console.log("Saving hotel settings:", hotelSettings);
                      // Here you would typically save to backend
                    }}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <RoomDetailsModal
        selectedRoom={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        isClient={isClient}
      />

      <AddRoomModal 
        isOpen={showNewRoom}
        addRoomType={() => setShowNewRoomType(true)} 
        onClose={() => setShowNewRoom(false)} 
      />

      <AddRoomTypeModal 
        isOpen={showNewRoomType}
        onClose={() => setShowNewRoomType(false)} 
      />

      <NewRatePlanModal
        isOpen={showNewRatePlan}
        onClose={() => setShowNewRatePlan(false)}
        newRatePlanForm={newRatePlanForm}
        onFormChange={(field, value) => {
          if (field === 'rules') {
                      setNewRatePlanForm({
                        ...newRatePlanForm,
              rules: value
            });
          } else if (field === 'rates') {
                      setNewRatePlanForm({
                        ...newRatePlanForm,
              rates: value
            });
          } else {
                        setNewRatePlanForm({
                          ...newRatePlanForm,
              [field]: value
            });
          }
        }}
        onSubmit={handleNewRatePlanSubmit}
      />
    </div>
  );
}
