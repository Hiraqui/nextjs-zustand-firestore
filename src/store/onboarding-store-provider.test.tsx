import React from "react";
import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import {
  OnboardingStoreProvider,
  useOnboardingStore,
  OnboardingStoreContext,
} from "./onboarding-store-provider";
import { createOnboardingStore } from "./onboarding-store";

// Mock dependencies to avoid Zustand complexity
jest.mock("./onboarding-store", () => ({
  createOnboardingStore: jest.fn(),
}));

const mockCreateOnboardingStore = createOnboardingStore as jest.MockedFunction<
  typeof createOnboardingStore
>;

describe("OnboardingStoreProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock store creation to return a simple store mock
    mockCreateOnboardingStore.mockReturnValue({} as never);
  });

  it("renders children", () => {
    render(
      <OnboardingStoreProvider>
        <div data-testid="child">Test Child</div>
      </OnboardingStoreProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("creates store with default initial state", () => {
    render(
      <OnboardingStoreProvider>
        <div>Child</div>
      </OnboardingStoreProvider>
    );

    expect(mockCreateOnboardingStore).toHaveBeenCalledWith(undefined);
  });

  it("creates store with custom initial data", () => {
    const customInitialData = {
      onboardingInfo: {
        name: "Custom Name",
        hobby: "Sports" as const,
        age: 25,
      },
      isComplete: true,
    };

    render(
      <OnboardingStoreProvider initialData={customInitialData}>
        <div>Child</div>
      </OnboardingStoreProvider>
    );

    expect(mockCreateOnboardingStore).toHaveBeenCalledWith(customInitialData);
  });

  it("only creates store once on re-renders", () => {
    const { rerender } = render(
      <OnboardingStoreProvider>
        <div>Child</div>
      </OnboardingStoreProvider>
    );

    rerender(
      <OnboardingStoreProvider>
        <div>Child Updated</div>
      </OnboardingStoreProvider>
    );

    // Should only be created once
    expect(mockCreateOnboardingStore).toHaveBeenCalledTimes(1);
  });

  it("throws error when useOnboardingStore is used outside of provider", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useOnboardingStore((store) => store));
    }).toThrow(
      "useOnboardingStore must be used within OnboardingStoreProvider"
    );

    consoleErrorSpy.mockRestore();
  });

  it("provides store value through context", () => {
    const ContextConsumer = () => {
      const context = React.useContext(OnboardingStoreContext);
      return (
        <div data-testid="context-value">
          {context ? "has-store" : "no-store"}
        </div>
      );
    };

    render(
      <OnboardingStoreProvider>
        <ContextConsumer />
      </OnboardingStoreProvider>
    );

    expect(screen.getByTestId("context-value")).toHaveTextContent("has-store");
  });

  it("provides consistent store reference across renders", () => {
    let firstRenderContext: unknown;
    let secondRenderContext: unknown;

    const ContextConsumer = ({
      saveRef,
    }: {
      saveRef: (ref: unknown) => void;
    }) => {
      const context = React.useContext(OnboardingStoreContext);
      saveRef(context);
      return <div>Test</div>;
    };

    const { rerender } = render(
      <OnboardingStoreProvider>
        <ContextConsumer
          saveRef={(ref) => {
            firstRenderContext = ref;
          }}
        />
      </OnboardingStoreProvider>
    );

    rerender(
      <OnboardingStoreProvider>
        <ContextConsumer
          saveRef={(ref) => {
            secondRenderContext = ref;
          }}
        />
      </OnboardingStoreProvider>
    );

    expect(firstRenderContext).toBe(secondRenderContext);
  });

  it("supports nested providers with different initial data", () => {
    const outerData = {
      onboardingInfo: { name: "Outer", hobby: "Art" as const, age: 20 },
      isComplete: false,
    };

    const innerData = {
      onboardingInfo: { name: "Inner", hobby: "Sports" as const, age: 25 },
      isComplete: true,
    };

    render(
      <OnboardingStoreProvider initialData={outerData}>
        <OnboardingStoreProvider initialData={innerData}>
          <div>Nested</div>
        </OnboardingStoreProvider>
      </OnboardingStoreProvider>
    );

    expect(mockCreateOnboardingStore).toHaveBeenCalledWith(outerData);
    expect(mockCreateOnboardingStore).toHaveBeenCalledWith(innerData);
    expect(mockCreateOnboardingStore).toHaveBeenCalledTimes(2);
  });
});
