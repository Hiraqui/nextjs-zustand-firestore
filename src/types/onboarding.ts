import { z } from "zod";

/**
 * Zod schema for validating the name field in the onboarding process.
 * Ensures the name is a non-empty string with appropriate error messages.
 */
export const OnboardingNameSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === ""
          ? "Name is required"
          : "Name is invalid",
    })
    .min(1, { error: "Name is required" }),
});

/**
 * Available hobby options for the onboarding process.
 * Constrained to a specific set of predefined hobbies.
 */
export const OnboardingHobbies = [
  "Sports",
  "Food",
  "Games",
  "Travel",
  "Music",
  "Art",
  "Technology",
] as const;

/**
 * Zod schema for validating the hobby selection in the onboarding process.
 * Must be one of the predefined hobby options.
 */
export const OnboardingHobbySchema = z.object({
  hobby: z.enum(OnboardingHobbies, {
    error: (issue) =>
      issue.input === undefined ? "Hobby is required" : "Hobby is invalid",
  }),
});

/**
 * Zod schema for validating the age field in the onboarding process.
 * Must be a positive integer.
 */
export const OnboardingAgeSchema = z.object({
  age: z.number().int().min(0, "Age must be positive"),
});

/**
 * Zod schema for validating the optional description field in the onboarding process.
 * Limited to 100 characters maximum.
 */
export const OnboardingDescriptionSchema = z.object({
  description: z.optional(z.string().max(100, "Description is too long")),
});

/**
 * Complete onboarding schema that combines all individual field schemas.
 * Used for validating the entire onboarding form data.
 */
export const OnboardingSchema = z.object({
  ...OnboardingNameSchema.shape,
  ...OnboardingHobbySchema.shape,
  ...OnboardingAgeSchema.shape,
  ...OnboardingDescriptionSchema.shape,
});

/**
 * TypeScript type inferred from the OnboardingSchema.
 * Represents the complete structure of onboarding information.
 */
export type OnboardingInfo = z.infer<typeof OnboardingSchema>;
