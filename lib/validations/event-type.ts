import * as z from "zod";

export const EventTypeValidation = z.object({
  name: z.string().min(3).max(30),
  durationMin: z.string().nonempty(),
  location: z.string().min(3).max(200),
  description: z.string().min(3).max(200),
  color: z.number().min(0).max(16),
  dateRangeDays: z.number().min(1).max(365),
  beforeEventMin: z.string().nonempty(),
  afterEventMin: z.string().nonempty(),
  link: z.string().nonempty(),
});
