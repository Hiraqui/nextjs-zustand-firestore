"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { firebaseConfig } from "./config";
import { connectEmulators } from "./emulator-config";

// Use automatic initialization
// https://firebase.google.com/docs/app-hosting/firebase-sdks#initialize-with-no-arguments
export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
connectEmulators({ auth });
