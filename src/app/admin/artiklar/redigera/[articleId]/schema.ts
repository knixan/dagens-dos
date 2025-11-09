import { z } from "zod";

export const ArticleEditSchema = z.object({
  id: z.string().min(1),
  headline: z.string().min(1),
  summary: z.string().min(1),
  content: z.string().min(1),
  image_url: z.string().min(1),
  editorsChoice: z.boolean(),
  categoryIds: z.array(z.string()).optional(),
});

export type ArticleEditValues = z.infer<typeof ArticleEditSchema>;
