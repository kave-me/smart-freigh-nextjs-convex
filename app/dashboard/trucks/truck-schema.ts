import { z } from "zod";

export const truckSchema = z.object({
  _id: z.string(),
  _creationTime: z.number(),
  truckEid: z.string(),
  make: z.string(),
  bodyType: z.string(),
  model: z.string(),
  year: z.number(),
  vin: z.string(),
  userId: z.string(),
  isArchived: z.boolean(),
});

export type Truck = z.infer<typeof truckSchema>;