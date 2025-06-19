import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LeadManagement from './pages/LeadManagement';
import AddLead from './pages/AddLead';
import FollowUpScheduler from './pages/FollowUpScheduler';
import MeetingScheduler from './pages/MeetingScheduler';
import BulkEmailCampaigns from './pages/BulkEmailCampaigns';
import LeadTimeline from './pages/LeadTimeline';
import NotificationCenter from './pages/NotificationCenter';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<LeadManagement />} />
            <Route path="/leads/add" element={<AddLead />} />
            <Route path="/leads/:id" element={<LeadTimeline />} />
            <Route path="/followups" element={<FollowUpScheduler />} />
            <Route path="/meetings" element={<MeetingScheduler />} />
            <Route path="/campaigns" element={<BulkEmailCampaigns />} />
            <Route path="/notifications" element={<NotificationCenter />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;