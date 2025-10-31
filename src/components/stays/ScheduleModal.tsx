'use client';

import { HotelServiceStatus } from '@/lib/server/hotelService/enum';
import { Calendar, X, MapPin, Users, Tag, DollarSign, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatPrice } from '@/helper';
import { paymentMethodList } from '@/resources';

interface Service {
  _id: string;
  name: string;
  category: string;
  location: string;
  capacity: number;
  description: string;
  price: number;
  status: string;
  updatedAt: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  scheduleForm: {
    service_id: string;
    date: string;
    time: string;
    notes: string;
    paymentMethod?: string;
  };
  onFormChange: (field: string, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  error?: any;
  mode?: 'create' | 'edit';
}

export default function ScheduleModal({ 
  isOpen, 
  onClose, 
  services, 
  scheduleForm, 
  onFormChange, 
  onSubmit,
  isLoading = false,
  error,
  mode = 'create'
}: ScheduleModalProps) {
  if (!isOpen) return null;

  const hotel = useSelector((state: RootState) => state.hotel);
  const selectedHotel = hotel?.hotels?.find((h) => h._id === hotel.selectedHotelId);
  
  // Find the selected service
  const selectedService = services.find(service => service._id === scheduleForm.service_id);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0 p-0" style={{ margin: 0, padding: 0, top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">
            {mode === 'edit' ? 'Edit Scheduled Service' : 'Schedule Service'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800 text-sm">
                {error || 'An error occurred while scheduling the service. Please try again.'}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Service *
              </label>
              <select
                required
                value={scheduleForm.service_id}
                onChange={(e) => onFormChange('service_id', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Service</option>
                {services.filter(service => service.status === HotelServiceStatus.ACTIVE).map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name} - {service.price === 0 ? 'Free' : formatPrice(service.price, selectedHotel?.currency)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={scheduleForm.date}
                onChange={(e) => onFormChange('date', e.target.value)}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                style={{ cursor: 'pointer' }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                required
                value={scheduleForm.time}
                onChange={(e) => onFormChange('time', e.target.value)}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                style={{ cursor: 'pointer' }}
              />
            </div>
            
            {/* Selected Service Details */}
            {selectedService && (
              <div className="md:col-span-2 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-5 border border-primary-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <Tag className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-secondary-900">{selectedService.name}</h3>
                    <span className="text-xs text-secondary-500 capitalize">
                      {selectedService.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-secondary-500 mb-0.5">Location</p>
                        <p className="text-sm font-medium text-secondary-900">{selectedService.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-secondary-500 mb-0.5">Capacity</p>
                        <p className="text-sm font-medium text-secondary-900">
                          {selectedService.capacity} {selectedService.capacity === 1 ? 'person' : 'people'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <DollarSign className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-secondary-500 mb-0.5">Price</p>
                        <p className="text-sm font-semibold text-primary-600">
                          {selectedService.price === 0 ? 'Free' : formatPrice(selectedService.price, selectedHotel?.currency)}
                        </p>
                      </div>
                    </div>
                    
                    {selectedService.description && (
                      <div className="flex items-start">
                        <FileText className="w-4 h-4 text-secondary-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-secondary-500 mb-0.5">Description</p>
                          <p className="text-sm text-secondary-700 leading-relaxed">{selectedService.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {mode === 'create' && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Payment Method *
                </label>
                <select
                  required
                  value={scheduleForm.paymentMethod || ''}
                  onChange={(e) => onFormChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select payment method</option>
                  {paymentMethodList.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Notes
              </label>
              <textarea
                value={scheduleForm.notes}
                onChange={(e) => onFormChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Additional notes..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary-600 hover:text-secondary-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {isLoading 
                ? (mode === 'edit' ? 'Updating...' : 'Scheduling...') 
                : (mode === 'edit' ? 'Update Schedule' : 'Schedule Service')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
