import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalLeads: 0,
    upcomingCalls: 0,
    scheduledDemos: 0,
    followupsPending: 0,
    leadsConverted: 0,
    conversionRate: 0
  },
  weeklyFollowups: [
    { day: 'Mon', count: 5 },
    { day: 'Tue', count: 8 },
    { day: 'Wed', count: 12 },
    { day: 'Thu', count: 7 },
    { day: 'Fri', count: 15 },
    { day: 'Sat', count: 3 },
    { day: 'Sun', count: 2 }
  ],
  recentActivity: []
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    addRecentActivity: (state, action) => {
      state.recentActivity.unshift(action.payload);
      if (state.recentActivity.length > 10) {
        state.recentActivity.pop();
      }
    }
  }
});

export const { updateStats, addRecentActivity } = dashboardSlice.actions;
export default dashboardSlice.reducer;