'use client';

import { useState } from 'react';
import { mockStaff } from '@/data/mockData';
import { Staff } from '@/types';

export function useStaffState() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewStaff, setShowNewStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const filteredStaff = staff.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusToggle = (staffId: string) => {
    setStaff(prev => prev.map(emp => 
      emp.id === staffId ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' } : emp
    ));
  };

  const handleViewStaff = (staff: Staff) => {
    setSelectedStaff(staff);
  };

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    // Here you could open an edit modal or navigate to edit page
  };

  return {
    // State
    staff,
    filteredStaff,
    searchTerm,
    roleFilter,
    statusFilter,
    showNewStaff,
    selectedStaff,

    // Setters
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    setShowNewStaff,
    setSelectedStaff,

    // Actions
    handleStatusToggle,
    handleViewStaff,
    handleEditStaff,
  };
}
