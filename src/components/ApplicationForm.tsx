'use client';

import React, { useState } from 'react';
import { JobApplication, ApplicationStatus, Priority } from '@/types';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';

interface ApplicationFormProps {
  initialData?: Partial<JobApplication>;
  onSubmit: (data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ApplicationForm({ initialData, onSubmit, onCancel }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    company: initialData?.company || '',
    position: initialData?.position || '',
    status: initialData?.status || 'wishlist' as ApplicationStatus,
    priority: initialData?.priority || 'medium' as Priority,
    appliedDate: initialData?.appliedDate || '',
    location: initialData?.location || '',
    salary: initialData?.salary || '',
    jobType: initialData?.jobType || 'full-time',
    description: initialData?.description || '',
    notes: initialData?.notes || '',
    url: initialData?.url || '',
    contactEmail: initialData?.contactEmail || '',
    contactName: initialData?.contactName || '',
    nextFollowUp: initialData?.nextFollowUp || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData as Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Company *"
          name="company"
          value={formData.company}
          onChange={handleChange}
          error={errors.company}
          placeholder="e.g., Google"
        />

        <Input
          label="Position *"
          name="position"
          value={formData.position}
          onChange={handleChange}
          error={errors.position}
          placeholder="e.g., Software Engineer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'wishlist', label: 'Wishlist' },
            { value: 'applied', label: 'Applied' },
            { value: 'interview', label: 'Interview' },
            { value: 'offer', label: 'Offer' },
            { value: 'rejected', label: 'Rejected' },
          ]}
        />

        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Applied Date"
          name="appliedDate"
          type="date"
          value={formData.appliedDate}
          onChange={handleChange}
        />

        <Select
          label="Job Type"
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          options={[
            { value: 'full-time', label: 'Full-time' },
            { value: 'part-time', label: 'Part-time' },
            { value: 'contract', label: 'Contract' },
            { value: 'internship', label: 'Internship' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., San Francisco, CA"
        />

        <Input
          label="Salary"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="e.g., $120k - $150k"
        />
      </div>

      <Input
        label="Job URL"
        name="url"
        type="url"
        value={formData.url}
        onChange={handleChange}
        placeholder="https://..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Contact Name"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          placeholder="e.g., John Doe"
        />

        <Input
          label="Contact Email"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleChange}
          placeholder="john@example.com"
        />
      </div>

      <Input
        label="Next Follow-up Date"
        name="nextFollowUp"
        type="date"
        value={formData.nextFollowUp}
        onChange={handleChange}
      />

      <Textarea
        label="Job Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        placeholder="Brief description of the role..."
      />

      <Textarea
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows={3}
        placeholder="Any additional notes..."
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Update' : 'Add'} Application
        </Button>
      </div>
    </form>
  );
}
