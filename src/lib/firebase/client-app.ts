"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { firebaseConfig } from "./config";
import { connectEmulators } from "./emulator-config";

/**
 * Client-side Firebase app instance.
 * Initialized with the Firebase configuration and used for all client-side Firebase operations.
 */
export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

// Connect to emulators in development environment
connectEmulators({ auth });
