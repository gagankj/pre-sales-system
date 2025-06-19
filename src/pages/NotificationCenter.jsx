import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Bell, 
  Clock, 
  Calendar, 
  Phone, 
  Video, 
  AlertCircle,
  Check,
  X,
  Trash2
} from 'lucide-react';
import { markAsRead, clearNotifications } from '../store/slices/notificationsSlice';
import { format, isToday, isTomorrow } from 'date-fns';

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector(state => state.notifications);
  const { leads } = useSelector(state => state.leads);

  // Generate dynamic notifications based on leads data
  const dynamicNotifications = [];

  // Check for overdue follow-ups
  leads.forEach(lead => {
    if (lead.nextFollowUpDate) {
      const followUpDate = new Date(lead.nextFollowUpDate);
      const now = new Date();
      
      if (followUpDate < now && !isToday(followUpDate)) {
        dynamicNotifications.push({
          id: `overdue-${lead.id}`,
          type: 'followup',
          title: 'Overdue Follow-up',
          message: `Follow-up with ${lead.fullName} was due ${format(followUpDate, 'MMM dd')}`,
          priority: 'high',
          timestamp: followUpDate.toISOString(),
          read: false,
          leadId: lead.id,
          leadName: lead.fullName
        });
      } else if (isToday(followUpDate)) {
        dynamicNotifications.push({
          id: `today-${lead.id}`,
          type: 'followup',
          title: 'Follow-up Due Today',
          message: `Follow-up with ${lead.fullName} is due today`,
          priority: 'high',
          timestamp: followUpDate.toISOString(),
          read: false,
          leadId: lead.id,
          leadName: lead.fullName
        });
      } else if (isTomorrow(followUpDate)) {
        dynamicNotifications.push({
          id: `tomorrow-${lead.id}`,
          type: 'followup',
          title: 'Follow-up Due Tomorrow',
          message: `Follow-up with ${lead.fullName} is due tomorrow`,
          priority: 'medium',
          timestamp: followUpDate.toISOString(),
          read: false,
          leadId: lead.id,
          leadName: lead.fullName
        });
      }
    }
  });

  // Check for scheduled demos/meetings
  leads.forEach(lead => {
    if (lead.status === 'Demo Scheduled' || lead.status === 'Meeting Scheduled') {
      dynamicNotifications.push({
        id: `meeting-${lead.id}`,
        type: 'demo',
        title: `${lead.status}`,
        message: `${lead.status.toLowerCase()} with ${lead.fullName}`,
        priority: 'medium',
        timestamp: new Date().toISOString(),
        read: false,
        leadId: lead.id,
        leadName: lead.fullName
      });
    }
  });

  const allNotifications = [...dynamicNotifications, ...notifications]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'followup':
        return { icon: Clock, color: 'text-orange-600' };
      case 'demo':
        return { icon: Video, color: 'text-purple-600' };
      case 'meeting':
        return { icon: Calendar, color: 'text-blue-600' };
      case 'call':
        return { icon: Phone, color: 'text-green-600' };
      case 'alert':
        return { icon: AlertCircle, color: 'text-red-600' };
      default:
        return { icon: Bell, color: 'text-gray-600' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      dispatch(clearNotifications());
    }
  };

  const unreadCount = allNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with your leads and scheduled activities
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        {allNotifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {allNotifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {allNotifications.map((notification) => {
              const { icon: Icon, color } = getNotificationIcon(notification.type);
              
              return (
                <div
                  key={notification.id}
                  className={`p-6 border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full bg-white ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(notification.timestamp), 'MMM dd, yyyy h:mm a')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {notification.priority === 'high' && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Urgent
                        </span>
                      )}
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action buttons for lead-related notifications */}
                  {notification.leadId && (
                    <div className="mt-4 flex items-center space-x-2">
                      <a
                        href={`/leads/${notification.leadId}`}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200"
                      >
                        View Lead
                      </a>
                      {notification.type === 'followup' && (
                        <button className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors duration-200">
                          Schedule Follow-up
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Follow-up Reminders</h3>
              <p className="text-sm text-gray-600">Get notified about upcoming and overdue follow-ups</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Meeting Reminders</h3>
              <p className="text-sm text-gray-600">Get notified about scheduled demos and meetings</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Lead Status Changes</h3>
              <p className="text-sm text-gray-600">Get notified when lead statuses are updated</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Email Campaign Updates</h3>
              <p className="text-sm text-gray-600">Get notified about email campaign results</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;