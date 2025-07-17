import { useState, useCallback } from 'react';

interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  duration?: number;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const showNotification = useCallback((
    type: NotificationState['type'],
    message: string,
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: NotificationState = {
      id,
      type,
      message,
      isVisible: true,
      duration
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback((message: string, duration?: number) => {
    return showNotification('success', message, duration);
  }, [showNotification]);

  const error = useCallback((message: string, duration?: number) => {
    return showNotification('error', message, duration);
  }, [showNotification]);

  const warning = useCallback((message: string, duration?: number) => {
    return showNotification('warning', message, duration);
  }, [showNotification]);

  const info = useCallback((message: string, duration?: number) => {
    return showNotification('info', message, duration);
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info
  };
};

export default useNotification;
