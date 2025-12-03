// File: app/lib/schemas/order.ts
import { z } from 'zod';

export const orderItemSchema = z.object({
  item_id: z.string().uuid(),
  item_name: z.string(),
  // Updated Service Types
  service_type: z.enum(['Wash & Fold', 'Wash & Iron', 'Dry Clean', 'Iron']),
  quantity: z.number().min(1, "Qty must be at least 1"),
  weight: z.number().optional(), // For KG based items
  unit_price: z.number().min(0),
  total_price: z.number().min(0),
});

export const createOrderSchema = z.object({
  // Step 1: Customer
  customer_phone: z.string().min(10, "Valid phone number required"),
  customer_name: z.string().min(2, "Name is required"),
  customer_address: z.string().optional(),
  
  // Step 2: Items
  items: z.array(orderItemSchema).min(1, "Add at least one item"),
  
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