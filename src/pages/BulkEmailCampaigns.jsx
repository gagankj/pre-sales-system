import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Mail, 
  Send, 
  Clock, 
  Users, 
  FileText, 
  Image as ImageIcon,
  Calendar,
  Filter,
  Plus,
  Save
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BulkEmailCampaigns = () => {
  const { leads } = useSelector(state => state.leads);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    status: 'all',
    source: 'all',
    service: 'all'
  });
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    template: ''
  });
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Welcome Series',
      subject: 'Welcome to our services!',
      recipients: 25,
      status: 'sent',
      sentDate: '2024-01-20',
      openRate: '68%',
      clickRate: '12%'
    },
    {
      id: 2,
      name: 'Product Demo Follow-up',
      subject: 'Thank you for your interest in our demo',
      recipients: 15,
      status: 'scheduled',
      scheduledDate: '2024-01-25',
      openRate: '-',
      clickRate: '-'
    }
  ]);

  const emailTemplates = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to {Company Name}!',
      content: `<h2>Welcome {First Name}!</h2>
<p>Thank you for your interest in our services. We're excited to help you achieve your goals.</p>
<p>Our team will be in touch soon to discuss how we can best serve you.</p>
<p>Best regards,<br>The Sales Team</p>`
    },
    {
      id: 'followup',
      name: 'Follow-up Email',
      subject: 'Following up on our conversation',
      content: `<h2>Hi {First Name},</h2>
<p>I wanted to follow up on our recent conversation about {Service}.</p>
<p>Do you have any questions about our proposal? I'd be happy to schedule a call to discuss further.</p>
<p>Best regards,<br>{Sales Rep Name}</p>`
    },
    {
      id: 'demo',
      name: 'Demo Invitation',
      subject: 'Ready to see {Service} in action?',
      content: `<h2>Hi {First Name},</h2>
<p>Based on our conversation, I think you'd benefit from seeing {Service} in action.</p>
<p>Would you be interested in a personalized demo? I have availability this week.</p>
<p>Let me know what works best for your schedule.</p>
<p>Best regards,<br>{Sales Rep Name}</p>`
    }
  ];

  const handleFilterChange = (criteria) => {
    setFilterCriteria({ ...filterCriteria, ...criteria });
    
    // Auto-select leads based on criteria
    const filtered = leads.filter(lead => {
      const matchesStatus = criteria.status === 'all' || lead.status === criteria.status;
      const matchesSource = criteria.source === 'all' || lead.leadSource === criteria.source;
      const matchesService = criteria.service === 'all' || lead.serviceInterestedIn === criteria.service;
      
      return matchesStatus && matchesSource && matchesService;
    });
    
    setSelectedLeads(filtered.map(lead => lead.id));
  };

  const handleTemplateSelect = (template) => {
    setEmailData({
      ...emailData,
      subject: template.subject,
      content: template.content,
      template: template.id
    });
  };

  const handleSendCampaign = () => {
    if (!emailData.subject || !emailData.content || selectedLeads.length === 0) {
      alert('Please fill in all required fields and select recipients');
      return;
    }

    const newCampaign = {
      id: Date.now(),
      name: emailData.subject,
      subject: emailData.subject,
      recipients: selectedLeads.length,
      status: scheduleType === 'now' ? 'sent' : 'scheduled',
      sentDate: scheduleType === 'now' ? new Date().toISOString().split('T')[0] : null,
      scheduledDate: scheduleType === 'scheduled' ? scheduleDate : null,
      openRate: scheduleType === 'now' ? '0%' : '-',
      clickRate: scheduleType === 'now' ? '0%' : '-'
    };

    setCampaigns([newCampaign, ...campaigns]);
    
    // Reset form
    setEmailData({ subject: '', content: '', template: '' });
    setSelectedLeads([]);
    setScheduleType('now');
    setScheduleDate('');
    setScheduleTime('');
    
    alert(`Campaign ${scheduleType === 'now' ? 'sent' : 'scheduled'} successfully!`);
  };

  const filteredLeadsForSelection = leads.filter(lead => {
    const matchesStatus = filterCriteria.status === 'all' || lead.status === filterCriteria.status;
    const matchesSource = filterCriteria.source === 'all' || lead.leadSource === filterCriteria.source;
    const matchesService = filterCriteria.service === 'all' || lead.serviceInterestedIn === filterCriteria.service;
    
    return matchesStatus && matchesSource && matchesService;
  });

  const statusOptions = ['New', 'Contacted', 'Demo Scheduled', 'Meeting Scheduled', 'Not Interested', 'Converted'];
  const sourceOptions = ['Referral', 'Social Media', 'Website', 'Call', 'Email', 'Event'];
  const serviceOptions = ['Software Development', 'Marketing Automation', 'Consulting', 'Support Services', 'Training'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Email Campaigns</h1>
          <p className="text-gray-600 mt-2">Create and manage email campaigns for your leads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Creator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Recipients</h2>
            
            {/* Filter Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filterCriteria.status}
                  onChange={(e) => handleFilterChange({ status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={filterCriteria.source}
                  onChange={(e) => handleFilterChange({ source: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Sources</option>
                  {sourceOptions.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select
                  value={filterCriteria.service}
                  onChange={(e) => handleFilterChange({ service: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Services</option>
                  {serviceOptions.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              {selectedLeads.length} of {filteredLeadsForSelection.length} leads selected
            </div>

            {/* Lead List */}
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredLeadsForSelection.map(lead => (
                <div key={lead.id} className="flex items-center p-3 border-b border-gray-100 last:border-b-0">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLeads([...selectedLeads, lead.id]);
                      } else {
                        setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                      }
                    }}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{lead.fullName}</div>
                    <div className="text-sm text-gray-500">{lead.email} • {lead.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Content</h2>

            {/* Template Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Templates
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {emailTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors duration-200 ${
                      emailData.template === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.subject}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Line */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Line *
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                placeholder="Enter email subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Content *
              </label>
              <ReactQuill
                value={emailData.content}
                onChange={(content) => setEmailData({ ...emailData, content })}
                style={{ height: '200px' }}
                className="mb-12"
              />
            </div>

            {/* Schedule Options */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send Options
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="send-now"
                    name="schedule"
                    value="now"
                    checked={scheduleType === 'now'}
                    onChange={(e) => setScheduleType(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="send-now" className="ml-2 text-sm text-gray-900">
                    Send Now
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="schedule-later"
                    name="schedule"
                    value="scheduled"
                    checked={scheduleType === 'scheduled'}
                    onChange={(e) => setScheduleType(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="schedule-later" className="ml-2 text-sm text-gray-900">
                    Schedule for Later
                  </label>
                </div>
              </div>

              {scheduleType === 'scheduled' && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Send Button */}
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleSendCampaign}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                {scheduleType === 'now' ? <Send className="w-4 h-4 mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
                {scheduleType === 'now' ? 'Send Campaign' : 'Schedule Campaign'}
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </button>
            </div>
          </div>
        </div>

        {/* Campaign History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign History</h2>
          
          <div className="space-y-4">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <div className="flex items-center mb-1">
                    <Users className="w-4 h-4 mr-1" />
                    {campaign.recipients} recipients
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {campaign.status === 'sent' ? `Sent ${campaign.sentDate}` : `Scheduled ${campaign.scheduledDate}`}
                  </div>
                </div>

                {campaign.status === 'sent' && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Open Rate</span>
                      <div className="font-medium text-gray-900">{campaign.openRate}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Click Rate</span>
                      <div className="font-medium text-gray-900">{campaign.clickRate}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {campaigns.length === 0 && (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-600">Create your first email campaign to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkEmailCampaigns;