'use server'

import { loginSchema, registerSchema } from '@/lib/validations'
import { hashPassword } from '@/lib/hash'
import { authenticateCredentials, setMockSession, getMockSession } from '@/lib/auth'
import { rateLimiter } from '@/lib/security/rate-limiter'
import { logAuditEvent } from '@/lib/security/audit-logger'
import { prisma } from '@/lib/prisma'
import { handleActionError, AppError } from '@/lib/errors'

export async function loginAction(formData: unknown) {
  try {
    // 1. Rate Limit check
    const rateCheck = rateLimiter.check('login-ip', 10, 60000)
    if (!rateCheck.allowed) {
      throw new AppError(`Too many login attempts. Please wait ${Math.ceil(rateCheck.retryAfterMs / 1000)} seconds.`, 429)
    }

    // 2. Validate input schema
    const validated = loginSchema.parse(formData)

    // 3. Authenticate
    const user = await authenticateCredentials(validated.email, validated.password)

    if (!user) {
      throw new AppError('Invalid email address or password', 401)
    }

    return {
      success: true,
      user,
      message: 'Successfully logged in',
    }
  } catch (err) {
    return handleActionError(err)
  }
}

export async function registerAction(formData: unknown) {
  try {
    const rateCheck = rateLimiter.check('register-ip', 5, 60000)
    if (!rateCheck.allowed) {
      throw new AppError('Too many registration attempts. Please try again later.', 429)
    }

    const validated = registerSchema.parse(formData)
    const email = validated.email.toLowerCase().trim()

    let existingUser = null
    if (isDatabaseConfigured()) {
      try {
        existingUser = await prisma.user.findUnique({ where: { email } })
      } catch (dbErr) {
        console.warn('MongoDB query check failed during registration:', dbErr)
      }
    }

    if (existingUser) {
      throw new AppError('An account with this email address already exists', 400)
    }

    const passwordHash = await hashPassword(validated.password)

    let newUser = null
    if (isDatabaseConfigured()) {
      try {
        newUser = await prisma.user.create({
          data: {
            name: validated.name,
            email,
            passwordHash,
            role: 'CUSTOMER',
          },
        })
      } catch (dbErr) {
        console.warn('MongoDB user creation failed, using active session fallback:', dbErr)
        newUser = {
          id: `user-${Date.now()}`,
          name: validated.name,
          email,
          role: 'CUSTOMER' as const,
        }
      }
    } else {
      newUser = {
        id: `user-${Date.now()}`,
        name: validated.name,
        email,
        role: 'CUSTOMER' as const,
      }
    }

    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as 'CUSTOMER',
    }

    await setMockSession(userSession)
    await logAuditEvent({ userId: newUser.id, userEmail: newUser.email, action: 'USER_REGISTERED', resource: 'Auth' })

    return {
      success: true,
      user: userSession,
      message: 'Account created successfully',
    }
  } catch (err) {
    return handleActionError(err)
  }
}

export async function logoutAction() {
  const current = await getMockSession()
  if (current) {
    await logAuditEvent({ userId: current.id, userEmail: current.email, action: 'LOGOUT', resource: 'Auth' })
  }
  await setMockSession(null)
  return { success: true }
}

export async function getCurrentUserAction() {
  return await getMockSession()
}

export async function googleLoginAction(profileData?: { email?: string; name?: string }) {
  try {
    const email = (profileData?.email || 'user.gmail@gmail.com').toLowerCase().trim()
    const name = profileData?.name || 'Google Account'

    let userSession = null

    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('<db_password>')) {
      let user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            passwordHash: 'OAUTH_EXTERNAL_ACCOUNT',
            role: 'CUSTOMER',
          },
        })
      }
      userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as 'CUSTOMER',
      }
    } else {
      userSession = {
        id: `google-${Date.now()}`,
        name,
        email,
        role: 'CUSTOMER' as const,
      }
    }

    await setMockSession(userSession)
    await logAuditEvent({
      userId: userSession.id,
      userEmail: userSession.email,
      action: 'GOOGLE_LOGIN_SUCCESS',
      resource: 'Auth',
    })

    return {
      success: true,
      user: userSession,
      message: 'Signed in with Google',
    }
  } catch (err) {
    return handleActionError(err)
  }
}

