import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Phone, 
  Video, 
  Clock, 
  TrendingUp, 
  Calendar,
  Plus,
  ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { updateStats } from '../store/slices/dashboardSlice';
import { format, isToday, isTomorrow } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, color, change, href }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {change && (
          <p className="text-sm text-green-600 mt-1">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            {change}% from last week
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {href && (
      <Link 
        to={href}
        className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        View details
        <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    )}
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, weeklyFollowups } = useSelector(state => state.dashboard);
  const { leads } = useSelector(state => state.leads);
  const { notifications } = useSelector(state => state.notifications);

  useEffect(() => {
    // Calculate real stats from leads data
    const totalLeads = leads.length;
    const upcomingCalls = leads.filter(lead => 
      lead.nextFollowUpDate && (isToday(new Date(lead.nextFollowUpDate)) || isTomorrow(new Date(lead.nextFollowUpDate)))
    ).length;
    const scheduledDemos = leads.filter(lead => lead.status === 'Demo Scheduled').length;
    const followupsPending = leads.filter(lead => 
      lead.nextFollowUpDate && new Date(lead.nextFollowUpDate) < new Date()
    ).length;
    const leadsConverted = leads.filter(lead => lead.status === 'Converted').length;
    const conversionRate = totalLeads > 0 ? Math.round((leadsConverted / totalLeads) * 100) : 0;

    dispatch(updateStats({
      totalLeads,
      upcomingCalls,
      scheduledDemos,
      followupsPending,
      leadsConverted,
      conversionRate
    }));
  }, [leads, dispatch]);

  const recentLeads = leads.slice(0, 5);
  const urgentNotifications = notifications.filter(n => n.priority === 'high' && !n.read);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your leads today.</p>
        </div>
        <Link
          to="/leads/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Lead
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={Users}
          color="bg-blue-500"
          change={12}
          href="/leads"
        />
        <StatCard
          title="Upcoming Calls"
          value={stats.upcomingCalls}
          icon={Phone}
          color="bg-green-500"
          change={8}
          href="/followups"
        />
        <StatCard
          title="Scheduled Demos"
          value={stats.scheduledDemos}
          icon={Video}
          color="bg-purple-500"
          change={15}
          href="/meetings"
        />
        <StatCard
          title="Pending Follow-ups"
          value={stats.followupsPending}
          icon={Clock}
          color="bg-orange-500"
          href="/followups"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Follow-ups Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Follow-ups</h3>
            <div className="text-sm text-gray-500">This Week</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyFollowups}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
            <Link to="/leads" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{lead.fullName}</p>
                    <p className="text-sm text-gray-600">{lead.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                    lead.status === 'Demo Scheduled' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(lead.firstContactDate), 'MMM dd')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent Notifications */}
      {urgentNotifications.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-red-900">Urgent Actions Required</h3>
          </div>
          <div className="space-y-2">
            {urgentNotifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
                <Link
                  to="/notifications"
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/leads/add"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Plus className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Add New Lead</h4>
            <p className="text-sm text-gray-600">Create a new lead entry</p>
          </Link>
          <Link
            to="/followups"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Schedule Follow-up</h4>
            <p className="text-sm text-gray-600">Plan your next contact</p>
          </Link>
          <Link
            to="/campaigns"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Email Campaign</h4>
            <p className="text-sm text-gray-600">Send bulk emails</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;