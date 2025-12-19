import { JobApplication, AnalyticsData, ApplicationStatus } from '@/types';
import { format, differenceInDays, parseISO } from 'date-fns';

export function calculateAnalytics(applications: JobApplication[]): AnalyticsData {
  const totalApplications = applications.length;

  // Count by status
  const byStatus: Record<ApplicationStatus, number> = {
    wishlist: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };

  applications.forEach(app => {
    byStatus[app.status]++;
  });

  // Count by priority
  const byPriority = {
    low: applications.filter(app => app.priority === 'low').length,
    medium: applications.filter(app => app.priority === 'medium').length,
    high: applications.filter(app => app.priority === 'high').length,
  };

  // Calculate response rate (applications that moved beyond applied)
  const appliedCount = applications.filter(app =>
    ['applied', 'interview', 'offer', 'rejected'].includes(app.status)
  ).length;

  const respondedCount = applications.filter(app =>
    ['interview', 'offer', 'rejected'].includes(app.status)
  ).length;

  const responseRate = appliedCount > 0
    ? (respondedCount / appliedCount) * 100
    : 0;

  // Calculate success rate (offers / total applications)
  const successRate = totalApplications > 0
    ? (byStatus.offer / totalApplications) * 100
    : 0;

  // Calculate average time to response
  const applicationsWithDates = applications.filter(
    app => app.appliedDate && app.status !== 'wishlist' && app.status !== 'applied'
  );

  const averageTimeToResponse = applicationsWithDates.length > 0
    ? applicationsWithDates.reduce((sum, app) => {
        if (!app.appliedDate) return sum;
        const applied = parseISO(app.appliedDate);
        const updated = parseISO(app.updatedAt);
        return sum + differenceInDays(updated, applied);
      }, 0) / applicationsWithDates.length
    : 0;

  // Application trend (last 30 days)
  const trend: Map<string, number> = new Map();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  applications.forEach(app => {
    const createdDate = parseISO(app.createdAt);
    if (createdDate >= thirtyDaysAgo) {
      const dateKey = format(createdDate, 'yyyy-MM-dd');
      trend.set(dateKey, (trend.get(dateKey) || 0) + 1);
    }
  });

  const applicationTrend = Array.from(trend.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalApplications,
    byStatus,
    byPriority,
    responseRate: Math.round(responseRate * 10) / 10,
    averageTimeToResponse: Math.round(averageTimeToResponse * 10) / 10,
    successRate: Math.round(successRate * 10) / 10,
    applicationTrend,
  };
}
