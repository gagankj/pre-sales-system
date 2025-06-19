import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const initialState = {
  leads: [
    {
      id: 1,
      fullName: 'John Smith',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@example.com',
      company: 'Tech Solutions Inc.',
      leadSource: 'Referral',
      notes: 'Interested in our premium software package. Very engaged during initial call.',
      serviceInterestedIn: 'Software Development',
      priority: 'High',
      firstContactDate: '2024-01-15',
      nextFollowUpDate: '2024-01-22',
      status: 'Demo Scheduled',
      assignedTo: 'Sarah Johnson',
      timeline: [
        {
          id: 1,
          type: 'contact',
          title: 'Initial Contact',
          description: 'First phone call completed. Client showed high interest.',
          date: '2024-01-15T10:30:00Z',
          user: 'Sarah Johnson'
        },
        {
          id: 2,
          type: 'note',
          title: 'Follow-up Note',
          description: 'Sent proposal via email. Client requested demo.',
          date: '2024-01-16T14:20:00Z',
          user: 'Sarah Johnson'
        }
      ]
    },
    {
      id: 2,
      fullName: 'Emily Davis',
      phone: '+1 (555) 987-6543',
      email: 'emily.davis@businesscorp.com',
      company: 'Business Corp',
      leadSource: 'Social Media',
      notes: 'Found us through LinkedIn. Looking for marketing automation tools.',
      serviceInterestedIn: 'Marketing Automation',
      priority: 'Medium',
      firstContactDate: '2024-01-18',
      nextFollowUpDate: '2024-01-25',
      status: 'Contacted',
      assignedTo: 'Mike Wilson',
      timeline: [
        {
          id: 1,
          type: 'contact',
          title: 'LinkedIn Connection',
          description: 'Connected through LinkedIn. Expressed interest in marketing tools.',
          date: '2024-01-18T09:15:00Z',
          user: 'Mike Wilson'
        }
      ]
    },
    {
      id: 3,
      fullName: 'David Rodriguez',
      phone: '+1 (555) 456-7890',
      email: 'david.r@startupventure.com',
      company: 'Startup Venture',
      leadSource: 'Website',
      notes: 'Startup looking for cost-effective solutions. Price-sensitive but high potential.',
      serviceInterestedIn: 'Consulting',
      priority: 'Medium',
      firstContactDate: '2024-01-20',
      nextFollowUpDate: '2024-01-27',
      status: 'New',
      assignedTo: 'Sarah Johnson',
      timeline: [
        {
          id: 1,
          type: 'lead',
          title: 'Lead Created',
          description: 'Lead created from website contact form.',
          date: '2024-01-20T16:45:00Z',
          user: 'System'
        }
      ]
    }
  ],
  filteredLeads: [],
  selectedLead: null,
  filters: {
    status: 'all',
    priority: 'all',
    source: 'all',
    dateRange: 'all'
  },
  searchTerm: ''
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    addLead: (state, action) => {
      const newLead = {
        ...action.payload,
        id: Date.now(),
        firstContactDate: format(new Date(), 'yyyy-MM-dd'),
        timeline: [
          {
            id: 1,
            type: 'lead',
            title: 'Lead Created',
            description: 'New lead added to the system.',
            date: new Date().toISOString(),
            user: 'Current User'
          }
        ]
      };
      state.leads.unshift(newLead);
    },
    updateLead: (state, action) => {
      const index = state.leads.findIndex(lead => lead.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = { ...state.leads[index], ...action.payload };
      }
    },
    deleteLead: (state, action) => {
      state.leads = state.leads.filter(lead => lead.id !== action.payload);
    },
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },
    addTimelineEntry: (state, action) => {
      const { leadId, entry } = action.payload;
      const lead = state.leads.find(l => l.id === leadId);
      if (lead) {
        lead.timeline.push({
          ...entry,
          id: Date.now(),
          date: new Date().toISOString()
        });
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    updateLeadStatus: (state, action) => {
      const { id, status } = action.payload;
      const lead = state.leads.find(l => l.id === id);
      if (lead) {
        lead.status = status;
        lead.timeline.push({
          id: Date.now(),
          type: 'status',
          title: 'Status Updated',
          description: `Status changed to ${status}`,
          date: new Date().toISOString(),
          user: 'Current User'
        });
      }
    }
  }
});

export const {
  addLead,
  updateLead,
  deleteLead,
  setSelectedLead,
  addTimelineEntry,
  setFilters,
  setSearchTerm,
  updateLeadStatus
} = leadsSlice.actions;

export default leadsSlice.reducer;