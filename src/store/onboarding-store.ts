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

const PERSIST_DEBOUNCE = 2500;

export interface OnboardingState {
  onboardingInfo: OnboardingInfo;
  isComplete: boolean;
}

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

export const initialState: OnboardingState = {
  onboardingInfo: {
    name: "",
    hobby: "Art",
    age: 0,
  },
  isComplete: false,
};

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
