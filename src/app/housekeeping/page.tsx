'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  Settings, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Bed,
  User,
  Calendar,
  MapPin,
  Wrench,
  Droplets,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { mockTasks, mockRooms, mockStaff } from '@/data/mockData';
import { Task, Room } from '@/types';

export default function HousekeepingPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [rooms] = useState<Room[]>(mockRooms);
  const [staff] = useState(mockStaff.filter(s => s.role === 'housekeeping'));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const getRoomStatus = (roomNumber: string) => {
    const room = rooms.find(r => r.number === roomNumber);
    return room?.status || 'unknown';
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'cleaning': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length
  };

  const roomStats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length
  };

  const roomTasks = [
    { room: '101', type: 'Checkout Clean', priority: 'high', status: 'pending', assignedTo: 'Maria Garcia' },
    { room: '102', type: 'Deep Clean', priority: 'medium', status: 'in-progress', assignedTo: 'John Smith' },
    { room: '201', type: 'Maintenance', priority: 'urgent', status: 'pending', assignedTo: 'Mike Wilson' },
    { room: '203', type: 'Regular Clean', priority: 'low', status: 'completed', assignedTo: 'Sarah Johnson' },
    { room: '301', type: 'Checkout Clean', priority: 'high', status: 'pending', assignedTo: 'Maria Garcia' },
    { room: '302', type: 'Deep Clean', priority: 'medium', status: 'in-progress', assignedTo: 'John Smith' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Housekeeping</h1>
            <p className="text-secondary-600">Manage room cleaning, maintenance, and staff assignments</p>
          </div>
          <button 
            onClick={() => setShowNewTask(true)}
            className="btn-primary mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-secondary-900">{taskStats.total}</div>
            <div className="text-sm text-secondary-600">Total Tasks</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{taskStats.pending}</div>
            <div className="text-sm text-secondary-600">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
            <div className="text-sm text-secondary-600">In Progress</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
            <div className="text-sm text-secondary-600">Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">{taskStats.urgent}</div>
            <div className="text-sm text-secondary-600">Urgent</div>
          </div>
        </div>

        {/* Room Status Overview */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Room Status Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{roomStats.available}</div>
              <div className="text-sm text-secondary-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{roomStats.occupied}</div>
              <div className="text-sm text-secondary-600">Occupied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{roomStats.cleaning}</div>
              <div className="text-sm text-secondary-600">Cleaning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{roomStats.maintenance}</div>
              <div className="text-sm text-secondary-600">Maintenance</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room Tasks */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Room Tasks</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {roomTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Bed className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-secondary-900">
                          Room {task.room} - {task.type}
                        </p>
                        <p className="text-xs text-secondary-600">
                          Assigned to: {task.assignedTo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)}
                        <span className="ml-1 capitalize">{task.priority}</span>
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-700">Mark Room Clean</p>
                      <p className="text-xs text-green-600">Update room status</p>
                    </div>
                  </div>
                </button>
                <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center">
                    <Wrench className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-700">Report Maintenance</p>
                      <p className="text-xs text-blue-600">Create maintenance task</p>
                    </div>
                  </div>
                </button>
                <button className="w-full p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center">
                    <Droplets className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-yellow-700">Request Supplies</p>
                      <p className="text-xs text-yellow-600">Order cleaning supplies</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Staff Status */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Staff Status</h3>
              <div className="space-y-3">
                {staff.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-secondary-900">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-secondary-600">{member.shift} shift</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status === 'active' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <X className="w-3 h-3 mr-1" />
                      )}
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Task Management */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">All Tasks</h3>
            <div className="flex space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-secondary-50 rounded">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Settings className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-secondary-900">{task.title}</h4>
                    <p className="text-xs text-secondary-600">{task.description}</p>
                    <p className="text-xs text-secondary-500">
                      Assigned to: {task.staff?.firstName} {task.staff?.lastName} • 
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {getPriorityIcon(task.priority)}
                    <span className="ml-1 capitalize">{task.priority}</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                    <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-secondary-600 hover:text-secondary-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'in-progress')}
                        className="text-blue-600 hover:text-blue-700 text-xs"
                      >
                        Start
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'completed')}
                        className="text-green-600 hover:text-green-700 text-xs"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Task Modal */}
        {showNewTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Create New Task</h3>
                <button
                  onClick={() => setShowNewTask(false)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Task Title
                    </label>
                    <input type="text" className="input" placeholder="Enter task title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Department
                    </label>
                    <select className="input">
                      <option value="">Select department</option>
                      <option value="Housekeeping">Housekeeping</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Front Desk">Front Desk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Assigned To
                    </label>
                    <select className="input">
                      <option value="">Select staff member</option>
                      {staff.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Priority
                    </label>
                    <select className="input">
                      <option value="">Select priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Due Date
                    </label>
                    <input type="datetime-local" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Room Number (Optional)
                    </label>
                    <input type="text" className="input" placeholder="e.g., 101" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Description
                  </label>
                  <textarea 
                    className="input" 
                    rows={3} 
                    placeholder="Enter task description..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewTask(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Task Details</h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-secondary-900">Task Information</h4>
                    <p className="text-sm text-secondary-600">{selectedTask.title}</p>
                    <p className="text-sm text-secondary-600">{selectedTask.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">Assignment</h4>
                    <p className="text-sm text-secondary-600">
                      Assigned to: {selectedTask.staff?.firstName} {selectedTask.staff?.lastName}
                    </p>
                    <p className="text-sm text-secondary-600">Department: {selectedTask.department}</p>
                    <p className="text-sm text-secondary-600">
                      Due: {new Date(selectedTask.dueDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-secondary-900">Status & Priority</h4>
                  <div className="flex space-x-2 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                      {getPriorityIcon(selectedTask.priority)}
                      <span className="ml-1 capitalize">{selectedTask.priority}</span>
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                      {getStatusIcon(selectedTask.status)}
                      <span className="ml-1 capitalize">{selectedTask.status.replace('-', ' ')}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-primary">
                  Edit Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
