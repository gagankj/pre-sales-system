import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Video, 
  MapPin, 
  Calendar, 
  Clock, 
  Copy, 
  ExternalLink,
  Plus,
  Share,
  Phone,
  Mail
} from 'lucide-react';
import { addTimelineEntry, updateLead } from '../store/slices/leadsSlice';
import { format } from 'date-fns';

const MeetingScheduler = () => {
  const dispatch = useDispatch();
  const { leads } = useSelector(state => state.leads);
  const [activeTab, setActiveTab] = useState('online');
  const [selectedLead, setSelectedLead] = useState('');
  const [meetingType, setMeetingType] = useState('demo');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  const generateMeetLink = () => {
    // Simulate generating a Google Meet link
    const meetId = Math.random().toString(36).substring(2, 15);
    const link = `https://meet.google.com/${meetId}`;
    setMeetingLink(link);
    return link;
  };

  const handleScheduleMeeting = () => {
    if (!selectedLead || !date || !time) {
      alert('Please fill in all required fields');
      return;
    }

    const lead = leads.find(l => l.id === parseInt(selectedLead));
    if (!lead) return;

    const meetingDateTime = new Date(`${date}T${time}`);
    const isOnline = activeTab === 'online';
    
    let finalMeetingLink = meetingLink;
    if (isOnline && !meetingLink) {
      finalMeetingLink = generateMeetLink();
    }

    const meetingDetails = {
      type: meetingType,
      date: format(meetingDateTime, 'MMM dd, yyyy'),
      time: format(meetingDateTime, 'h:mm a'),
      location: isOnline ? finalMeetingLink : location,
      isOnline,
      notes
    };

    // Add timeline entry
    dispatch(addTimelineEntry({
      leadId: parseInt(selectedLead),
      entry: {
        type: 'meeting',
        title: `${meetingType === 'demo' ? 'Demo' : 'Meeting'} Scheduled`,
        description: `${isOnline ? 'Online' : 'Offline'} ${meetingType} scheduled for ${meetingDetails.date} at ${meetingDetails.time}`,
        user: 'Current User'
      }
    }));

    // Update lead status
    dispatch(updateLead({
      id: parseInt(selectedLead),
      status: meetingType === 'demo' ? 'Demo Scheduled' : 'Meeting Scheduled'
    }));

    // Reset form
    setSelectedLead('');
    setDate('');
    setTime('');
    setLocation('');
    setNotes('');
    setMeetingLink('');
    
    alert('Meeting scheduled successfully!');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const scheduledMeetings = leads.filter(lead => 
    lead.status === 'Demo Scheduled' || lead.status === 'Meeting Scheduled'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meeting & Demo Scheduler</h1>
          <p className="text-gray-600 mt-2">Schedule online meetings and offline demos with your leads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schedule New Meeting */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule New Meeting</h2>

          {/* Meeting Type Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('online')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'online'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Video className="w-4 h-4 inline mr-2" />
              Online Meeting
            </button>
            <button
              onClick={() => setActiveTab('offline')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'offline'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Offline Demo
            </button>
          </div>

          <div className="space-y-4">
            {/* Lead Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Lead *
              </label>
              <select
                value={selectedLead}
                onChange={(e) => setSelectedLead(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a lead...</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {lead.fullName} - {lead.company}
                  </option>
                ))}
              </select>
            </div>

            {/* Meeting Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Type *
              </label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="demo">Product Demo</option>
                <option value="consultation">Consultation</option>
                <option value="followup">Follow-up Meeting</option>
                <option value="presentation">Presentation</option>
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Location/Meeting Link */}
            {activeTab === 'online' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="Enter meeting link or generate new"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => setMeetingLink(generateMeetLink())}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Generate
                  </button>
                </div>
                {meetingLink && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">Meeting link ready</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(meetingLink)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location/Address *
                </label>
                <textarea
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter meeting location or address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add agenda, special requirements, or other notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            {/* Schedule Button */}
            <button
              onClick={handleScheduleMeeting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </button>
          </div>
        </div>

        {/* Scheduled Meetings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Scheduled Meetings</h2>

          {scheduledMeetings.length > 0 ? (
            <div className="space-y-4">
              {scheduledMeetings.map((lead) => {
                const meetingEntry = lead.timeline.find(entry => entry.type === 'meeting');
                const isDemo = lead.status === 'Demo Scheduled';
                
                return (
                  <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{lead.fullName}</h3>
                        <p className="text-sm text-gray-600">{lead.company}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isDemo ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {lead.status}
                      </span>
                    </div>

                    {meetingEntry && (
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {meetingEntry.description}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 mt-3">
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </a>
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </a>
                      <button className="flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-sm">
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings scheduled</h3>
              <p className="text-gray-600">Schedule your first meeting to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingScheduler;