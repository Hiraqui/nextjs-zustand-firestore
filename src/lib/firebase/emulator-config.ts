import { connectAuthEmulator, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  type Firestore,
} from "firebase/firestore/lite";

const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST;
const authEmulatorPort = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT;
const firestoreEmulatorPort = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT;

const shouldConnectAuthEmulator =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR === "true";
const shouldConnectFirestoreEmulator =
  process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR === "true";

interface ConnectEmulatorsParams {
  auth?: Auth;
  firestore?: Firestore;
}

export function connectEmulators({
  auth,
  firestore,
}: ConnectEmulatorsParams = {}) {
  if (!host)
    throw new Error(
      "The NEXT_PUBLIC_FIREBASE_EMULATOR_HOST environment variable is not set"
    );

  if (shouldConnectAuthEmulator && auth) {
    if (!authEmulatorPort)
      throw new Error(
        "The NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT environment variable is not set"
      );
    const authEmulatorUrl = `http://${host}:${authEmulatorPort}`;
    (auth as unknown as { _canInitEmulator: boolean })._canInitEmulator = true;

    connectAuthEmulator(auth, authEmulatorUrl, { disableWarnings: true });
    console.info("Using firebase auth emulator...");
  }

  if (
    shouldConnectFirestoreEmulator &&
    firestore &&
    !(firestore as unknown as { _settingsFrozen: boolean })._settingsFrozen
  ) {
    if (!firestoreEmulatorPort)
      throw new Error(
        "The NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT environment variable is not set"
      );
    connectFirestoreEmulator(firestore, host, Number(firestoreEmulatorPort));
    console.info("Using firestore emulator...");
  }
}
