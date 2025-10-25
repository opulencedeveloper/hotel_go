'use client';

import { useState, useEffect } from 'react';
import { useHttp } from '@/hooks/useHttp';

// Import individual service components
import ServiceHeader from './ServiceHeader';
import ServiceFilters from './ServiceFilters';
import ServiceGrid from './ServiceGrid';
import ServiceDetailsModal from './ServiceDetailsModal';
import NewServiceModal from './NewServiceModal';
import EditServiceModal from './EditServiceModal';
import ScheduleModal from './ScheduleModal';
import SettingsModal from './SettingsModal';
import ScheduledServices from './ScheduledServices';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { hotelServicesActions } from '@/store/redux/hotel-services-slice';
import { scheduledServicesActions } from '@/store/redux/scheduled-services-slice';

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


export default function ServicesBody() {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewService, setShowNewService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingScheduledService, setEditingScheduledService] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'scheduled'>('services');
  // const [scheduledServices, setScheduledServices] = useState<any[]>([]);
  const scheduledService = useSelector((state: RootState) => state.scheduledService);
  const {allScheduledServices} = scheduledService;

  const hotelService = useSelector((state: RootState) => state.hotelService);
  const {allHotelServices} = hotelService;
  const dispatch = useDispatch();
  
  // Use Redux state instead of mock data
  const services = allHotelServices || [];

  // HTTP hook for creating services
  const { isLoading: isCreatingService, sendHttpRequest: createServiceReq, error: createServiceError } = useHttp();

  // HTTP hook for updating services
  const { isLoading: isUpdatingService, sendHttpRequest: updateServiceReq, error: updateServiceError } = useHttp();

  // HTTP hook for scheduling services
  const { isLoading: isSchedulingService, sendHttpRequest: scheduleServiceReq, error: scheduleServiceError } = useHttp();

  // HTTP hook for fetching scheduled services
  const { isLoading: isLoadingScheduled, sendHttpRequest: fetchScheduledReq } = useHttp();

  // HTTP hook for editing scheduled services
  const { isLoading: isEditingScheduled, sendHttpRequest: editScheduledReq, error: editScheduledError } = useHttp();

  // HTTP hook for deleting scheduled services
  const { isLoading: isDeletingScheduled, sendHttpRequest: deleteScheduledReq, error: deleteScheduledError } = useHttp();

  // New Service Form State
  const [newServiceForm, setNewServiceForm] = useState({
    name: '',
    category: 'spa',
    price: 0,
    capacity: 1,
    description: '',
    location: '',
    status: 'active'
  });

  // Edit Service Form State
  const [editServiceForm, setEditServiceForm] = useState({
    name: '',
    category: 'spa',
    price: 0,
    capacity: 1,
    description: '',
    location: '',
    status: 'active'
  });

  // Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    service_id: '',
    date: '',
    time: '',
    notes: ''
  });

  // Edit Schedule Form State
  const [editScheduleForm, setEditScheduleForm] = useState({
    service_id: '',
    date: '',
    time: '',
    notes: ''
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    default_duration: 60,
    max_advance_booking: 30,
    cancellation_policy: '24 hours',
    auto_confirm: false,
    require_deposit: false,
    deposit_percentage: 20
  });

  useEffect(() => {
    setIsClient(true);
    fetchScheduledServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Success response handler for creating service
  const createServiceSuccessResHandler = (res: any) => {
    const createdService = res?.data?.data.createdService;
    
    // Check if createdService exists
    if (!createdService || !createdService._id) {
      console.error('Invalid service data received:', createdService);
      return;
    }
    
    // Update Redux state
    dispatch(hotelServicesActions.addHotelService(createdService));
    
    // Close modal and reset form
    setShowNewService(false);
    setNewServiceForm({
      name: '',
      category: 'spa',
      price: 0,
      capacity: 1,
      description: '',
      location: '',
      status: 'active'
    });
  };

  const handleNewServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createServiceReq({
      successRes: createServiceSuccessResHandler,
      requestConfig: {
        url: "/hotel/create-service",
        method: "POST",
        body: {
          ...newServiceForm,
        },
        successMessage: "Service created successfullyaa!"
      },
    });
  };

  // Function to fetch scheduled services
  const fetchScheduledServices = () => {
    fetchScheduledReq({
      requestConfig: {
        url: "/hotel/scheduled-services",
        method: "GET",
      },
      successRes: (res: any) => {
       const resData = res?.data?.data;

       const scheduledServices = resData.scheduledServices;

       console.log("scheduledServices", scheduledServices)

       dispatch(scheduledServicesActions.setScheduledServices(scheduledServices))


       // setScheduledServices(res?.data?.data || []);
      },
    });
  };

  // Success response handler for scheduling service
  const scheduleServiceSuccessResHandler = (res: any) => {
    // Add the new scheduled service to the list
    const newScheduledService = res?.data?.data.newScheduledService;
    if (newScheduledService) {
      dispatch(scheduledServicesActions.updateScheduledService(newScheduledService))
     
    }
    
    // Close modal and reset form
    setShowScheduleModal(false);
    setScheduleForm({
      service_id: '',
      date: '',
      time: '',
      notes: ''
    });
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Merge date and time into scheduledAt
    const scheduledAt = new Date(`${scheduleForm.date}T${scheduleForm.time}`);

    scheduleServiceReq({
      successRes: scheduleServiceSuccessResHandler,
      requestConfig: {
        url: "/hotel/schedule-service",
        method: "POST",
        body: {
          hotelServiceId: scheduleForm.service_id,
          scheduledAt: scheduledAt.toISOString(),
          notes: scheduleForm.notes || undefined
        },
        successMessage: "Service scheduled successfully!"
      },
    });
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating settings:', settingsForm);
    setShowSettingsModal(false);
  };

  const serviceStats = {
    total: services.length,
    active: services.filter(s => s.status === 'active').length,
    inactive: services.filter(s => s.status === 'inactive').length,
    maintenance: services.filter(s => s.status === 'maintenance').length
  };

  const handleViewService = (service: Service) => {
    setSelectedService(service);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setEditServiceForm({
      name: service.name,
      category: service.category,
      price: service.price,
      capacity: service.capacity,
      description: service.description,
      location: service.location,
      status: service.status
    });
    setShowEditService(true);
  };

  // Success response handler for updating service
  const updateServiceSuccessResHandler = (res: any) => {
    const updatedService = res?.data?.data.updatedHotelService;
    
    // Check if updatedService exists
    if (!updatedService || !updatedService._id) {
      console.error('Invalid service data received:', updatedService);
      return;
    }
    
    // Update Redux state
    dispatch(hotelServicesActions.updateHotelService(updatedService));
    
    // Close modal and reset form
    setShowEditService(false);
    setEditingService(null);
    setEditServiceForm({
      name: '',
      category: 'spa',
      price: 0,
      capacity: 1,
      description: '',
      location: '',
      status: 'active'
    });
  };

  const handleEditServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingService) return;

    updateServiceReq({
      successRes: updateServiceSuccessResHandler,
      requestConfig: {
        url: `/hotel/update-service/?hotelServiceId=${editingService._id}`,
        method: "PUT",
        body: {
          ...editServiceForm,
        },
        successMessage: "Service updated successfully!"
      },
    });
  };

  // Handler for editing scheduled service
  const handleEditScheduledService = (scheduledService: any) => {
    setEditingScheduledService(scheduledService);
    
    // Extract date and time from scheduledAt
    const scheduledDate = new Date(scheduledService.scheduledAt);
    const date = scheduledDate.toISOString().split('T')[0];
    const time = scheduledDate.toTimeString().split(' ')[0].substring(0, 5);
    
    setEditScheduleForm({
      service_id: scheduledService.hotelServiceId._id,
      date: date,
      time: time,
      notes: scheduledService.note || ''
    });
    
    setShowEditScheduleModal(true);
  };

  // Handler for editing scheduled service submit
  const handleEditScheduledServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingScheduledService) return;

    // Merge date and time into scheduledAt
    const scheduledAt = new Date(`${editScheduleForm.date}T${editScheduleForm.time}`);

    editScheduledReq({
      successRes: (res: any) => {
        // Update Redux state
        const updatedScheduledService = res?.data?.data?.updatedScheduledService;
        if (updatedScheduledService) {
          dispatch(scheduledServicesActions.updateScheduledService(updatedScheduledService));
        } 
        
        // Close modal and reset form
        setShowEditScheduleModal(false);
        setEditingScheduledService(null);
        setEditScheduleForm({
          service_id: '',
          date: '',
          time: '',
          notes: ''
        });
      },
      requestConfig: {
        url: `/hotel/update-scheduled-service/?scheduledServiceId=${editingScheduledService._id}`,
        method: "PUT",
        body: {
          hotelServiceId: editScheduleForm.service_id,
          scheduledAt: scheduledAt.toISOString(),
          note: editScheduleForm.notes || undefined
        },
        successMessage: "Scheduled service updated successfully!"
      },
    });
  };

  // Handler for deleting scheduled service
  const handleDeleteScheduledService = (scheduledServiceId: string) => {
    if (window.confirm('Are you sure you want to delete this scheduled service?')) {
      deleteScheduledReq({
        successRes: (res: any) => {
          // Update Redux state
          dispatch(scheduledServicesActions.deleteScheduledService(scheduledServiceId));
        },
        requestConfig: {
          url: `/hotel/delete-scheduled-service/?scheduledServiceId=${scheduledServiceId}`,
          method: "DELETE",
          successMessage: "Scheduled service deleted successfully!"
        }
      });
    }
  };


  return (
      <div className="space-y-6">
        {/* Header */}
      <ServiceHeader
        serviceStats={serviceStats}
        onAddService={() => setShowNewService(true)}
        onSchedule={() => setShowScheduleModal(true)}
        onSettings={() => setShowSettingsModal(true)}
      />

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="border-b border-secondary-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                Services ({filteredServices.length})
              </button>
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'scheduled'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                Scheduled ({allScheduledServices?.length || 0})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'services' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <ServiceFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  categoryFilter={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                />

                {/* Services Grid */}
                <ServiceGrid
                  services={filteredServices}
                  onViewService={handleViewService}
                  onEditService={handleEditService}
                />
              </div>
            )}

            {activeTab === 'scheduled' && (
              <ScheduledServices
                scheduledServices={allScheduledServices || []}
                isLoading={isLoadingScheduled}
                onEdit={handleEditScheduledService}
                onDelete={handleDeleteScheduledService}
              />
            )}
          </div>
        </div>

        {/* Modals */}
        <ServiceDetailsModal
          selectedService={selectedService}
          onClose={() => setSelectedService(null)}
        />

        <NewServiceModal
          isOpen={showNewService}
          onClose={() => setShowNewService(false)}
          newServiceForm={newServiceForm}
          onFormChange={(field, value) => {
            setNewServiceForm({...newServiceForm, [field]: value});
          }}
          onSubmit={handleNewServiceSubmit}
          isLoading={isCreatingService}
          error={createServiceError}
        />

        <EditServiceModal
          isOpen={showEditService}
          onClose={() => {
            setShowEditService(false);
            setEditingService(null);
          }}
          editingService={editingService}
          editServiceForm={editServiceForm}
          onFormChange={(field, value) => {
            setEditServiceForm({...editServiceForm, [field]: value});
          }}
          onSubmit={handleEditServiceSubmit}
          isLoading={isUpdatingService}
          error={updateServiceError}
        />

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        services={services}
        scheduleForm={scheduleForm}
        onFormChange={(field, value) => setScheduleForm({...scheduleForm, [field]: value})}
        onSubmit={handleScheduleSubmit}
        isLoading={isSchedulingService}
        error={scheduleServiceError}
        mode="create"
      />

      <ScheduleModal
        isOpen={showEditScheduleModal}
        onClose={() => {
          setShowEditScheduleModal(false);
          setEditingScheduledService(null);
        }}
        services={services}
        scheduleForm={editScheduleForm}
        onFormChange={(field, value) => setEditScheduleForm({...editScheduleForm, [field]: value})}
        onSubmit={handleEditScheduledServiceSubmit}
        isLoading={isEditingScheduled}
        error={editScheduledError}
        mode="edit"
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settingsForm={settingsForm}
        onFormChange={(field, value) => setSettingsForm({...settingsForm, [field]: value})}
        onSubmit={handleSettingsSubmit}
                    />
                  </div>
  );
}
