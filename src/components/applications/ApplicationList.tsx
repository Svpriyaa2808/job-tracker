'use client';

import React, { useState, useMemo } from 'react';
import { useApplications } from '@/contexts/ApplicationContext';
import { JobApplication, SortOptions, FilterOptions } from '@/types';
import { filterApplications, sortApplications } from '@/lib/filters';
import { exportToCSV, exportToPDF } from '@/lib/export';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { ApplicationForm } from '../ApplicationForm';
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  ArrowUpDown,
  Filter,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';

export function ApplicationList() {
  const { applications, addApplication, updateApplication, deleteApplication } =
    useApplications();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    priority: [],
    jobType: [],
  });

  const [sort, setSort] = useState<SortOptions>({
    field: 'createdAt',
    direction: 'desc',
  });

  // Apply filters and sorting
  const processedApplications = useMemo(() => {
    let filtered = filterApplications(applications, {
      ...filters,
      searchQuery,
    });

    return sortApplications(filtered, sort);
  }, [applications, filters, searchQuery, sort]);

  const handleSort = (field: keyof JobApplication) => {
    setSort(prev => ({
      field,
      direction:
        prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleEdit = (app: JobApplication) => {
    setEditingApp(app);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      deleteApplication(id);
    }
  };

  const handleSubmit = (
    data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingApp) {
      updateApplication(editingApp.id, data);
      setEditingApp(null);
    } else {
      addApplication(data);
      setIsAddModalOpen(false);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(processedApplications);
  };

  const handleExportPDF = () => {
    exportToPDF(processedApplications);
  };

  const SortButton = ({
    field,
    label,
  }: {
    field: keyof JobApplication;
    label: string;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
    >
      {label}
      <ArrowUpDown
        size={14}
        className={
          sort.field === field ? 'text-blue-600 dark:text-blue-400' : ''
        }
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Application Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {processedApplications.length} applications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={20} className="mr-2" />
            Filters
          </Button>

          <div className="relative">
            <Button variant="secondary" onClick={handleExportCSV}>
              <Download size={20} className="mr-2" />
              CSV
            </Button>
          </div>

          <Button variant="secondary" onClick={handleExportPDF}>
            <FileText size={20} className="mr-2" />
            HTML
          </Button>

          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Add Application
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {['wishlist', 'applied', 'interview', 'offer', 'rejected'].map(
                  status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status?.includes(status as any)}
                        onChange={e => {
                          const checked = e.target.checked;
                          setFilters(prev => ({
                            ...prev,
                            status: checked
                              ? [...(prev.status || []), status as any]
                              : prev.status?.filter(s => s !== status),
                          }));
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {status}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <div className="space-y-2">
                {['low', 'medium', 'high'].map(priority => (
                  <label key={priority} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.priority?.includes(priority as any)}
                      onChange={e => {
                        const checked = e.target.checked;
                        setFilters(prev => ({
                          ...prev,
                          priority: checked
                            ? [...(prev.priority || []), priority as any]
                            : prev.priority?.filter(p => p !== priority),
                        }));
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Type
              </label>
              <div className="space-y-2">
                {['full-time', 'part-time', 'contract', 'internship'].map(
                  jobType => (
                    <label key={jobType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.jobType?.includes(jobType as any)}
                        onChange={e => {
                          const checked = e.target.checked;
                          setFilters(prev => ({
                            ...prev,
                            jobType: checked
                              ? [...(prev.jobType || []), jobType as any]
                              : prev.jobType?.filter(j => j !== jobType),
                          }));
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {jobType.replace('-', ' ')}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              onClick={() =>
                setFilters({ status: [], priority: [], jobType: [] })
              }
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <SortButton field="company" label="Company" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="position" label="Position" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="status" label="Status" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="priority" label="Priority" />
              </th>
              <th className="px-6 py-3 text-left">
                <SortButton field="appliedDate" label="Applied Date" />
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Location
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Salary
                </span>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {processedApplications.map(app => (
              <tr
                key={app.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {app.company}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {app.position}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      app.status === 'wishlist'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        : app.status === 'applied'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : app.status === 'interview'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        : app.status === 'offer'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      app.priority === 'high'
                        ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                        : app.priority === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {app.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {app.appliedDate
                    ? format(new Date(app.appliedDate), 'MMM d, yyyy')
                    : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {app.location || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {app.salary || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(app)}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {processedApplications.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No applications found
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Application"
        size="lg"
      >
        <ApplicationForm
          onSubmit={handleSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      {editingApp && (
        <Modal
          isOpen={true}
          onClose={() => setEditingApp(null)}
          title="Edit Application"
          size="lg"
        >
          <ApplicationForm
            initialData={editingApp}
            onSubmit={handleSubmit}
            onCancel={() => setEditingApp(null)}
          />
        </Modal>
      )}
    </div>
  );
}
