'use client';

import { useState, useEffect } from 'react';

// Import individual facility components
import FacilityHeader from './FacilityHeader';
import FacilityFilters from './FacilityFilters';
import FacilityGrid from './FacilityGrid';
import NewFacilityModal from './NewFacilityModal';
import EditFacilityModal from './EditFacilityModal';
import MaintenanceModal from './MaintenanceModal';
import SecurityModal from './SecurityModal';
import FacilityDetailsModal from './FacilityDetailsModal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { facilityActions } from '@/store/redux/facility-slice';

// Use the Redux Facility interface
import { Facility } from '@/store/redux/facility-slice';


export default function FacilitiesBody() {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewFacility, setShowNewFacility] = useState(false);
  const [showEditFacility, setShowEditFacility] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  
  // Get facilities from Redux state
  const facility = useSelector((state: RootState) => state.facilities);
  const { facilities } = facility;

  // New Facility Form State - matching Redux Facility interface
  const [newFacilityForm, setNewFacilityForm] = useState({
    facilityName: '',
    category: '',
    description: '',
    location: '',
    floor: 1,
    capacity: 1,
    status: 'operational'
  });

  // Edit Facility Form State
  const [editFacilityForm, setEditFacilityForm] = useState({
    facilityName: '',
    category: '',
    description: '',
    location: '',
    floor: 1,
    capacity: 1,
    status: 'operational'
  });

  // Maintenance Form State
  const [maintenanceForm, setMaintenanceForm] = useState({
    facility_id: '',
    maintenance_type: 'routine',
    description: '',
    priority: 'medium',
    scheduled_date: '',
    estimated_duration: 60,
    assigned_staff: '',
    notes: ''
  });

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    facility_id: '',
    security_level: 'standard',
    access_restrictions: '',
    monitoring_status: 'active',
    emergency_contacts: '',
    security_notes: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || facility.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || facility.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });


  const handleNewFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating new facility:', newFacilityForm);
    setShowNewFacility(false);
    // Reset form
    setNewFacilityForm({
      facilityName: '',
      category: '',
      description: '',
      location: '',
      floor: 1,
      capacity: 1,
      status: 'operational'
    });
  };

  const handleFacilityCreated = (newFacility: any) => {
    // Add the new facility to Redux state
    dispatch(facilityActions.addFacility(newFacility));
    console.log('New facility added to Redux state:', newFacility);
  };

  const handleEditFacility = (facility: Facility) => {
    setEditingFacility(facility);
    setEditFacilityForm({
      facilityName: facility.facilityName,
      category: facility.category,
      description: facility.description,
      location: facility.location,
      floor: facility.floor,
      capacity: facility.capacity,
      status: facility.status
    });
    setShowEditFacility(true);
  };

  const handleEditFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating facility:', editFacilityForm);
    setShowEditFacility(false);
    setEditingFacility(null);
    // Reset form
    setEditFacilityForm({
      facilityName: '',
      category: '',
      description: '',
      location: '',
      floor: 1,
      capacity: 1,
      status: 'operational'
    });
  };

  const handleFacilityUpdated = (updatedFacility: any) => {
    // Update the facility in Redux state
    dispatch(facilityActions.updateFacility(updatedFacility));
    console.log('Facility updated in Redux state:', updatedFacility);
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating maintenance request:', maintenanceForm);
    setShowMaintenanceModal(false);
    // Reset form
    setMaintenanceForm({
      facility_id: '',
      maintenance_type: 'routine',
      description: '',
      priority: 'medium',
      scheduled_date: '',
      estimated_duration: 60,
      assigned_staff: '',
      notes: ''
    });
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating security settings:', securityForm);
    setShowSecurityModal(false);
  };

  const facilityStats = {
    total: facilities.length,
    operational: facilities.filter(f => f.status === 'operational').length,
    maintenance: facilities.filter(f => f.status === 'maintenance').length,
    closed: facilities.filter(f => f.status === 'closed').length,
    renovation: facilities.filter(f => f.status === 'renovation').length
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <FacilityHeader
        facilityStats={facilityStats}
        onAddFacility={() => setShowNewFacility(true)}
        onMaintenance={() => setShowMaintenanceModal(true)}
        onSecurity={() => setShowSecurityModal(true)}
      />

      {/* Search and Filters */}
      <FacilityFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Facilities Grid */}
      <FacilityGrid
        facilities={filteredFacilities}
        onViewFacility={setSelectedFacility}
        onEditFacility={handleEditFacility}
      />

      {/* Modals */}
      <NewFacilityModal
        isOpen={showNewFacility}
        onClose={() => setShowNewFacility(false)}
        newFacilityForm={newFacilityForm}
        onFormChange={(field, value) => {
          setNewFacilityForm({...newFacilityForm, [field]: value});
        }}
        onSubmit={handleNewFacilitySubmit}
        onSuccess={handleFacilityCreated}
      />

      <EditFacilityModal
        isOpen={showEditFacility}
        onClose={() => setShowEditFacility(false)}
        editingFacility={editingFacility}
        editFacilityForm={editFacilityForm}
        onFormChange={(field, value) => {
          setEditFacilityForm({...editFacilityForm, [field]: value});
        }}
        onSubmit={handleEditFacilitySubmit}
        onSuccess={handleFacilityUpdated}
      />

      <MaintenanceModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        facilities={facilities}
        maintenanceForm={maintenanceForm}
        onFormChange={(field, value) => setMaintenanceForm({...maintenanceForm, [field]: value})}
        onSubmit={handleMaintenanceSubmit}
      />

      <SecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        facilities={facilities}
        securityForm={securityForm}
        onFormChange={(field, value) => setSecurityForm({...securityForm, [field]: value})}
        onSubmit={handleSecuritySubmit}
      />

      <FacilityDetailsModal
        selectedFacility={selectedFacility}
        onClose={() => setSelectedFacility(null)}
        onEdit={(facility) => {
          // TODO: Implement edit facility functionality
          console.log('Edit facility:', facility);
        }}
      />
      </div>
    
  );
}
