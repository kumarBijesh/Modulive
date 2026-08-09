import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../../src/lib/hash'

describe('Password Hashing & Verification Security', () => {
  it('should hash passwords and verify successfully with matching raw string', async () => {
    const rawPassword = 'SecurePassword123!'
    const hash = await hashPassword(rawPassword)

    expect(hash).toBeDefined()
    expect(typeof hash).toBe('string')

    const isValid = await verifyPassword(rawPassword, hash)
    expect(isValid).toBe(true)
  })

  it('should reject incorrect passwords during verification', async () => {
    const rawPassword = 'CorrectPassword123!'
    const wrongPassword = 'WrongPassword456!'
    const hash = await hashPassword(rawPassword)

    const isValid = await verifyPassword(wrongPassword, hash)
    expect(isValid).toBe(false)
  })
})
