'use client';

import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { JobApplication, ApplicationStatus } from '@/types';
import { useApplications } from '@/contexts/ApplicationContext';
import { STATUS_COLUMNS } from '@/lib/constants';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { Modal } from '../ui/Modal';
import { ApplicationForm } from '../ApplicationForm';
import { Button } from '../ui/Button';
import { Plus, Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { filterApplications } from '@/lib/filters';

export function KanbanBoard() {
  const { applications, updateApplication, deleteApplication, addApplication } = useApplications();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter applications by search query
  const filteredApplications = useMemo(() => {
    return filterApplications(applications, { searchQuery });
  }, [applications, searchQuery]);

  // Group applications by status
  const applicationsByStatus = useMemo(() => {
    const grouped: Record<ApplicationStatus, JobApplication[]> = {
      wishlist: [],
      applied: [],
      interview: [],
      offer: [],
      rejected: [],
    };

    filteredApplications.forEach(app => {
      grouped[app.status].push(app);
    });

    return grouped;
  }, [filteredApplications]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dragging over a column
    const isOverColumn = STATUS_COLUMNS.some(col => col.id === overId);

    if (isOverColumn) {
      const newStatus = overId as ApplicationStatus;
      const application = applications.find(app => app.id === activeId);

      if (application && application.status !== newStatus) {
        updateApplication(activeId, { status: newStatus });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const isOverColumn = STATUS_COLUMNS.some(col => col.id === overId);

    if (isOverColumn) {
      const newStatus = overId as ApplicationStatus;
      updateApplication(activeId, { status: newStatus });
    }
  };

  const handleEdit = (app: JobApplication) => {
    setEditingApp(app);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      deleteApplication(id);
    }
  };

  const handleSubmit = (data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingApp) {
      updateApplication(editingApp.id, data);
      setEditingApp(null);
    } else {
      addApplication(data);
      setIsAddModalOpen(false);
    }
  };

  const activeApplication = activeId
    ? applications.find(app => app.id === activeId)
    : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Kanban Board
          </h1>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Add Application
          </Button>
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
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {STATUS_COLUMNS.map(column => (
              <KanbanColumn
                key={column.id}
                status={column.id}
                title={column.title}
                color={column.color}
                applications={applicationsByStatus[column.id]}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeApplication && (
            <div className="rotate-3">
              <KanbanCard
                application={activeApplication}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

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
