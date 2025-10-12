'use client';

import Layout from '@/components/Layout';

export default function TestAdminPage() {
  return (
    <Layout userType="admin">
      <div className="space-y-6">
        <div className="card">
          <h1 className="text-2xl font-bold text-secondary-900">Test Admin Page</h1>
          <p className="text-secondary-600">This is a simple test to see if the admin layout works.</p>
        </div>
        
        <div className="card">
          <h2 className="text-lg font-semibold text-secondary-900">Admin Stats Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,250</div>
              <div className="text-sm text-blue-800">Total Hotels</div>
            </div>
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">1,180</div>
              <div className="text-sm text-green-800">Active Hotels</div>
            </div>
            <div className="text-center p-4 bg-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">45,000</div>
              <div className="text-sm text-purple-800">Total Rooms</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
