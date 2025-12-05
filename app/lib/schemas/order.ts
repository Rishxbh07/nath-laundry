// File: app/lib/schemas/order.ts
import { z } from 'zod';

export const orderItemSchema = z.object({
  item_id: z.string().uuid().optional().nullable(),
  item_name: z.string(),
  service_type: z.enum([
    'Wash & Fold', 'Wash & Iron', 'Dry Clean', 'Iron Only', 
    'Calculated', 'Custom', 'Special Wash', 'Piece Wash', 'Heavy Wash'
  ]),
  quantity: z.number().min(1, "Qty must be at least 1"),
  weight: z.number().optional(), 
  unit_price: z.number().min(0), 
  total_price: z.number().min(0),
  is_base_charge: z.boolean().optional(),
});

export const createOrderSchema = z.object({
  customer_phone: z.string().min(10, "Valid phone number required"),
  customer_name: z.string().min(2, "Name is required"),
  customer_address: z.string().optional(),
  
  items: z.array(orderItemSchema).min(1, "Add at least one item"),
  bulk_weight: z.number().optional(), 
  
  // New Field for Inventory Tracking
  total_item_count: z.number().min(1, "Total piece count is required"),

  delivery_mode: z.enum(['PICKUP', 'DELIVERY']),
  due_date: z.string().min(1, "Date is required"), 
  due_time: z.string().min(1, "Time is required"),
  
  discount_amount: z.number().default(0),
  payment_status: z.enum(['UNPAID', 'PAID', 'PARTIAL']).optional(),
  payment_method: z.enum(['CASH', 'UPI', 'OTHER']).optional().nullable(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;