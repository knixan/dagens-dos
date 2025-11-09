import { z } from "zod";
import { Role as PrismaRole } from "@/generated/prisma";

// --- Article Schemas ---
export const createArticleSchema = z.object({
  headline: z.string().min(1, { message: "Rubrik är obligatorisk." }),
  summary: z.string().optional(),
  content: z.string().min(1, { message: "Innehåll är obligatoriskt." }),
  image_url: z.string().optional(),
  editorsChoice: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(), // array of category ids (string cuid)
  authorIds: z.array(z.string()).optional(), // array of user ids
});
//-- typ för skapande av artikel ---
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
//
export const updateArticleSchema = z.object({
  id: z.string().min(1),
  headline: z.string().min(1).optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  image_url: z.string().optional(),
  editorsChoice: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
  authorIds: z.array(z.string()).optional(),
});
//-- typ för uppdatering av artikel ---
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;

export const deleteArticleSchema = z.object({ id: z.string().min(1) });
export type DeleteArticleInput = z.infer<typeof deleteArticleSchema>;

// --- Kategori Schemas ---
export const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Kategori-namn är obligatoriskt." }),
  description: z.string().optional(),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
//
export const updateCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const deleteCategorySchema = z.object({ id: z.string().min(1) });
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;

// --- Abonnemangstyp Schemas ---
export const createSubscriptionTypeSchema = z.object({
  name: z.string().min(1, { message: "Namn för abonnemangstyp krävs." }),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .nonnegative({ message: "Pris måste vara ett icke-negativt tal." }),
  durationDays: z.coerce
    .number()
    .int()
    .positive({
      message: "Varaktighet i dagar måste vara ett positivt heltal.",
    })
    .optional(),
});
export type CreateSubscriptionTypeInput = z.infer<
  typeof createSubscriptionTypeSchema
>;

export const updateSubscriptionTypeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative().optional(),
  durationDays: z.coerce.number().int().positive().optional(),
});
export type UpdateSubscriptionTypeInput = z.infer<
  typeof updateSubscriptionTypeSchema
>;

export const deleteSubscriptionTypeSchema = z.object({ id: z.string().min(1) });
export type DeleteSubscriptionTypeInput = z.infer<
  typeof deleteSubscriptionTypeSchema
>;

// --- Prenumeration Schemas ---
export const createSubscriptionSchema = z.object({
  userId: z.string().min(1),
  typeId: z.string().min(1),
  expiresAt: z.string().optional(), // ISO date string
  active: z.boolean().optional(),
});
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

export const updateSubscriptionSchema = z.object({
  id: z.string().min(1),
  expiresAt: z.string().optional(),
  active: z.boolean().optional(),
});
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;

export const deleteSubscriptionSchema = z.object({ id: z.string().min(1) });
export type DeleteSubscriptionInput = z.infer<typeof deleteSubscriptionSchema>;

// Prisma-aligned role schema + typ
export const roleSchema = z.nativeEnum(PrismaRole);
export type Role = z.infer<typeof roleSchema>;

// --- Användare (admin view) ---
export const adminUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  emailVerified: z.string().nullable().optional(),
  role: roleSchema.nullable().optional(), // <-- använder Prisma-enum här
  image: z.string().nullable().optional(),
});
export type AdminUser = z.infer<typeof adminUserSchema>;

// --- Order / Checkout Schemas ---
export const orderItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  priceAtPurchase: z.coerce.number().nonnegative(),
  quantity: z.coerce.number().int().positive(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: z.number().int().positive(),
  totalAmount: z.coerce.number().nonnegative(),
  status: z.string(),
  orderDate: z.string(),
  userId: z.string().nullable().optional(),
  customerEmail: z.string().optional(),
  customerFirstName: z.string().optional(),
  customerLastName: z.string().optional(),
  OrderItem: z.array(orderItemSchema),
});
export type Order = z.infer<typeof orderSchema>;
//-- Checkout order schema ---
export const checkoutOrderSchema = z.object({
  customerFirstName: z.string().min(1, { message: "Förnamn krävs" }),
  customerLastName: z.string().min(1, { message: "Efternamn krävs" }),
  customerEmail: z.string().email({ message: "Ogiltig e-post" }),
  customerAddress: z.string().min(1, { message: "Adress krävs" }),
  customerCity: z.string().min(1, { message: "Ort krävs" }),
  customerPostalCode: z.string().min(1, { message: "Postnummer krävs" }),
  customerCountry: z.string().min(2, { message: "Land krävs" }),
  items: z.array(
    z.object({
      movieId: z.string().min(1),
      quantity: z.coerce.number().int().min(1),
      price: z.coerce.number().nonnegative(),
    })
  ),
  totalAmount: z.coerce.number().nonnegative(),
});
export type CheckoutOrderInput = z.infer<typeof checkoutOrderSchema>;

// Update order status schema
// Behöver göra om den här då vi inte ska skicka orders utan endast uppdatera status
export const updateOrderStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

const schemas = {
  createArticleSchema,
  updateArticleSchema,
  deleteArticleSchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  createSubscriptionTypeSchema,
  updateSubscriptionTypeSchema,
  deleteSubscriptionTypeSchema,
  createSubscriptionSchema,
  updateSubscriptionSchema,
  deleteSubscriptionSchema,
  adminUserSchema,
  orderSchema,
  orderItemSchema,
  checkoutOrderSchema,
  updateOrderStatusSchema,
};

export default schemas;
