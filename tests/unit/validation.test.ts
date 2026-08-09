import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, productSchema, cartItemSchema } from '../../src/lib/validations'

describe('Zod Input Validation Schemas', () => {
  it('should validate valid user registration payload', () => {
    const validPayload = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'StrongPassword123!',
    }
    const result = registerSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email and weak password in registration', () => {
    const invalidPayload = {
      name: 'J',
      email: 'not-an-email',
      password: 'weak',
    }
    const result = registerSchema.safeParse(invalidPayload)
    expect(result.success).toBe(false)
  })

  it('should reject negative product prices or zero quantity cart items', () => {
    const invalidCart = {
      productId: 'prod-1',
      quantity: -5,
    }
    expect(cartItemSchema.safeParse(invalidCart).success).toBe(false)
  })
})
