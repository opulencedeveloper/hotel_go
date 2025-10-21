import { useHttp } from "@/hooks/useHttp";
import { useDispatch } from "react-redux";
import { 
  setStaff, 
  addStaff, 
  updateStaff, 
  deleteStaff,
  setCurrentStaff,
  setLoading,
  setError,
  updateStaffStatus,
  updateStaffRole,
  updateSalary,
  updatePerformanceRating,
  updateSkills,
  updateCertifications
} from "@/store/slices/staffSlice";
import { Staff } from "@/store/slices/staffSlice";

export const useStaffService = () => {
  const { sendHttpRequest, isLoading, error } = useHttp();
  const dispatch = useDispatch();

  const fetchStaff = async (filters?: {
    role?: string;
    department?: string;
    status?: string;
    search?: string;
  }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString ? `/staff?${queryString}` : '/staff';

    sendHttpRequest({
      requestConfig: {
        url,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setStaff(response.data.data));
        dispatch(setLoading(false));
      }
    });
  };

  const fetchStaffById = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/staff/${id}`,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setCurrentStaff(response.data.data));
        dispatch(setLoading(false));
      }
    });
  };

  const createStaff = async (staffData: Partial<Staff>) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: '/staff',
        method: 'POST',
        body: staffData,
        successMessage: 'Staff member created successfully'
      },
      successRes: (response) => {
        dispatch(addStaff(response.data.data));
        dispatch(setLoading(false));
      }
    });
  };

  const updateStaffById = async (id: string, updates: Partial<Staff>) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/staff/${id}`,
        method: 'PUT',
        body: updates,
        successMessage: 'Staff member updated successfully'
      },
      successRes: (response) => {
        dispatch(updateStaff({ id, updates: response.data.data }));
        dispatch(setLoading(false));
      }
    });
  };

  const deleteStaffById = async (id: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/staff/${id}`,
        method: 'DELETE',
        successMessage: 'Staff member deleted successfully'
      },
      successRes: () => {
        dispatch(deleteStaff(id));
        dispatch(setLoading(false));
      }
    });
  };

  const updateStaffStatusById = async (id: string, status: Staff['status']) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/staff/${id}/status`,
        method: 'PUT',
        body: { status },
        successMessage: 'Staff status updated successfully'
      },
      successRes: () => {
        dispatch(updateStaffStatus({ id, status }));
        dispatch(setLoading(false));
      }
    });
  };

  const updateStaffRoleById = async (id: string, role: Staff['role'], department: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/staff/${id}/role`,
        method: 'PUT',
        body: { role, department },
        successMessage: 'Staff role updated successfully'
      },
      successRes: () => {
        dispatch(updateStaffRole({ id, role, department }));
        dispatch(setLoading(false));
      }
    });
  };

  const updateStaffSalary = async (id: string, salary: number) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/staff/${id}/salary`,
        method: 'PUT',
        body: { salary },
        successMessage: 'Staff salary updated successfully'
      },
      successRes: () => {
        dispatch(updateSalary({ id, salary }));
        dispatch(setLoading(false));
      }
    });
  };

  const updateStaffPerformanceRating = async (id: string, rating: number) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/staff/${id}/performance`,
        method: 'PUT',
        body: { rating },
        successMessage: 'Performance rating updated successfully'
      },
      successRes: () => {
        dispatch(updatePerformanceRating({ id, rating }));
        dispatch(setLoading(false));
      }
    });
  };

  const updateStaffSkills = async (id: string, skills: string[]) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/staff/${id}/skills`,
        method: 'PUT',
        body: { skills },
        successMessage: 'Staff skills updated successfully'
      },
      successRes: () => {
        dispatch(updateSkills({ id, skills }));
        dispatch(setLoading(false));
      }
    });
  };

  const updateStaffCertifications = async (id: string, certifications: string[]) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    sendHttpRequest({
      requestConfig: {
        url: `/staff/${id}/certifications`,
        method: 'PUT',
        body: { certifications },
        successMessage: 'Staff certifications updated successfully'
      },
      successRes: () => {
        dispatch(updateCertifications({ id, certifications }));
        dispatch(setLoading(false));
      }
    });
  };

  const getStaffSchedule = async (id: string, dateRange?: { start: string; end: string }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (dateRange?.start) params.append('start', dateRange.start);
    if (dateRange?.end) params.append('end', dateRange.end);

    const queryString = params.toString();
    const url = `/staff/${id}/schedule${queryString ? `?${queryString}` : ''}`;

    sendHttpRequest({
      requestConfig: {
        url,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setLoading(false));
        return response.data.data;
      }
    });
  };

  const getStaffPerformance = async (id: string, period?: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const params = new URLSearchParams();
    if (period) params.append('period', period);

    const queryString = params.toString();
    const url = `/staff/${id}/performance${queryString ? `?${queryString}` : ''}`;

    sendHttpRequest({
      requestConfig: {
        url,
        method: 'GET',
      },
      successRes: (response) => {
        dispatch(setLoading(false));
        return response.data.data;
      }
    });
  };

  return {
    fetchStaff,
    fetchStaffById,
    createStaff,
    updateStaffById,
    deleteStaffById,
    updateStaffStatusById,
    updateStaffRoleById,
    updateStaffSalary,
    updateStaffPerformanceRating,
    updateStaffSkills,
    updateStaffCertifications,
    getStaffSchedule,
    getStaffPerformance,
    isLoading,
    error
  };
};

