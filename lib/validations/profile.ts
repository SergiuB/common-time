import * as z from "zod";

export const ProfileValidation = z.object({
  fullName: z.string().max(50).nonempty(),
  link: z.string().min(3).max(50).nonempty(),
  email: z.string().email().nonempty(),
  imageUrl: z.string().url().optional(),
  businessLogoUrl: z.string().url().optional(),
});
