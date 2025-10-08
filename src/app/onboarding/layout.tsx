import { getTempCollectionAction } from "@/actions/get-temp-collection-action";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server-app";
import { STORAGES } from "@/store/client-storages";
import { initialState, OnboardingState } from "@/store/onboarding-store";
import { OnboardingStoreProvider } from "@/store/onboarding-store-provider";
import { notFound, redirect } from "next/navigation";

/**
 * Layout component for the onboarding section of the application.
 *
 * This layout handles authentication verification, retrieves existing onboarding
 * data from Firestore, and provides the onboarding store context to child components.
 * It initializes the store with server-side data or defaults, including the user's
 * display name from their authentication profile.
 *
 * @param props - Component props
 * @param props.children - Child components to render within the onboarding layout
 * @returns JSX element representing the onboarding layout with store provider
 */
export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    redirect("/");
  }

  const store = await getTempCollectionAction(STORAGES.onboarding);

  if (!store) {
    return notFound();
  }

  let initialData: OnboardingState = store.data
    ? JSON.parse(store.data).state
    : undefined;

  if (!initialData)
    initialData = {
      ...initialState,
      onboardingInfo: {
        ...initialState.onboardingInfo,
        name: currentUser.displayName || "Anonymous",
      },
    };

  return (
    <main className="bg-primary relative h-full w-full overflow-auto text-gray-300">
      <ScrollArea className="h-full w-full flex-1 [&>div>div]:h-full">
        <OnboardingStoreProvider initialData={initialData}>
          {children}
        </OnboardingStoreProvider>
      </ScrollArea>
    </main>
  );
}
