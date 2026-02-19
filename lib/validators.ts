import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export const createOrderSchema = z.object({
  type: z.enum(["DELIVERY", "PICKUP", "TABLE"]),
  notes: z.string().optional(),
  address: z.string().optional(),
  items: z.array(z.object({ menuItemId: z.string(), quantity: z.number().min(1), notes: z.string().optional() })).min(1)
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["NEW", "PREPARING", "READY", "DELIVERED", "CANCELED"])
});

export const expenseSchema = z.object({
  date: z.string(),
  amount: z.number().positive(),
  category: z.enum(["RENT", "SUPPLIES", "PAYROLL", "UTILITIES", "MAINTENANCE", "MARKETING", "OTHER"]),
  method: z.enum(["CASH", "PIX", "CREDIT_CARD", "DEBIT_CARD", "TRANSFER"]),
  vendor: z.string().optional(),
  notes: z.string().optional()
});
