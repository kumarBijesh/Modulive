import { cookies } from 'next/headers'
import { verifyPassword } from './hash'
import { prisma, isDatabaseConfigured } from './prisma'
import { normalizeEmail } from './security/sanitizer'
import { logAuditEvent } from './security/audit-logger'

export interface UserSession {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'
}

// Session Cache & HTTP Cookie Sync
let currentMockSession: UserSession | null = null

export async function setMockSession(session: UserSession | null) {
  currentMockSession = session
  try {
    const cookieStore = await cookies()
    if (session) {
      cookieStore.set('mystore_session', JSON.stringify(session), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      })
    } else {
      cookieStore.delete('mystore_session')
    }
  } catch (e) {
    // Contexts where cookie store is unmounted
  }
}

export async function getMockSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('mystore_session')
    if (sessionCookie?.value) {
      return JSON.parse(sessionCookie.value) as UserSession
    }
  } catch (e) {
    // Contexts where cookie store is unmounted
  }
  return currentMockSession
}

export async function authenticateCredentials(emailInput: string, passwordInput: string): Promise<UserSession | null> {
  const email = normalizeEmail(emailInput)

  // 1. Check demo credentials priority to ensure instant demo login reliability
  if (email === 'admin@mystore.com' && (passwordInput === 'AdminPassword123!' || passwordInput === 'admin')) {
    const session: UserSession = {
      id: 'admin-01',
      name: 'Master Admin',
      email: 'admin@mystore.com',
      role: 'SUPER_ADMIN',
    }
    await logAuditEvent({ userId: session.id, userEmail: session.email, action: 'LOGIN_SUCCESS', resource: 'Auth' })
    await setMockSession(session)
    return session
  }

  if (email === 'customer@mystore.com' && (passwordInput === 'CustomerPassword123!' || passwordInput === 'customer')) {
    const session: UserSession = {
      id: 'cust-01',
      name: 'Jane Customer',
      email: 'customer@mystore.com',
      role: 'CUSTOMER',
    }
    await logAuditEvent({ userId: session.id, userEmail: session.email, action: 'LOGIN_SUCCESS', resource: 'Auth' })
    await setMockSession(session)
    return session
  }

  try {
    let user = null
    if (isDatabaseConfigured()) {
      try {
        user = await prisma.user.findUnique({ where: { email } })
      } catch (dbErr) {
        console.warn('MongoDB query failed during credentials auth, falling back to credentials validation:', dbErr)
        user = null
      }
    }

    if (!user) {
      await logAuditEvent({ userEmail: email, action: 'LOGIN_FAILED_NOT_FOUND', resource: 'Auth' })
      return null
    }

    const isValid = await verifyPassword(passwordInput, user.passwordHash)

    if (!isValid) {
      await logAuditEvent({ userId: user.id, userEmail: user.email, action: 'LOGIN_FAILED_BAD_PASSWORD', resource: 'Auth' })
      return null
    }

    const session: UserSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN',
    }

    await logAuditEvent({ userId: user.id, userEmail: user.email, action: 'LOGIN_SUCCESS', resource: 'Auth' })
    await setMockSession(session)
    return session
  } catch (err) {
    console.error('Authentication error:', err)
    return null
  }
}
