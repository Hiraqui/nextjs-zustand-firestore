"use client";

import {
  type OnboardingState,
  type OnboardingStore,
  createOnboardingStore,
} from "@/store/onboarding-store";

import { type ReactNode, createContext, useRef, useContext } from "react";

import { useStore } from "zustand";

/**
 * Type representing the onboarding store API returned by the factory function.
 */
export type OnboardingStoreApi = ReturnType<typeof createOnboardingStore>;

/**
 * React context for providing the onboarding store to child components.
 */
export const OnboardingStoreContext = createContext<
  OnboardingStoreApi | undefined
>(undefined);

/**
 * Props for the OnboardingStoreProvider component.
 */
export interface OnboardingStoreProviderProps {
  initialData?: OnboardingState;
  children: ReactNode;
}

/**
 * Provider component that creates and provides access to the onboarding store.
 * Uses a ref to ensure the store is only created once per provider instance,
 * preventing unnecessary re-creations during re-renders.
 *
 * @param props - Component props
 * @returns JSX element that provides the store context
 */
export const OnboardingStoreProvider = ({
  children,
  initialData,
}: OnboardingStoreProviderProps) => {
  const storeRef = useRef<OnboardingStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createOnboardingStore(initialData);
  }

  return (
    <OnboardingStoreContext.Provider value={storeRef.current}>
      {children}
    </OnboardingStoreContext.Provider>
  );
};

/**
 * Hook to access the onboarding store with a selector function.
 * Provides type-safe access to specific parts of the store state or actions.
 *
 * @param selector - Function to select specific data from the store
 * @returns The selected data from the store
 * @throws Error if used outside of OnboardingStoreProvider
 *
 * @template T - The type of data returned by the selector
 */
export const useOnboardingStore = <T,>(
  selector: (store: OnboardingStore) => T
): T => {
  const counterStoreContext = useContext(OnboardingStoreContext);

  if (!counterStoreContext) {
    throw new Error(
      `useOnboardingStore must be used within OnboardingStoreProvider`
    );
  }

  return useStore(counterStoreContext, selector);
};
