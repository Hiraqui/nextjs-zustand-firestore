import SignInWithGoogle from "@/components/auth/sign-in-with-google";
import Image from "next/image";

/**
 * Home page component that serves as the landing page for the application.
 *
 * This page displays the main welcome message, explains the demo's purpose,
 * and provides a Google sign-in button for authentication. It also includes
 * a footer with a link to the source code repository.
 *
 * @returns JSX element representing the home page
 */
export default async function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-y-20 row-start-2 items-center">
        <h1 className="font-display text-3xl font-bold text-primary/70 transition-colors sm:text-5xl">
          Welcome to{" "}
          <span className="text-primary">nextjs + zustand + firestore</span>
        </h1>
        <p className="max-w-xl text-center text-lg text-primary/70 sm:text-xl">
          Experience seamless state management with Firestore as a temporary
          database. This demo shows how Zustand stores can automatically sync
          with Firestore via Next.js Server Actions instead of localStorage.
        </p>

        <SignInWithGoogle />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/Hiraqui/nextjs-zustand-firestore"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/github-mark.svg"
            alt="GitHub icon"
            width={16}
            height={16}
          />
          View source code →
        </a>
      </footer>
    </div>
  );
}
