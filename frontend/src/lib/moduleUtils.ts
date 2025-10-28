import { vulnerabilities } from "./vulnerabilities";

export interface LastViewedModule {
  id: number;
  title: string;
  progress: number;
  updatedAt: number;
}

/**
 * Save the last viewed module to localStorage
 */
export function saveLastViewedModule(moduleId: number, progress: number): void {
  const module = vulnerabilities.find((v) => v.id === moduleId);
  if (module) {
    const lastViewedData: LastViewedModule = {
      id: moduleId,
      title: module.title,
      progress,
      updatedAt: Date.now(),
    };
    localStorage.setItem('lastViewedModule', JSON.stringify(lastViewedData));
  }
}

/**
 * Get the last viewed module from localStorage
 */
export function getLastViewedModule(): LastViewedModule | null {
  try {
    const stored = localStorage.getItem('lastViewedModule');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse last viewed module', e);
  }
  return null;
}

/**
 * Get time elapsed string from timestamp
 */
export function getTimeElapsed(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}
