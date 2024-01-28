import * as z from "zod";

export const EventTypeValidation = z.object({
  name: z.string().max(30).nonempty(),
  durationMin: z.string().nonempty(),
  location: z.string().max(200).nonempty(),
  description: z.string().max(200).nonempty(),
  colorId: z.string(),
  beforeEventMin: z.string().nonempty(),
  afterEventMin: z.string().nonempty(),
  link: z.string().nonempty(),
  scheduleId: z.string().nonempty(),
  badges: z.string(),
  timezone: z.string().nonempty(),
});
