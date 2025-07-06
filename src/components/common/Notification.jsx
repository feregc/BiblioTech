import React, { useEffect, useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const Notification = ({ notification }) => {
  const { removeNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <div 
      className={`notification notification--${notification.type} ${
        isVisible ? 'notification--visible' : ''
      } ${isLeaving ? 'notification--leaving' : ''}`}
    >
      <div className="notification__icon">
        {getIcon()}
      </div>
      <div className="notification__content">
        <h4 className="notification__title">{notification.title}</h4>
        {notification.message && (
          <p className="notification__message">{notification.message}</p>
        )}
      </div>
      <button 
        className="notification__close"
        onClick={handleClose}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
};

export default Notification;