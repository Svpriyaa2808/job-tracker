import { JobApplication } from '@/types';

const STORAGE_KEY = 'job-applications';

class StorageService {
  private isClient = typeof window !== 'undefined';

  getApplications(): JobApplication[] {
    if (!this.isClient) return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from storage:', error);
      return [];
    }
  }

  saveApplications(applications: JobApplication[]): void {
    if (!this.isClient) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  addApplication(application: JobApplication): void {
    const applications = this.getApplications();
    applications.push(application);
    this.saveApplications(applications);
  }

  updateApplication(id: string, updates: Partial<JobApplication>): void {
    const applications = this.getApplications();
    const index = applications.findIndex(app => app.id === id);

    if (index !== -1) {
      applications[index] = {
        ...applications[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveApplications(applications);
    }
  }

  deleteApplication(id: string): void {
    const applications = this.getApplications();
    const filtered = applications.filter(app => app.id !== id);
    this.saveApplications(filtered);
  }

  getApplicationById(id: string): JobApplication | undefined {
    const applications = this.getApplications();
    return applications.find(app => app.id === id);
  }

  clearAll(): void {
    if (!this.isClient) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export const storageService = new StorageService();
