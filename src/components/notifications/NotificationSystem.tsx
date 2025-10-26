'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'CLEAR_ALL' };

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };

    case 'REMOVE_NOTIFICATION':
      const notificationToRemove = state.notifications.find(n => n.id === action.payload);
      return {
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: notificationToRemove && !notificationToRemove.read 
          ? state.unreadCount - 1 
          : state.unreadCount
      };

    case 'MARK_AS_READ':
      return {
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    case 'MARK_ALL_AS_READ':
      return {
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      };

    case 'CLEAR_ALL':
      return {
        notifications: [],
        unreadCount: 0
      };

    default:
      return state;
  }
};

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    unreadCount: 0
  });

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Show toast notification
    switch (notification.type) {
      case 'success':
        toast.success(notification.title, {
          description: notification.message
        });
        break;
      case 'error':
        toast.error(notification.title, {
          description: notification.message
        });
        break;
      case 'warning':
        toast.warning(notification.title, {
          description: notification.message
        });
        break;
      case 'info':
        toast.info(notification.title, {
          description: notification.message
        });
        break;
    }
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  // Auto-remove non-persistent notifications after 5 seconds
  useEffect(() => {
    const timers = state.notifications
      .filter(n => !n.persistent)
      .map(notification => {
        return setTimeout(() => {
          removeNotification(notification.id);
        }, 5000);
      });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [state.notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Notification components
export const NotificationItem = ({ notification }: { notification: Notification }) => {
  const { removeNotification, markAsRead } = useNotifications();

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getBackgroundColor()} ${!notification.read ? 'ring-2 ring-primary-500' : ''}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-gray-900">
            {notification.title}
          </h4>
          <p className="mt-1 text-sm text-gray-600">
            {notification.message}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {notification.timestamp.toLocaleTimeString()}
          </p>
          {notification.actions && (
            <div className="mt-3 flex space-x-2">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex space-x-2">
          {!notification.read && (
            <button
              onClick={() => markAsRead(notification.id)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Mark as read
            </button>
          )}
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotificationPanel = () => {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications();

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {unreadCount}
            </span>
          )}
        </h3>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No notifications
          </p>
        ) : (
          notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
};














