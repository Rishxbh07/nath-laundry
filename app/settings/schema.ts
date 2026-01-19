import { z } from "zod";

export const UnitEnum = z.enum(["KG", "PC"]);
export const ServiceCategoryEnum = z.enum(["BULK", "ADDON"]);

// Detailed Rule Schema
export const specialItemSchema = z.object({
  id: z.string().optional(),
  item_catalog_id: z.string().min(1, "Item is required"),
  name: z.string(), 
  service_id: z.string().min(1, "Service is required"), 
  rate: z.coerce.number().min(0), 
  rate_type: z.enum(['FIXED', 'PER_UNIT']).default('PER_UNIT'), 
  has_threshold: z.boolean().default(false),
  threshold_weight: z.coerce.number().optional(),
  below_threshold_rate: z.coerce.number().optional(),
  is_active: z.boolean().default(true),
});

export const serviceConfigSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  category: ServiceCategoryEnum,
  pricing_unit: UnitEnum,
  default_rate: z.coerce.number().min(0),
  is_active: z.boolean().default(true),
  is_default: z.boolean().default(false),
});

export const shopSettingsSchema = z.object({
  branch_id: z.string(),
  billing_mode: z.enum(['MANUAL', 'AUTOMATIC']), 
  delivery_enabled: z.boolean(),
  services: z.array(serviceConfigSchema),
  special_items: z.array(specialItemSchema),
});

export type ShopSettingsFormValues = z.infer<typeof shopSettingsSchema>;