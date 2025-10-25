'use client';

import { Plus } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";

interface StaysHeaderProps {
  onCreateStay: () => void;
}

export default function StaysHeader({ onCreateStay }: StaysHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stay Management</h1>
        <p className="text-gray-600">
          Manage reservations, bookings, and walk-ins
        </p>
      </div>
      <RoleGuard allowedRoles={["admin", "manager", "front_desk"]}>
        <button
          onClick={onCreateStay}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Stay
        </button>
      </RoleGuard>
    </div>
  );
}




