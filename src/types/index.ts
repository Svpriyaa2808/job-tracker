export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected';

export type Priority = 'low' | 'medium' | 'high';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  priority: Priority;
  appliedDate?: string;
  location?: string;
  salary?: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  description?: string;
  notes?: string;
  url?: string;
  contactEmail?: string;
  contactName?: string;
  nextFollowUp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusColumn {
  id: ApplicationStatus;
  title: string;
  color: string;
}

export interface FilterOptions {
  status?: ApplicationStatus[];
  priority?: Priority[];
  jobType?: JobApplication['jobType'][];
  searchQuery?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface SortOptions {
  field: keyof JobApplication;
  direction: 'asc' | 'desc';
}

export interface AnalyticsData {
  totalApplications: number;
  byStatus: Record<ApplicationStatus, number>;
  byPriority: Record<Priority, number>;
  responseRate: number;
  averageTimeToResponse: number;
  successRate: number;
  applicationTrend: Array<{
    date: string;
    count: number;
  }>;
}
