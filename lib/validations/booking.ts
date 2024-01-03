import * as z from "zod";

export const BookingValidation = z.object({
  name: z.string().max(30).nonempty(),
  email: z.string().email().nonempty(),
  phone: z.string().max(30).nonempty(),
});
