'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JobApplication } from '@/types';
import { storageService } from '@/lib/storage';

interface ApplicationContextType {
  applications: JobApplication[];
  addApplication: (application: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  refreshApplications: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    // Load applications from storage on mount
    const stored = storageService.getApplications();
    setApplications(stored);
  }, []);

  const refreshApplications = () => {
    const stored = storageService.getApplications();
    setApplications(stored);
  };

  const addApplication = (
    application: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const newApplication: JobApplication = {
      ...application,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };

    storageService.addApplication(newApplication);
    refreshApplications();
  };

  const updateApplication = (id: string, updates: Partial<JobApplication>) => {
    storageService.updateApplication(id, updates);
    refreshApplications();
  };

  const deleteApplication = (id: string) => {
    storageService.deleteApplication(id);
    refreshApplications();
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        addApplication,
        updateApplication,
        deleteApplication,
        refreshApplications,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
}
