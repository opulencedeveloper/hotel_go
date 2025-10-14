'use client';

import Layout from '@/components/Layout';
import { Archive, Download, Upload, Shield, Clock, CheckCircle, AlertTriangle, Database, HardDrive, Plus, Eye, Trash2, Play, Pause, Settings } from 'lucide-react';
import { mockBackups, mockSyncEvents, mockOfflineQueue } from '@/data/mockData';
import { useState, useEffect } from 'react';

export default function BackupPage() {
  const [selectedBackupType, setSelectedBackupType] = useState('all');
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const completedBackups = mockBackups.filter(backup => backup.status === 'completed');
  const inProgressBackups = mockBackups.filter(backup => backup.status === 'in_progress');
  const failedBackups = mockBackups.filter(backup => backup.status === 'failed');
  
  const totalStorageUsed = completedBackups.reduce((sum, backup) => sum + backup.size_bytes, 0);
  const pendingSyncItems = mockOfflineQueue.filter(item => item.status === 'pending').length;
  const recentSyncEvents = mockSyncEvents.slice(0, 5);

  const filteredBackups = selectedBackupType === 'all' 
    ? mockBackups 
    : mockBackups.filter(backup => backup.backup_type === selectedBackupType);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    // Simulate backup creation
    setTimeout(() => {
      setIsCreatingBackup(false);
      // In a real app, this would trigger the actual backup process
    }, 2000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Backup & Data Recovery</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  <span className="text-sm font-medium">Data Protection</span>
                </div>
              </div>
              
              <p className="text-indigo-100 text-lg mb-6">
                Secure your hotel data with automated backups and recovery solutions.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-indigo-100">Backup Active</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-indigo-200">Last Backup:</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-indigo-200">Storage Used:</span>
                  <span className="font-medium">{formatFileSize(totalStorageUsed)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleCreateBackup}
                  disabled={isCreatingBackup}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]"
                >
                  {isCreatingBackup ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Create Backup</span>
                    </>
                  )}
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Upload className="w-4 h-4" />
                  <span>Restore Data</span>
                </button>
                <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 min-w-[160px]">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Backup Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Backups</p>
                <p className="text-2xl font-bold text-secondary-900">{completedBackups.length}</p>
                <p className="text-sm text-green-600">All successful</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Storage Used</p>
                <p className="text-2xl font-bold text-secondary-900">{formatFileSize(totalStorageUsed)}</p>
                <p className="text-sm text-blue-600">Across all backups</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <HardDrive className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">In Progress</p>
                <p className="text-2xl font-bold text-secondary-900">{inProgressBackups.length}</p>
                <p className="text-sm text-orange-600">Currently running</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Failed Backups</p>
                <p className="text-2xl font-bold text-secondary-900">{failedBackups.length}</p>
                <p className="text-sm text-red-600">Requires attention</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Backup Management */}
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">Backup Management</h2>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedBackupType}
                  onChange={(e) => setSelectedBackupType(e.target.value)}
                  className="border border-secondary-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="full">Full Backup</option>
                  <option value="incremental">Incremental</option>
                  <option value="differential">Differential</option>
                </select>
                <button 
                  onClick={handleCreateBackup}
                  disabled={isCreatingBackup}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Backup</span>
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Backup ID</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Size</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Retention</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBackups.map((backup) => (
                    <tr key={backup.backup_id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-3 px-4 font-medium text-secondary-900">#{backup.backup_id.slice(-8)}</td>
                      <td className="py-3 px-4 text-secondary-600 capitalize">{backup.backup_type}</td>
                      <td className="py-3 px-4 text-secondary-600">{formatFileSize(backup.size_bytes)}</td>
                      <td className="py-3 px-4 text-secondary-600">
                        {isClient ? new Date(backup.created_at).toLocaleDateString() : '--/--/----'}
                      </td>
                      <td className="py-3 px-4 text-secondary-600">{backup.retention_days} days</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                          backup.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {backup.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-secondary-400 hover:text-secondary-600" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-secondary-400 hover:text-secondary-600" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-secondary-400 hover:text-secondary-600" title="Restore">
                            <Upload className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-400 hover:text-red-600" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Status & Sync */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">System Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-secondary-900">Backup Service</span>
                  </div>
                  <span className="text-sm text-green-600">Online</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-secondary-900">Cloud Storage</span>
                  </div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-secondary-900">Sync Queue</span>
                  </div>
                  <span className="text-sm text-orange-600">{pendingSyncItems} pending</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-secondary-900">Database</span>
                  </div>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sync Events */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Recent Sync Events</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentSyncEvents.map((event) => (
                  <div key={event.sync_event_id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-secondary-900 capitalize">
                          {event.event_type} {event.entity_type}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {event.entity_id} • {isClient ? new Date(event.created_at).toLocaleString() : '--/--/---- --:--:--'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'completed' ? 'bg-green-100 text-green-800' :
                          event.status === 'processing' ? 'bg-orange-100 text-orange-800' :
                          event.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                        <p className="text-xs text-secondary-500 mt-1">
                          {event.client_txn_id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Backup Schedule & Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backup Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Backup Schedule</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-secondary-900">Daily Full Backup</h3>
                      <p className="text-sm text-secondary-600">Every day at 2:00 AM</p>
                      <p className="text-sm text-secondary-500">Retention: 30 days</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-green-600 hover:text-green-700">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-secondary-400 hover:text-secondary-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-secondary-900">Hourly Incremental</h3>
                      <p className="text-sm text-secondary-600">Every hour</p>
                      <p className="text-sm text-secondary-500">Retention: 7 days</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-green-600 hover:text-green-700">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-secondary-400 hover:text-secondary-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Usage */}
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Storage Usage</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-600">Full Backups</span>
                  <span className="text-sm text-secondary-900">1.2 GB (50%)</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-600">Incremental Backups</span>
                  <span className="text-sm text-secondary-900">0.8 GB (33%)</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-600">Differential Backups</span>
                  <span className="text-sm text-secondary-900">0.4 GB (17%)</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '17%' }}></div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-secondary-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-secondary-900">Total Used</span>
                    <span className="font-semibold text-secondary-900">{formatFileSize(totalStorageUsed)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">Available</span>
                    <span className="text-sm text-secondary-600">7.6 GB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
