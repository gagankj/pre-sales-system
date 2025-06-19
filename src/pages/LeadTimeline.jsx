import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  Plus, 
  Edit,
  MessageCircle,
  Video,
  Clock,
  User,
  Building,
  Tag,
  AlertCircle
} from 'lucide-react';
import { addTimelineEntry, updateLead } from '../store/slices/leadsSlice';
import { format } from 'date-fns';

const LeadTimeline = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leads } = useSelector(state => state.leads);
  
  const lead = leads.find(l => l.id === parseInt(id));
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: 'note',
    title: '',
    description: ''
  });

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Lead Not Found</h1>
        <button
          onClick={() => navigate('/leads')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Leads
        </button>
      </div>
    );
  }

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.description) {
      alert('Please fill in all fields');
      return;
    }

    dispatch(addTimelineEntry({
      leadId: lead.id,
      entry: {
        ...newEntry,
        user: 'Current User'
      }
    }));

    setNewEntry({ type: 'note', title: '', description: '' });
    setShowAddEntry(false);
  };

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'contact':
        return { icon: Phone, color: 'bg-green-500' };
      case 'email':
        return { icon: Mail, color: 'bg-blue-500' };
      case 'meeting':
        return { icon: Video, color: 'bg-purple-500' };
      case 'followup':
        return { icon: Calendar, color: 'bg-orange-500' };
      case 'note':
        return { icon: MessageCircle, color: 'bg-gray-500' };
      case 'status':
        return { icon: Tag, color: 'bg-indigo-500' };
      case 'lead':
        return { icon: User, color: 'bg-emerald-500' };
      default:
        return { icon: Clock, color: 'bg-gray-500' };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-gray-100 text-gray-800';
      case 'Contacted':
        return 'bg-blue-100 text-blue-800';
      case 'Demo Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'Meeting Scheduled':
        return 'bg-indigo-100 text-indigo-800';
      case 'Not Interested':
        return 'bg-red-100 text-red-800';
      case 'Converted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/leads')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lead.fullName}</h1>
            <p className="text-gray-600 mt-1">{lead.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href={`tel:${lead.phone}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </a>
          <a
            href={`mailto:${lead.email}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Lead Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Contact Information</label>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center text-sm text-gray-900">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {lead.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-900">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {lead.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-900">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    {lead.company}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Status & Priority</label>
                <div className="mt-1 space-y-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <br />
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(lead.priority)}`}>
                    {lead.priority} Priority
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Lead Source</label>
                <div className="mt-1 text-sm text-gray-900">{lead.leadSource}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Service Interested In</label>
                <div className="mt-1 text-sm text-gray-900">{lead.serviceInterestedIn}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <div className="mt-1 text-sm text-gray-900">{lead.assignedTo}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Next Follow-up</label>
                <div className="mt-1 flex items-center text-sm text-gray-900">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {lead.nextFollowUpDate ? format(new Date(lead.nextFollowUpDate), 'MMM dd, yyyy') : 'Not scheduled'}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">First Contact</label>
                <div className="mt-1 text-sm text-gray-900">
                  {format(new Date(lead.firstContactDate), 'MMM dd, yyyy')}
                </div>
              </div>

              {lead.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {lead.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
              <button
                onClick={() => setShowAddEntry(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </button>
            </div>

            {/* Add Entry Form */}
            {showAddEntry && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Add Timeline Entry</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newEntry.type}
                      onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="note">Note</option>
                      <option value="contact">Phone Call</option>
                      <option value="email">Email</option>
                      <option value="meeting">Meeting</option>
                      <option value="followup">Follow-up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                      placeholder="Enter title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newEntry.description}
                      onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                      placeholder="Enter description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleAddEntry}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                      Add Entry
                    </button>
                    <button
                      onClick={() => {
                        setShowAddEntry(false);
                        setNewEntry({ type: 'note', title: '', description: '' });
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Entries */}
            <div className="space-y-4">
              {lead.timeline.map((entry) => {
                const { icon: Icon, color } = getTimelineIcon(entry.type);
                
                return (
                  <div key={entry.id} className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${color} flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{entry.title}</h3>
                        <span className="text-xs text-gray-500">
                          {format(new Date(entry.date), 'MMM dd, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <User className="w-3 h-3 mr-1" />
                        {entry.user}
                      </div>
                    </div>
                  </div>
                );
              })}

              {lead.timeline.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No timeline entries yet</h3>
                  <p className="text-gray-600">Add your first timeline entry to start tracking interactions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadTimeline;