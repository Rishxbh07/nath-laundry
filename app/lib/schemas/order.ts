// File: app/lib/schemas/order.ts
import { z } from 'zod';

export const orderItemSchema = z.object({
  item_id: z.string().uuid().optional(), // Optional because "Bulk Base" isn't in your items DB
  item_name: z.string(),
  service_type: z.enum(['Wash & Fold', 'Wash & Iron', 'Dry Clean', 'Iron', 'Calculated']),
  quantity: z.number().min(1, "Qty must be at least 1"),
  weight: z.number().optional(), 
  unit_price: z.number().min(0), // Allow 0 for inventory items
  total_price: z.number().min(0),
  // Add a flag to help the UI distinguish "Real" items from "Base" charges
  is_base_charge: z.boolean().optional(),
});

export const createOrderSchema = z.object({
  // Step 1: Customer
  customer_phone: z.string().min(10, "Valid phone number required"),
  customer_name: z.string().min(2, "Name is required"),
  customer_address: z.string().optional(),
  
  // Step 2: Items (The final calculated list goes here)
  items: z.array(orderItemSchema).min(1, "Add at least one item"),
  
  // New Field: To store the Bulk Weight specifically for UI retention
  bulk_weight: z.number().optional(), 
  
  // Step 3: Delivery & Meta
  delivery_mode: z.enum(['PICKUP', 'DELIVERY']),
  due_date: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Due date must be in the future",
  }),
  
  // Step 4: Payment
  discount_amount: z.number().default(0),
  payment_status: z.enum(['UNPAID', 'PAID']),
  payment_method: z.enum(['CASH', 'UPI', 'OTHER']).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;