import * as z from "zod";

export const ScheduleValidation = z.object({
  name: z.string().max(30).nonempty(),
});
