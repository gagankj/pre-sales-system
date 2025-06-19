import { configureStore } from '@reduxjs/toolkit';
import leadsReducer from './slices/leadsSlice';
import dashboardReducer from './slices/dashboardSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    leads: leadsReducer,
    dashboard: dashboardReducer,
    notifications: notificationsReducer,
  },
});

export default store;