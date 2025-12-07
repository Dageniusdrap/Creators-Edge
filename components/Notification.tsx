import React, { useState, useEffect } from 'react';
import type { Notification } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { InfoIcon } from './icons/InfoIcon';
import { XIcon } from './icons/XIcon';

const ICONS = {
  success: <CheckIcon className="h-6 w-6 text-green-500" />,
  error: <XCircleIcon className="h-6 w-6 text-red-500" />,
  info: <InfoIcon className="h-6 w-6 text-blue-500" />,
};

import { motion, AnimatePresence } from 'framer-motion';

const BG_STYLES = {
  success: 'glass-card border-success/30 shadow-success/10',
  error: 'glass-card border-error/30 shadow-error/10',
  info: 'glass-card border-primary/30 shadow-primary/10',
};

const ICON_COLORS = {
  success: 'text-success drop-shadow-lg shadow-success/40',
  error: 'text-error drop-shadow-lg shadow-error/40',
  info: 'text-primary drop-shadow-lg shadow-primary/40',
}

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: number) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss }) => {
  // Auto-dismiss logic handled by useEffect in parent or here
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      layout
      className={`pointer-events-auto relative w-full max-w-sm p-4 rounded-xl shadow-2xl backdrop-blur-md border ${BG_STYLES[notification.type]}`}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${ICON_COLORS[notification.type]}`}>
          {ICONS[notification.type]}
        </div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-text-primary">
            {notification.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => onDismiss(notification.id)}
            className="inline-flex rounded-md text-text-secondary hover:text-text-primary focus:outline-none transition-colors"
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: number) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed inset-0 flex items-end justify-end px-4 py-6 pointer-events-none sm:p-6 z-[200]">
      <div className="w-full max-w-sm space-y-4">
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationToast key={notification.id} notification={notification} onDismiss={onDismiss} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};