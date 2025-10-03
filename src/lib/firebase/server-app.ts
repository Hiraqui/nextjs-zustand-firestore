// enforces that this code can only be called on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
"use server";

import { SESSION_COOKIE } from "./config";

import { initializeApp, initializeServerApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";

import { cookies } from "next/headers";

import { firebaseConfig } from "./config";
import { connectEmulators } from "./emulator-config";

export async function getAuthenticatedAppForUser() {
  const authIdToken = (await cookies()).get(SESSION_COOKIE)?.value;

  // Firebase Server App is a new feature in the JS SDK that allows you to
  // instantiate the SDK with credentials retrieved from the client & has
  // other affordances for use in server environments.
  const firebaseServerApp = initializeServerApp(
    // https://github.com/firebase/firebase-js-sdk/issues/8863#issuecomment-2751401913
    initializeApp(firebaseConfig),
    authIdToken
      ? {
          authIdToken,
        }
      : {}
  );

  const auth = getAuth(firebaseServerApp);
  connectEmulators({ auth });
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}

export async function getServerFirestore() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const firestore = getFirestore(firebaseServerApp);
  connectEmulators({ firestore });

  return { db: firestore, currentUser };
}
