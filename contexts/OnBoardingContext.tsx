import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";

// Define the shape of the context
interface OnboardingContextType {
  isOnboardingCompleted: boolean;
  completeOnboarding: () => Promise<void>;
}

// Create the context with a default undefined value
export const OnboardingContext = createContext<
  OnboardingContextType | undefined
>(undefined);

// Define props for the provider component
interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({
  children,
}) => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] =
    useState<boolean>(false);

  useEffect(() => {
    const loadOnboardingStatus = async () => {
      const hasOnboarded = await SecureStore.getItemAsync("onboarded");
      if (hasOnboarded) {
        setIsOnboardingCompleted(true);
      }
    };
    loadOnboardingStatus();
  }, []);

  const completeOnboarding = async () => {
    await SecureStore.setItemAsync("onboarded", "true");
    setIsOnboardingCompleted(true);
  };

  return (
    <OnboardingContext.Provider
      value={{ isOnboardingCompleted, completeOnboarding }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
