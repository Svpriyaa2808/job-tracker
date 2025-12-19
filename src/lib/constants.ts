import { StatusColumn } from '@/types';

export const STATUS_COLUMNS: StatusColumn[] = [
  {
    id: 'wishlist',
    title: 'Wishlist',
    color: 'bg-gray-100 dark:bg-gray-800',
  },
  {
    id: 'applied',
    title: 'Applied',
    color: 'bg-blue-100 dark:bg-blue-900',
  },
  {
    id: 'interview',
    title: 'Interview',
    color: 'bg-yellow-100 dark:bg-yellow-900',
  },
  {
    id: 'offer',
    title: 'Offer',
    color: 'bg-green-100 dark:bg-green-900',
  },
  {
    id: 'rejected',
    title: 'Rejected',
    color: 'bg-red-100 dark:bg-red-900',
  },
];

export const PRIORITY_COLORS = {
  low: 'bg-gray-400',
  medium: 'bg-yellow-400',
  high: 'bg-red-500',
};

export const STATUS_COLORS = {
  wishlist: '#6B7280',
  applied: '#3B82F6',
  interview: '#F59E0B',
  offer: '#10B981',
  rejected: '#EF4444',
};
