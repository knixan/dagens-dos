export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  image?: string;
  date?: string; // ISO yyyy-mm-dd
  premium?: boolean;
};
