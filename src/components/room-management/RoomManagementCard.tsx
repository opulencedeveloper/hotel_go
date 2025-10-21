import { mockRooms } from "@/data/mockData";
import { Room } from "@/types";
import { RoomManagementCardProps } from "@/types/room-management/room-management";
import { Bed, DollarSign, Plus, Star } from "lucide-react";
import { useState } from "react";

export default function RoomManagementCard({addRoom, addRoomType, addRatePlan} : RoomManagementCardProps) {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
      const roomStats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length
  };



    return  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Room Management</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">Rooms, Types & Rates</span>
                </div>
              </div>
              
              <p className="text-blue-100 text-lg mb-6">
                Comprehensive room management system for types, rates, and availability.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Bed className="w-4 h-4" />
                  <span className="text-blue-100">Total Rooms:</span>
                  <span className="font-medium">{roomStats.total}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-blue-200">Available:</span>
                  <span className="font-medium">{roomStats.available}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-blue-200">Occupied:</span>
                  <span className="font-medium">{roomStats.occupied}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-blue-200">Maintenance:</span>
                  <span className="font-medium">{roomStats.maintenance}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={addRoom}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Room</span>
                </button>
                <button 
                  onClick={addRoomType}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <Star className="w-4 h-4" />
                  <span>Add Room Type</span>
                </button>
                <button 
                  onClick={addRatePlan}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Add Rate Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
}