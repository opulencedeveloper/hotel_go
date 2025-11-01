'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Clock, Users, CheckCircle, AlertCircle, Play, X, Eye, Building } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import NewTaskModal from './NewTaskModal';
import { HouseKeepingStatus } from '@/utils/enum';
import { houseKeepingActions } from '@/store/redux/house-keeping-slice';
import { useHttp } from '@/hooks/useHttp';

export default function HousekeepingBody() {
  const houseKeeping = useSelector((state: RootState) => state.houseKeeping);
  const { houseKeepings, fetchedData } = houseKeeping;
  const [showNewTask, setShowNewTask] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [processingCompleteTaskId, setProcessingCompleteTaskId] = useState<string | null>(null);
  const [processingCancelTaskId, setProcessingCancelTaskId] = useState<string | null>(null);
  const dispatch = useDispatch();

  // HTTP hook for marking tasks as complete
  const {
    isLoading: isMarkingComplete,
    sendHttpRequest: markCompleteRequest,
    error: markCompleteError,
  } = useHttp();

  // HTTP hook for cancelling tasks
  const {
    isLoading: isCancelling,
    sendHttpRequest: cancelRequest,
    error: cancelError,
  } = useHttp();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset processing state when loading completes
  useEffect(() => {
    if (!isMarkingComplete && processingCompleteTaskId) {
      setProcessingCompleteTaskId(null);
    }
  }, [isMarkingComplete, processingCompleteTaskId]);

  useEffect(() => {
    if (!isCancelling && processingCancelTaskId) {
      setProcessingCancelTaskId(null);
    }
  }, [isCancelling, processingCancelTaskId]);

  // Function to mark task as complete
  const handleMarkComplete = (taskId: string) => {
    const task = houseKeepings.find(t => t._id === taskId);
    if (task && task.roomIds && task.roomIds.length > 0) {
      setProcessingCompleteTaskId(taskId);
      const payload = {
        roomIds: task.roomIds.map(room => room._id)
      };

      markCompleteRequest({
        successRes: (res: any) => {
          console.log("Task marked as complete successfully:", res.data);
          // Update the task status in Redux
          const resData = res?.data?.data;
          const houseKeeping = resData?.houseKeeping;
          dispatch(houseKeepingActions.updateHouseKeeping(houseKeeping));
          setProcessingCompleteTaskId(null);
        },
        requestConfig: {
          url: `/hotel/mark-house-cleaning-as-done?houseKeepingId=${taskId}`,
          method: "PUT",
          body: payload,
          successMessage: "Housekeeping task marked as complete!",
        },
      });
    }
  };

  // Function to cancel task
  const handleCancel = (taskId: string) => {
    const task = houseKeepings.find(t => t._id === taskId);
    if (task) {
      setProcessingCancelTaskId(taskId);
      cancelRequest({
        successRes: (res: any) => {
          const resData = res?.data?.data;
          const houseKeeping = resData?.houseKeeping;
          dispatch(houseKeepingActions.updateHouseKeeping(houseKeeping));
          setProcessingCancelTaskId(null);
        },
        requestConfig: {
          url: `/hotel/mark-house-cleaning-as-cancelled?houseKeepingId=${taskId}`,
          method: "PUT",
          successMessage: "Housekeeping task cancelled!",
        },
      });
    }
  };

  // Helper function to get status styling
  const getStatusStyling = (status: HouseKeepingStatus) => {
    switch (status) {
      case HouseKeepingStatus.IN_PROGRESS:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: Play,
          label: 'In Progress'
        };
      case HouseKeepingStatus.COMPLETED:
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: CheckCircle,
          label: 'Completed'
        };
      case HouseKeepingStatus.CANCELLED:
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: X,
          label: 'Cancelled'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: AlertCircle,
          label: 'Unknown'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Housekeeping</h1>
              <p className="mt-2 text-lg text-gray-600">Manage housekeeping tasks and assignments</p>
            </div>
            <button 
              onClick={() => setShowNewTask(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Task
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-semibold text-gray-900">{houseKeepings.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {houseKeepings.filter(task => task.status === HouseKeepingStatus.IN_PROGRESS).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {houseKeepings.filter(task => task.status === HouseKeepingStatus.COMPLETED).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Cancelled</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {houseKeepings.filter(task => task.status === HouseKeepingStatus.CANCELLED).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {(markCompleteError || cancelError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm text-red-600">
                {markCompleteError && "Failed to mark task as complete. Please try again."}
                {cancelError && "Failed to cancel task. Please try again."}
              </p>
            </div>
          </div>
        )}

        {/* Housekeeping Tasks */}
        {fetchedData && houseKeepings.length > 0 ? (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Housekeeping Tasks</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage and track all housekeeping activities</p>
                </div>
                <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {houseKeepings.length} tasks
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {houseKeepings.map((task, index) => {
                const statusStyling = getStatusStyling(task.status);
                const StatusIcon = statusStyling.icon;
                
                return (
                  <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 ${statusStyling.bg} rounded-lg flex items-center justify-center`}>
                          <StatusIcon className={`w-5 h-5 ${statusStyling.text}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {task.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyling.bg} ${statusStyling.text}`}>
                            {statusStyling.label}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        {task.description && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                              {task.description}
                            </p>
                          </div>
                        )}
                        
                        {/* Rooms Information */}
                        {task.roomIds && task.roomIds.length > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center mb-2">
                              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700">Assigned Rooms:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {task.roomIds.map((room) => (
                                <span
                                  key={room._id}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                                >
                                  Room {room.roomNumber} (Floor {room.floor})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {task.staffIds && task.staffIds.length > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center mb-2">
                              <Users className="w-4 h-4 mr-1 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700">Assigned Staff:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {task.staffIds.map((staff) => (
                                <span
                                  key={staff._id}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                >
                                  {staff.firstName} {staff.lastName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="mt-4 flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setShowViewModal(true);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                          
                          {task.status !== HouseKeepingStatus.COMPLETED && task.status !== HouseKeepingStatus.CANCELLED && (
                            <>
                              <button
                                onClick={() => handleCancel(task._id)}
                                disabled={processingCancelTaskId === task._id || processingCompleteTaskId === task._id}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {processingCancelTaskId === task._id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel Task
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleMarkComplete(task._id)}
                                disabled={processingCompleteTaskId === task._id || processingCancelTaskId === task._id}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {processingCompleteTaskId === task._id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Marking Complete...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as Complete
                                  </>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : fetchedData && houseKeepings.length === 0 ? (
          <div className="bg-white shadow-lg rounded-xl p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No housekeeping tasks</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first housekeeping task.</p>
            <button 
              onClick={() => setShowNewTask(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Task
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading housekeeping data</h3>
            <p className="text-gray-500">Please wait while we fetch your housekeeping tasks...</p>
          </div>
        )}

        {/* Modals */}
        <NewTaskModal 
          isOpen={showNewTask}
          onClose={() => setShowNewTask(false)}
          staff={[]}
        />

        {/* View Task Modal */}
        {showViewModal && selectedTask && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-secondary-900">
                        Task Details
                      </h2>
                      <p className="text-sm text-secondary-600">
                        Complete task information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedTask(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Task Overview */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedTask.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Created: {new Date(selectedTask.createdAt).toLocaleDateString()} at {new Date(selectedTask.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyling(selectedTask.status).bg} ${getStatusStyling(selectedTask.status).text}`}>
                        {getStatusStyling(selectedTask.status).label}
                      </span>
                    </div>

                    {/* Description */}
                    {selectedTask.description && (
                      <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Description:</p>
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {selectedTask.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Staff Information */}
                  {selectedTask.staffIds && selectedTask.staffIds.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Assigned Staff ({selectedTask.staffIds.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTask.staffIds.map((staff: any) => (
                          <div
                            key={staff._id}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {staff.firstName} {staff.lastName}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {staff.email}
                                </p>
                                {staff.phoneNumber && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    {staff.phoneNumber}
                                  </p>
                                )}
                                {staff.userRole && (
                                  <p className="text-xs text-blue-600 mt-2 capitalize">
                                    {staff.userRole}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rooms Information */}
                  {selectedTask.roomIds && selectedTask.roomIds.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Assigned Rooms ({selectedTask.roomIds.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedTask.roomIds.map((room: any) => (
                          <div
                            key={room._id}
                            className="p-4 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 text-green-600 mr-2" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  Room {room.roomNumber}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  Floor {room.floor}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Facilities Information */}
                  {selectedTask.facilityIds && selectedTask.facilityIds.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <Building className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Assigned Facilities ({selectedTask.facilityIds.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedTask.facilityIds.map((facility: any) => (
                          <div
                            key={facility._id}
                            className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                          >
                            <div className="flex items-start">
                              <Building className="w-4 h-4 text-purple-600 mr-2 mt-1" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {facility.facilityName}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {facility.category} • {facility.location}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Floor {facility.floor} • Capacity: {facility.capacity}
                                </p>
                                {facility.description && (
                                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                                    {facility.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Task ID */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-500">
                      Task ID: <span className="font-mono text-gray-700">{selectedTask._id}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedTask(null);
                    }}
                    className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
