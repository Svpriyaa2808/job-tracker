
'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { JobApplication, ApplicationStatus } from '@/types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  status: ApplicationStatus;
  title: string;
  color: string;
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
}

export function KanbanColumn({
  status,
  title,
  color,
  applications,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col h-full min-w-[280px]">
      {/* Column Header */}
      <div className={`${color} p-4 rounded-t-lg`}>
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm bg-white dark:bg-gray-700 px-2 py-1 rounded-full">
            {applications.length}
          </span>
        </h2>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg min-h-[500px] transition-colors ${
          isOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
      >
        <SortableContext
          items={applications.map(app => app.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map(app => (
            <KanbanCard
              key={app.id}
              application={app}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

          {applications.length === 0 && (
            <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-600 text-sm">
              No applications
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

