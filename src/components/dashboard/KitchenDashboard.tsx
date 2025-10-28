'use client';

export default function KitchenDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Kitchen Stations</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-secondary-600">Hot Station</span>
              <span className="font-semibold text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Cold Station</span>
              <span className="font-semibold text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Pastry Station</span>
              <span className="font-semibold text-yellow-600">Preparing</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Active Orders</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-sm">Room 201 - Caesar Salad</span>
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">5 min</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
              <span className="text-sm">Room 305 - Grilled Salmon</span>
              <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">12 min</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm">Room 102 - Room Service</span>
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









