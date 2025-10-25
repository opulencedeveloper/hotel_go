'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Clock, Users, CheckCircle, AlertCircle, Play, X } from 'lucide-react';
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

  // Function to mark task as complete
  const handleMarkComplete = (taskId: string) => {
    const task = houseKeepings.find(t => t._id === taskId);
    if (task && task.roomIds && task.roomIds.length > 0) {
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
      cancelRequest({
        successRes: (res: any) => {
     const resData = res?.data?.data;
          const houseKeeping = resData?.houseKeeping;
          dispatch(houseKeepingActions.updateHouseKeeping(houseKeeping));
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
                        {task.status !== HouseKeepingStatus.COMPLETED && task.status !== HouseKeepingStatus.CANCELLED && (
                          <div className="mt-4 flex justify-end space-x-3">
                            <button
                              onClick={() => handleCancel(task._id)}
                              disabled={isCancelling || isMarkingComplete}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isCancelling ? (
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
                              disabled={isMarkingComplete || isCancelling}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isMarkingComplete ? (
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
                          </div>
                        )}
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
      </div>
    </div>
  );
}
