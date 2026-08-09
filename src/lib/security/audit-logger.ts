import { prisma, isDatabaseConfigured } from '../prisma'

export interface AuditLogOptions {
  userId?: string | null
  userEmail?: string | null
  action: string
  resource: string
  details?: Record<string, unknown>
  ipAddress?: string | null
  userAgent?: string | null
}

const mockAuditLogs: Array<AuditLogOptions & { id: string; createdAt: Date }> = []

export async function logAuditEvent(event: AuditLogOptions) {
  const sanitizedDetails = { ...event.details }
  
  // Never log sensitive fields
  delete sanitizedDetails['password']
  delete sanitizedDetails['passwordHash']
  delete sanitizedDetails['creditCard']
  delete sanitizedDetails['cvv']
  delete sanitizedDetails['stripeSecret']

  try {
    if (isDatabaseConfigured()) {
      await prisma.auditLog.create({
        data: {
          userId: event.userId || undefined,
          userEmail: event.userEmail || undefined,
          action: event.action,
          resource: event.resource,
          details: JSON.stringify(sanitizedDetails),
          ipAddress: event.ipAddress || '127.0.0.1',
          userAgent: event.userAgent || 'App-Server',
        },
      })
    } else {
      mockAuditLogs.unshift({
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        ...event,
        details: sanitizedDetails,
        createdAt: new Date(),
      })
    }
  } catch (err) {
    console.warn('Audit logging fallback:', err)
    mockAuditLogs.unshift({
      id: `log-${Date.now()}`,
      ...event,
      details: sanitizedDetails,
      createdAt: new Date(),
    })
  }
}

export function getMockAuditLogs() {
  return mockAuditLogs
}
