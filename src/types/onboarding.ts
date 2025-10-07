import { z } from "zod";

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

export const OnboardingHobbies = [
  "Sports",
  "Food",
  "Games",
  "Travel",
  "Music",
  "Art",
  "Technology",
] as const;
export const OnboardingHobbySchema = z.object({
  hobby: z.enum(OnboardingHobbies, {
    error: (issue) =>
      issue.input === undefined ? "Hobby is required" : "Hobby is invalid",
  }),
});

export const OnboardingAgeSchema = z.object({
  age: z.number().int().min(0, "Age must be positive"),
});

export const OnboardingDescriptionSchema = z.object({
  description: z.optional(z.string().max(100, "Description is too long")),
});

export const OnboardingSchema = z.object({
  ...OnboardingNameSchema.shape,
  ...OnboardingHobbySchema.shape,
  ...OnboardingAgeSchema.shape,
  ...OnboardingDescriptionSchema.shape,
});

export type OnboardingInfo = z.infer<typeof OnboardingSchema>;
