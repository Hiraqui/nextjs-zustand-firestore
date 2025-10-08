import { isOnboardingCompleteAction } from "@/actions/is-onboarding-complete-action";
import { OnboardingInfo } from "@/types/onboarding";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";

import { shared } from "use-broadcast-ts";

import { STORAGES } from "./client-storages";
import { createServerStorage } from "./server-storage";

/** Debounce delay in milliseconds for persisting onboarding data to server */
const PERSIST_DEBOUNCE = 2500;

/**
 * Interface defining the state structure for onboarding data.
 */
export interface OnboardingState {
  onboardingInfo: OnboardingInfo;
  isComplete: boolean;
}

/**
 * Interface defining the available actions for managing onboarding state.
 */
export interface OnboardingActions {
  setOnboardingInfo: (
    field: keyof OnboardingInfo,
    value: string | number | undefined
  ) => void;
  setIsComplete: (isComplete: boolean) => void;
  resetOnboardingInfo: () => void;
  calculateIsComplete: () => Promise<void>;
}

export type OnboardingStore = OnboardingState & OnboardingActions;

/**
 * Initial state for the onboarding store.
 * Provides default values for all onboarding fields.
 */
export const initialState: OnboardingState = {
  onboardingInfo: {
    name: "",
    hobby: "Art",
    age: 0,
  },
  isComplete: false,
};

/**
 * Factory function to create an onboarding store instance.
 * Creates a Zustand store with persistence, cross-tab synchronization,
 * and server-side storage for onboarding form data.
 *
 * @param initState - Initial state for the store (defaults to initialState)
 * @returns A configured Zustand store for onboarding management
 */
export const createOnboardingStore = (
  initState: OnboardingState = initialState
) => {
  const useOnboardingStoreBase = create<OnboardingStore>()(
    shared(
      subscribeWithSelector(
        persist(
          (set, get) => ({
            ...initState,
            setOnboardingInfo: (field, value) => {
              set((state) => {
                const updatedOnboardingValues = {
                  ...state.onboardingInfo,
                  [field]: value,
                };
                return { onboardingInfo: updatedOnboardingValues };
              });

              get().calculateIsComplete();
            },
            setIsComplete: (isComplete) => set({ isComplete }),
            resetOnboardingInfo: () => {
              set({ ...initialState });
            },

            /**
             * Calculates and updates the completion status based on current form data.
             *
             * This method demonstrates executing server logic inside a Zustand store
             * by calling a Next.js server action. This pattern allows complex validation
             * logic to run on the server while maintaining reactive state updates in
             * the client store. The server can access databases, perform validations,
             * and return results that immediately update the store state.
             */
            calculateIsComplete: async () => {
              const { onboardingInfo } = get();
              const isComplete = await isOnboardingCompleteAction(
                onboardingInfo
              );

              if (!isComplete.success) {
                console.error(
                  "Failed to check if onboarding is complete:",
                  isComplete.error
                );

                return;
              }

              set({
                isComplete: !!isComplete.data,
              });
            },
          }),
          {
            name: STORAGES.onboarding,
            skipHydration: true,
            storage: createJSONStorage(() =>
              createServerStorage(undefined, {
                debounce: PERSIST_DEBOUNCE,
              })
            ),
          }
        )
      )
    )
  );

  return useOnboardingStoreBase;
};
