'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { JobApplication } from '@/types';
import { PRIORITY_COLORS } from '@/lib/constants';
import { Briefcase, MapPin, Calendar, DollarSign, Edit, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface KanbanCardProps {
  application: JobApplication;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
}

export function KanbanCard({ application, onEdit, onDelete }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-move"
    >
      {/* Priority Indicator */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[application.priority]}`}
            title={`${application.priority} priority`}
          />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {application.position}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          {application.url && (
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ExternalLink size={16} />
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(application);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(application.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Company */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <Briefcase size={14} />
        <span>{application.company}</span>
      </div>

      {/* Additional Info */}
      <div className="space-y-1 text-xs text-gray-500 dark:text-gray-500">
        {application.location && (
          <div className="flex items-center gap-2">
            <MapPin size={12} />
            <span>{application.location}</span>
          </div>
        )}

        {application.salary && (
          <div className="flex items-center gap-2">
            <DollarSign size={12} />
            <span>{application.salary}</span>
          </div>
        )}

        {application.appliedDate && (
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            <span>Applied: {format(new Date(application.appliedDate), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>

      {/* Job Type Badge */}
      {application.jobType && (
        <div className="mt-3">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {application.jobType}
          </span>
        </div>
      )}
    </div>
  );
}
