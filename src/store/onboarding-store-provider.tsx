"use client";

import {
  type OnboardingState,
  type OnboardingStore,
  createOnboardingStore,
} from "@/store/onboarding-store";

import { type ReactNode, createContext, useRef, useContext } from "react";

import { useStore } from "zustand";

export type OnboardingStoreApi = ReturnType<typeof createOnboardingStore>;

export const OnboardingStoreContext = createContext<
  OnboardingStoreApi | undefined
>(undefined);

export interface OnboardingStoreProviderProps {
  initialData?: OnboardingState;
  children: ReactNode;
}

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
