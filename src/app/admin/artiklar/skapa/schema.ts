import { z } from "zod";

export const ArticleCreateSchema = z.object({
  headline: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  image_url: z.string().min(1),
  editorsChoice: z.boolean(),
  premium: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
});

export type ArticleCreateValues = z.infer<typeof ArticleCreateSchema>;
