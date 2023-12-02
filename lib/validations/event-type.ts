import * as z from "zod";

export const EventTypeValidation = z.object({
  name: z.string().max(30).nonempty(),
  durationMin: z.string().nonempty(),
  location: z.string().max(200).nonempty(),
  description: z.string().max(200).nonempty(),
  color: z.number().min(0).max(16),
  dateRangeDays: z.number().min(1).max(365),
  beforeEventMin: z.string().nonempty(),
  afterEventMin: z.string().nonempty(),
  link: z.string().nonempty(),
});
