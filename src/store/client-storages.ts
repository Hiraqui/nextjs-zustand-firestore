/**
 * Client-side storage names for Zustand stores
 * These are safe to expose to the client as they only identify local storage keys
 */
export const STORAGES = {
  onboarding: "onboarding-storage",
  assessmentsLayout: "assessment-layout-storage",
  sidebar: "sidebar-storage",
} as const;

// Type helper for storage keys
export type StorageKeys = keyof typeof STORAGES;
