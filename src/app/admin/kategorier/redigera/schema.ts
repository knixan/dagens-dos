import { z } from "zod";
export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  showInNavbar: z.boolean().optional().default(false),
});

export type CategoryValues = z.infer<typeof CategorySchema>;
