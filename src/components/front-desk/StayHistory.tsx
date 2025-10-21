'use client';

import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { StaySliceParams } from '@/store/redux/stay-slice';
import { StayStatus } from '@/utils/enum';
import { 
  Search,
  Filter,
  Calendar,
  User,
  Bed,
  Clock,
  CheckCircle,
  X,
  Eye,
  Printer,
  Download
} from 'lucide-react';

export default function StayHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('checkInDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const stay = useSelector((state: RootState) => state.stay);
  const { stays } = stay;

  // Filter and sort stays
  const filteredStays = useMemo(() => {
    let filtered = stays || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(stay =>
        stay.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stay._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stay.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(stay => stay.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(stay => 
            stay.checkInDate.split('T')[0] === todayStr ||
            stay.checkOutDate.split('T')[0] === todayStr
          );
          break;
        case 'upcoming':
          filtered = filtered.filter(stay => 
            stay.checkInDate.split('T')[0] > todayStr
          );
          break;
        case 'past':
          filtered = filtered.filter(stay => 
            stay.checkOutDate.split('T')[0] < todayStr
          );
          break;
        case 'current':
          filtered = filtered.filter(stay => 
            stay.checkInDate.split('T')[0] <= todayStr &&
            stay.checkOutDate.split('T')[0] >= todayStr
          );
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'checkInDate':
          aValue = new Date(a.checkInDate).getTime();
          bValue = new Date(b.checkInDate).getTime();
          break;
        case 'checkOutDate':
          aValue = new Date(a.checkOutDate).getTime();
          bValue = new Date(b.checkOutDate).getTime();
          break;
        case 'guestName':
          aValue = a.guestName?.toLowerCase() || '';
          bValue = b.guestName?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.checkInDate).getTime();
          bValue = new Date(b.checkInDate).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [stays, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case StayStatus.CONFIRMED:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case StayStatus.CHECKED_IN:
        return `${baseClasses} bg-green-100 text-green-800`;
      case StayStatus.CHECKED_OUT:
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case StayStatus.CANCELLED:
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (type) {
      case 'reservation':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'booking':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'walk-in':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusDisplay = (stay: StaySliceParams) => {
    const statusText = stay.status.charAt(0).toUpperCase() + stay.status.slice(1).replace('_', ' ');
    const statusClass = getStatusBadge(stay.status);
    
    return (
      <div className="flex items-center space-x-2">
        <span className={statusClass}>
          {statusText}
        </span>
        <span className="text-xs text-secondary-500">
          {new Date(stay.updatedAt).toLocaleDateString()}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Stay History</h1>
          <p className="text-secondary-600">Read-only historical records of all stays</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button className="btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="btn-secondary">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search guests, stay ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input w-full"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Statuses</option>
                <option value={StayStatus.CONFIRMED}>Confirmed</option>
                <option value={StayStatus.CHECKED_IN}>Checked In</option>
                <option value={StayStatus.CHECKED_OUT}>Checked Out</option>
                <option value={StayStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="current">Current</option>
                <option value="past">Past</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="input w-full"
              >
                <option value="checkInDate-desc">Check-in (Newest)</option>
                <option value="checkInDate-asc">Check-in (Oldest)</option>
                <option value="checkOutDate-desc">Check-out (Newest)</option>
                <option value="checkOutDate-asc">Check-out (Oldest)</option>
                <option value="guestName-asc">Guest Name (A-Z)</option>
                <option value="guestName-desc">Guest Name (Z-A)</option>
                <option value="status-asc">Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-600">
          Showing {filteredStays.length} of {stays?.length || 0} stays
        </p>
        <div className="flex items-center space-x-4 text-sm text-secondary-600">
          <span>Confirmed: {stays?.filter(s => s.status === StayStatus.CONFIRMED).length || 0}</span>
          <span>Checked In: {stays?.filter(s => s.status === StayStatus.CHECKED_IN).length || 0}</span>
          <span>Completed: {stays?.filter(s => s.status === StayStatus.CHECKED_OUT).length || 0}</span>
          <span>Cancelled: {stays?.filter(s => s.status === StayStatus.CANCELLED).length || 0}</span>
        </div>
      </div>

      {/* Stays Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Stay Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredStays.map((stay) => (
                <tr key={stay._id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary-900">
                          {stay.guestName}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {stay.emailAddress || 'No email'}
                        </div>
                        <div className="text-xs text-secondary-400">
                          ID: {stay._id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={getTypeBadge(stay.type)}>
                          {stay.type}
                        </span>
                        <span className="text-xs text-secondary-500">
                          {stay.adults + stay.children} guests
                        </span>
                      </div>
                      <div className="text-xs text-secondary-500">
                        Room: {stay.roomId?.roomNumber || 'TBD'}
                      </div>
                      {stay.specialRequests && (
                        <div className="text-xs text-secondary-500 mt-1">
                          Requests: {stay.specialRequests}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-secondary-400" />
                        <div>
                          <div className="text-xs text-secondary-500">Check-in</div>
                          <div className="text-sm">{new Date(stay.checkInDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-2 text-secondary-400" />
                        <div>
                          <div className="text-xs text-secondary-500">Check-out</div>
                          <div className="text-sm">{new Date(stay.checkOutDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(stay.status)}>
                      {stay.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900">
                      <div className="text-xs text-secondary-500">Method</div>
                      <div className="text-sm">{stay.paymentMethod}</div>
                      <div className="text-xs text-secondary-500 mt-1">Status</div>
                      <div className="text-sm">{stay.paymentStatus}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-700 p-1" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-secondary-600 hover:text-secondary-700 p-1" title="Print Receipt">
                        <Printer className="w-4 h-4" />
                      </button>
                      {getStatusDisplay(stay)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredStays.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No stays found</h3>
          <p className="text-secondary-500">
            {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'No stays have been created yet.'}
          </p>
        </div>
      )}
    </div>
  );
}