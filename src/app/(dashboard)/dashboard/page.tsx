"use client";

import ProductionDashboard from "@/components/dashboard/ProductionDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  // Only SuperAdmin and Manager can access dashboard (enforced by route permissions)
  return (
    <ProtectedRoute>
      <ProductionDashboard />
    </ProtectedRoute>
  );
}
