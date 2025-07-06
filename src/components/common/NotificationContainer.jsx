import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import Notification from './Notification';

const NotificationContainer = () => {
  const { notifications } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <Notification 
          key={notification.id} 
          notification={notification} 
        />
      ))}
    </div>
  );
};

export default NotificationContainer;