import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [
    {
      id: 1,
      type: 'followup',
      title: 'Follow-up Due',
      message: 'Follow-up with John Smith is due today',
      priority: 'high',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: 2,
      type: 'demo',
      title: 'Demo Scheduled',
      message: 'Demo with Emily Davis scheduled for 3:00 PM',
      priority: 'medium',
      timestamp: new Date().toISOString(),
      read: false
    }
  ]
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift({
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false
      });
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { addNotification, markAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;