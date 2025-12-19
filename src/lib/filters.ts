import { JobApplication, FilterOptions, SortOptions } from '@/types';

export function filterApplications(
  applications: JobApplication[],
  filters: FilterOptions
): JobApplication[] {
  let filtered = [...applications];

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(app => filters.status!.includes(app.status));
  }

  // Filter by priority
  if (filters.priority && filters.priority.length > 0) {
    filtered = filtered.filter(app => filters.priority!.includes(app.priority));
  }

  // Filter by job type
  if (filters.jobType && filters.jobType.length > 0) {
    filtered = filtered.filter(
      app => app.jobType && filters.jobType!.includes(app.jobType)
    );
  }

  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      app =>
        app.company.toLowerCase().includes(query) ||
        app.position.toLowerCase().includes(query) ||
        app.location?.toLowerCase().includes(query) ||
        app.description?.toLowerCase().includes(query) ||
        app.notes?.toLowerCase().includes(query)
    );
  }

  // Filter by date range
  if (filters.dateRange) {
    if (filters.dateRange.start) {
      filtered = filtered.filter(
        app =>
          app.appliedDate && app.appliedDate >= filters.dateRange!.start!
      );
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(
        app => app.appliedDate && app.appliedDate <= filters.dateRange!.end!
      );
    }
  }

  return filtered;
}

export function sortApplications(
  applications: JobApplication[],
  sort: SortOptions
): JobApplication[] {
  const sorted = [...applications];

  sorted.sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    let comparison = 0;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
