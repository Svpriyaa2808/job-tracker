'use client';

import React, { useMemo } from 'react';
import { useApplications } from '@/contexts/ApplicationContext';
import { calculateAnalytics } from '@/lib/analytics';
import { StatsCard } from './StatsCard';
import {
  Briefcase,
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  FileText,
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { STATUS_COLORS } from '@/lib/constants';

export function AnalyticsDashboard() {
  const { applications } = useApplications();

  const analytics = useMemo(() => {
    return calculateAnalytics(applications);
  }, [applications]);

  // Prepare data for charts
  const statusData = [
    { name: 'Wishlist', value: analytics.byStatus.wishlist, color: STATUS_COLORS.wishlist },
    { name: 'Applied', value: analytics.byStatus.applied, color: STATUS_COLORS.applied },
    { name: 'Interview', value: analytics.byStatus.interview, color: STATUS_COLORS.interview },
    { name: 'Offer', value: analytics.byStatus.offer, color: STATUS_COLORS.offer },
    { name: 'Rejected', value: analytics.byStatus.rejected, color: STATUS_COLORS.rejected },
  ].filter(item => item.value > 0);

  const priorityData = [
    { name: 'High', value: analytics.byPriority.high },
    { name: 'Medium', value: analytics.byPriority.medium },
    { name: 'Low', value: analytics.byPriority.low },
  ].filter(item => item.value > 0);

  const funnelData = [
    { stage: 'Total', count: analytics.totalApplications },
    { stage: 'Applied', count: analytics.byStatus.applied + analytics.byStatus.interview + analytics.byStatus.offer },
    { stage: 'Interview', count: analytics.byStatus.interview + analytics.byStatus.offer },
    { stage: 'Offer', count: analytics.byStatus.offer },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your job search progress and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Applications"
          value={analytics.totalApplications}
          icon={Briefcase}
          color="bg-blue-500"
        />

        <StatsCard
          title="Response Rate"
          value={`${analytics.responseRate}%`}
          icon={TrendingUp}
          color="bg-green-500"
          subtitle="Applications with responses"
        />

        <StatsCard
          title="Success Rate"
          value={`${analytics.successRate}%`}
          icon={CheckCircle}
          color="bg-purple-500"
          subtitle="Offers received"
        />

        <StatsCard
          title="Avg. Response Time"
          value={`${analytics.averageTimeToResponse}d`}
          icon={Clock}
          color="bg-yellow-500"
          subtitle="Days to hear back"
        />

        <StatsCard
          title="In Interview"
          value={analytics.byStatus.interview}
          icon={Target}
          color="bg-orange-500"
        />

        <StatsCard
          title="Offers Received"
          value={analytics.byStatus.offer}
          icon={FileText}
          color="bg-teal-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Applications by Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Applications by Priority
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Application Trend */}
        {analytics.applicationTrend.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Application Trend (Last 30 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.applicationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => {
                    const date = new Date(value as string);
                    return date.toLocaleDateString();
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Success Funnel */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Application Funnel
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
