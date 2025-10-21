"use client";

import { useState, useEffect } from "react";
import Layout from "@/app/(dashboard)/layout";
import {
  Plus,
  Search,
  Filter,
  Bed,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Users,
  Wifi,
  Tv,
  Car,
  Coffee,
  Waves,
  Mountain,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Star,
  Calendar,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { mockRooms, mockRoomTypes, mockRatePlans } from "@/data/mockData";
import { Room, RoomType, RatePlan } from "@/types";
import AddRoomModal from "@/components/room-management/AddRoomModal";
import AddRoomTypeModal from "@/components/room-management/AddRoomTypeModal";
import { countries } from "@/resources/auth";
import RoomManagementCard from "./RoomManagementCard";
import { RoomStatus } from "@/types/room-management/enum";
import Rooms from "./Rooms";
import RoomTypes from "./RoomTypes";

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

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.room_type_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || room.status === statusFilter;
    const matchesType =
      typeFilter === "all" || room.room_type_id === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "cleaning":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

    const getStatusIcon = (status: string) => {
    switch (status) {
      case RoomStatus.Available:
        return "✓";
      case RoomStatus.Occupied:
        return "🏠";
      case RoomStatus.Maintenance:
        return "🔧";
      case RoomStatus.Cleaning:
        return "🧹";
      case RoomStatus.Unavailable:
        return "x";
      default:
        return "❓";
    }
  };


  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case "available":
  //       return "✓";
  //     case "occupied":
  //       return "🏠";
  //     case "maintenance":
  //       return "🔧";
  //     case "cleaning":
  //       return "🧹";
  //     default:
  //       return "❓";
  //   }
  // };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-3 h-3" />;
      case "tv":
        return <Tv className="w-3 h-3" />;
      case "parking":
        return <Car className="w-3 h-3" />;
      case "coffee":
        return <Coffee className="w-3 h-3" />;
      case "pool":
        return <Waves className="w-3 h-3" />;
      case "mountain view":
        return <Mountain className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  const handleStatusChange = (roomId: string, newStatus: Room["status"]) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.room_id === roomId ? { ...room, status: newStatus } : room
      )
    );
  };

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

  const tabs = [
    { id: "rooms", name: "Rooms", icon: Bed },
    { id: "room-types", name: "Room Types", icon: Star },
    { id: "rate-plans", name: "Rate Plans", icon: DollarSign },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "settings", name: "Settings", icon: Settings },
  ];

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
        <div className="border-b border-secondary-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Rate Plans
                </h3>
                <button
                  onClick={() => setShowNewRatePlan(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rate Plan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ratePlans.map((plan) => (
                  <div key={plan.rate_plan_id} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-secondary-900">
                        {plan.name}
                      </h4>
                      <span className="text-sm font-medium text-primary-600">
                        {plan.code}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600">
                          Sample Rate
                        </span>
                        <span className="text-sm font-medium text-secondary-900">
                          ${Object.values(plan.rates)[0] || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600">
                          Status
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            plan.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {plan.status}
                        </span>
                      </div>

                      <div>
                        <span className="text-sm text-secondary-600">
                          Rules
                        </span>
                        <div className="text-xs text-secondary-500 mt-1">
                          <p>
                            • Cancellation: {plan.rules.cancellation_policy}
                          </p>
                          <p>
                            • Advance Booking: {plan.rules.advance_booking_days}{" "}
                            days
                          </p>
                          <p>• Min Stay: {plan.rules.min_los} nights</p>
                          <p>• Max Stay: {plan.rules.max_los} nights</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-secondary-200">
                      <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
                        <Edit className="w-3 h-3 inline mr-1" />
                        Edit
                      </button>
                      <button className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-900">
                Room Analytics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-600">
                        Occupancy Rate
                      </p>
                      <p className="text-2xl font-bold text-secondary-900">
                        78.5%
                      </p>
                      <p className="text-sm text-green-600">
                        +5.2% vs last month
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-600">
                        ADR
                      </p>
                      <p className="text-2xl font-bold text-secondary-900">
                        $245
                      </p>
                      <p className="text-sm text-blue-600">
                        +8.3% vs last month
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-600">
                        RevPAR
                      </p>
                      <p className="text-2xl font-bold text-secondary-900">
                        $192
                      </p>
                      <p className="text-sm text-purple-600">
                        +12.5% vs last month
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-600">
                        Average Stay
                      </p>
                      <p className="text-2xl font-bold text-secondary-900">
                        2.8 nights
                      </p>
                      <p className="text-sm text-orange-600">
                        +0.3 vs last month
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-secondary-900">
                Hotel Settings
              </h3>

              <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
                <h4 className="text-md font-medium text-secondary-900 mb-4">
                  General Settings
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Country
                    </label>
                    <select
                      value={hotelSettings.country}
                      onChange={(e) =>
                        setHotelSettings({
                          ...hotelSettings,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select your country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={hotelSettings.currency}
                      onChange={(e) =>
                        setHotelSettings({
                          ...hotelSettings,
                          currency: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="BRL">BRL - Brazilian Real</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={hotelSettings.timezone}
                      onChange={(e) =>
                        setHotelSettings({
                          ...hotelSettings,
                          timezone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="UTC">
                        UTC - Coordinated Universal Time
                      </option>
                      <option value="America/New_York">
                        EST - Eastern Time
                      </option>
                      <option value="America/Chicago">
                        CST - Central Time
                      </option>
                      <option value="America/Denver">
                        MST - Mountain Time
                      </option>
                      <option value="America/Los_Angeles">
                        PST - Pacific Time
                      </option>
                      <option value="Europe/London">
                        GMT - Greenwich Mean Time
                      </option>
                      <option value="Europe/Paris">
                        CET - Central European Time
                      </option>
                      <option value="Asia/Tokyo">
                        JST - Japan Standard Time
                      </option>
                      <option value="Asia/Shanghai">
                        CST - China Standard Time
                      </option>
                      <option value="Asia/Kolkata">
                        IST - India Standard Time
                      </option>
                      <option value="Australia/Sydney">
                        AEST - Australian Eastern Time
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Language
                    </label>
                    <select
                      value={hotelSettings.language}
                      onChange={(e) =>
                        setHotelSettings({
                          ...hotelSettings,
                          language: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="ru">Russian</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="zh">Chinese</option>
                      <option value="ar">Arabic</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-secondary-200">
                  <button
                    onClick={() => {
                      console.log("Saving hotel settings:", hotelSettings);
                      // Here you would typically save to backend
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Room Details
              </h2>
              <button
                onClick={() => setSelectedRoom(null)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-secondary-900">
                    Room Information
                  </h4>
                  <p className="text-sm text-secondary-600">
                    Number: {selectedRoom.room_number}
                  </p>
                  <p className="text-sm text-secondary-600">
                    Type: {selectedRoom.room_type_id}
                  </p>
                  <p className="text-sm text-secondary-600">
                    Floor: {selectedRoom.floor}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900">Status</h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      selectedRoom.status
                    )}`}
                  >
                    {getStatusIcon(selectedRoom.status)}
                    <span className="ml-1 capitalize">
                      {selectedRoom.status}
                    </span>
                  </span>
                </div>
              </div>

              {selectedRoom.last_cleaned && (
                <div>
                  <h4 className="font-medium text-secondary-900">
                    Last Cleaned
                  </h4>
                  <p className="text-sm text-secondary-600">
                    {isClient
                      ? new Date(selectedRoom.last_cleaned).toLocaleDateString()
                      : "--/--/----"}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
              >
                Close
              </button>
              <button className="btn-primary">
                <Edit className="w-4 h-4 mr-2" />
                Edit Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Room Modal */}
      {showNewRoom && <AddRoomModal addRoomType={() => setShowNewRoomType(true)} onClose={() => setShowNewRoom(false)} />}

      {/* New Room Type Modal */}
      {showNewRoomType && (
        <AddRoomTypeModal onClose={() => setShowNewRoomType(false)} />
      )}

      {/* New Rate Plan Modal */}
      {showNewRatePlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Add New Rate Plan
              </h2>
              <button
                onClick={() => setShowNewRatePlan(false)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNewRatePlanSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Rate Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRatePlanForm.name}
                    onChange={(e) =>
                      setNewRatePlanForm({
                        ...newRatePlanForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Standard Rate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Rate Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRatePlanForm.code}
                    onChange={(e) =>
                      setNewRatePlanForm({
                        ...newRatePlanForm,
                        code: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., STD"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRatePlanForm.description}
                    onChange={(e) =>
                      setNewRatePlanForm({
                        ...newRatePlanForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe this rate plan..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newRatePlanForm.status}
                    onChange={(e) =>
                      setNewRatePlanForm({
                        ...newRatePlanForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Base Rate ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newRatePlanForm.rates["2024-01-01"]}
                    onChange={(e) =>
                      setNewRatePlanForm({
                        ...newRatePlanForm,
                        rates: {
                          "2024-01-01": parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="150.00"
                  />
                </div>
              </div>

              <div className="border-t border-secondary-200 pt-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Rate Rules
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Minimum Length of Stay
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newRatePlanForm.rules.min_los}
                      onChange={(e) =>
                        setNewRatePlanForm({
                          ...newRatePlanForm,
                          rules: {
                            ...newRatePlanForm.rules,
                            min_los: parseInt(e.target.value) || 1,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Maximum Length of Stay
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newRatePlanForm.rules.max_los}
                      onChange={(e) =>
                        setNewRatePlanForm({
                          ...newRatePlanForm,
                          rules: {
                            ...newRatePlanForm.rules,
                            max_los: parseInt(e.target.value) || 30,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Advance Booking Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newRatePlanForm.rules.advance_booking_days}
                      onChange={(e) =>
                        setNewRatePlanForm({
                          ...newRatePlanForm,
                          rules: {
                            ...newRatePlanForm.rules,
                            advance_booking_days: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Cancellation Policy
                    </label>
                    <select
                      value={newRatePlanForm.rules.cancellation_policy}
                      onChange={(e) =>
                        setNewRatePlanForm({
                          ...newRatePlanForm,
                          rules: {
                            ...newRatePlanForm.rules,
                            cancellation_policy: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="24 hours">24 hours</option>
                      <option value="48 hours">48 hours</option>
                      <option value="72 hours">72 hours</option>
                      <option value="7 days">7 days</option>
                      <option value="14 days">14 days</option>
                      <option value="non-refundable">Non-refundable</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
                <button
                  type="button"
                  onClick={() => setShowNewRatePlan(false)}
                  className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rate Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
