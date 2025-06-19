import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Edit, 
  Check, 
  X,
  AlertCircle,
  Filter,
  Plus
} from 'lucide-react';
import { updateLead, addTimelineEntry } from '../store/slices/leadsSlice';
import { format, isToday, isPast, isTomorrow } from 'date-fns';

const FollowUpScheduler = () => {
  const dispatch = useDispatch();
  const { leads } = useSelector(state => state.leads);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const followUpLeads = useMemo(() => {
    const leadsWithFollowups = leads.filter(lead => lead.nextFollowUpDate);
    
    return leadsWithFollowups.filter(lead => {
      const followUpDate = new Date(lead.nextFollowUpDate);
      
      switch (filter) {
        case 'today':
          return isToday(followUpDate);
        case 'overdue':
          return isPast(followUpDate) && !isToday(followUpDate);
        case 'upcoming':
          return !isPast(followUpDate) && !isToday(followUpDate);
        default:
          return true;
      }
    }).sort((a, b) => new Date(a.nextFollowUpDate) - new Date(b.nextFollowUpDate));
  }, [leads, filter]);

  const getFollowUpStatus = (date) => {
    const followUpDate = new Date(date);
    if (isPast(followUpDate) && !isToday(followUpDate)) {
      return { status: 'overdue', color: 'text-red-600 bg-red-50', icon: AlertCircle };
    }
    if (isToday(followUpDate)) {
      return { status: 'today', color: 'text-orange-600 bg-orange-50', icon: Clock };
    }
    if (isTomorrow(followUpDate)) {
      return { status: 'tomorrow', color: 'text-blue-600 bg-blue-50', icon: Calendar };
    }
    return { status: 'upcoming', color: 'text-green-600 bg-green-50', icon: Calendar };
  };

  const handleReschedule = (leadId) => {
    if (newDate) {
      dispatch(updateLead({
        id: leadId,
        nextFollowUpDate: newDate
      }));
      
      dispatch(addTimelineEntry({
        leadId,
        entry: {
          type: 'followup',
          title: 'Follow-up Rescheduled',
          description: `Follow-up rescheduled to ${format(new Date(newDate), 'MMM dd, yyyy')}`,
          user: 'Current User'
        }
      }));
      
      setEditingId(null);
      setNewDate('');
    }
  };

  const handleComplete = (leadId) => {
    dispatch(addTimelineEntry({
      leadId,
      entry: {
        type: 'followup',
        title: 'Follow-up Completed',
        description: newNotes || 'Follow-up call completed',
        user: 'Current User'
      }
    }));
    
    // Set next follow-up date (7 days from now as default)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    dispatch(updateLead({
      id: leadId,
      nextFollowUpDate: format(nextWeek, 'yyyy-MM-dd')
    }));
    
    setEditingId(null);
    setNewNotes('');
  };

  const filterCounts = {
    all: followUpLeads.length,
    today: leads.filter(lead => lead.nextFollowUpDate && isToday(new Date(lead.nextFollowUpDate))).length,
    overdue: leads.filter(lead => lead.nextFollowUpDate && isPast(new Date(lead.nextFollowUpDate)) && !isToday(new Date(lead.nextFollowUpDate))).length,
    upcoming: leads.filter(lead => lead.nextFollowUpDate && !isPast(new Date(lead.nextFollowUpDate)) && !isToday(new Date(lead.nextFollowUpDate))).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Follow-up Scheduler</h1>
          <p className="text-gray-600 mt-2">Manage and track all your scheduled follow-ups</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Follow-ups', count: filterCounts.all },
            { key: 'today', label: 'Today', count: filterCounts.today },
            { key: 'overdue', label: 'Overdue', count: filterCounts.overdue },
            { key: 'upcoming', label: 'Upcoming', count: filterCounts.upcoming }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                filter === key
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-4">
        {followUpLeads.map((lead) => {
          const followUpInfo = getFollowUpStatus(lead.nextFollowUpDate);
          const StatusIcon = followUpInfo.icon;
          
          return (
            <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${followUpInfo.color}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{lead.fullName}</h3>
                      <p className="text-sm text-gray-600">{lead.company}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      followUpInfo.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      followUpInfo.status === 'today' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {followUpInfo.status === 'overdue' ? 'Overdue' :
                       followUpInfo.status === 'today' ? 'Due Today' :
                       followUpInfo.status === 'tomorrow' ? 'Due Tomorrow' :
                       'Upcoming'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Due: {format(new Date(lead.nextFollowUpDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {lead.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {lead.email}
                    </div>
                    <div className="text-sm text-gray-600">
                      Status: <span className="font-medium">{lead.status}</span>
                    </div>
                  </div>

                  {lead.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{lead.notes}</p>
                    </div>
                  )}

                  {editingId === lead.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reschedule to:
                        </label>
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes (for completion):
                        </label>
                        <textarea
                          value={newNotes}
                          onChange={(e) => setNewNotes(e.target.value)}
                          placeholder="Add notes about the follow-up..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReschedule(lead.id)}
                          disabled={!newDate}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleComplete(lead.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setNewDate('');
                            setNewNotes('');
                          }}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingId(lead.id)}
                        className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Manage
                      </button>
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </a>
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-sm"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {followUpLeads.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No follow-ups found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? 'No follow-ups are currently scheduled.'
                : `No follow-ups match the selected filter: ${filter}`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpScheduler;