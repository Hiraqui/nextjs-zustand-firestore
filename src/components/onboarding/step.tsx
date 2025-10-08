import * as motion from "motion/react-client";
import type { PropsWithChildren, ReactNode } from "react";

/**
 * Animation variants for staggered child elements.
 * Creates a smooth fade-in and slide-up effect with spring animation.
 */
const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, type: "spring" as const },
  },
};

interface StepPros extends PropsWithChildren {
  title?: ReactNode;
  description?: ReactNode;
  error?: string | null;
}

/**
 * A reusable step component for onboarding flow with animations.
 *
 * This component provides a consistent layout and animation structure for
 * onboarding steps. It includes staggered animations for title, description,
 * error message, and children elements. Uses Framer Motion for smooth
 * transitions and spring animations.
 *
 * @param props - Component props
 * @param props.children - Content to render within the step
 * @param props.description - Optional description text
 * @param props.title - Optional title to display
 * @param props.error - Optional error message
 * @returns JSX element representing an animated onboarding step
 */
export default function Step({
  children,
  description,
  title,
  error,
}: StepPros) {
  return (
    <motion.div
      className="z-10"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="items-left mx-5 flex flex-col space-y-10 sm:mx-auto"
      >
        {title && (
          <motion.h1
            className="font-display text-3xl font-bold text-gray-300 transition-colors sm:text-5xl"
            variants={STAGGER_CHILD_VARIANTS}
          >
            {title}
          </motion.h1>
        )}
        {description && (
          <motion.p
            className="text-gray-300 transition-colors sm:text-lg"
            variants={STAGGER_CHILD_VARIANTS}
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div variants={STAGGER_CHILD_VARIANTS}>
            {error && (
              <motion.p
                className="text-destructive transition-colors sm:text-lg"
                variants={STAGGER_CHILD_VARIANTS}
              >
                {error}
              </motion.p>
            )}
            {children}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
