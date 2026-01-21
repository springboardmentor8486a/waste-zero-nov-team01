import React, { createContext, useContext } from 'react';

const NotificationsContext = createContext({
  unseenCounts: {},
  totalUnseen: 0,
  clearUnseen: () => {},
  clearAllUnseen: () => {},
  incrementUnseen: () => {},
  markSeenMultiple: () => {},
});

export const NotificationsProvider = ({ children }) => children;

export const useNotifications = () => useContext(NotificationsContext);
