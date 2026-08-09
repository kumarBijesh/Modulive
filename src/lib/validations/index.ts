import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address').max(255),
  password: z
    .string()
    .min(8, 'Password must be between 8 and 16 characters')
    .max(16, 'Password must be between 8 and 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character'),
})

export const productSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  priceCents: z.number().int().positive('Price must be greater than zero'),
  compareAtCents: z.number().int().positive().nullable().optional(),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  dimensions: z.string().max(200).optional(),
  material: z.string().max(200).optional(),
  color: z.string().max(100).optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('ACTIVE'),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required').max(100),
  description: z.string().max(1000).optional(),
  image: z.string().url().optional(),
})

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99),
})

export const addressSchema = z.object({
  street: z.string().min(5, 'Street address is required').max(200),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State / Province is required').max(100),
  postalCode: z.string().min(3, 'Postal code is required').max(20),
  country: z.string().min(2, 'Country is required').max(100),
})

export const checkoutSchema = z.object({
  guestEmail: z.string().email('Please enter a valid email address').optional(),
  address: addressSchema,
})

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
})
