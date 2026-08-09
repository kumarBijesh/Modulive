export class AppError extends Error {
  public statusCode: number
  public code: string

  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST') {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Requested resource not found') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class ValidationError extends AppError {
  public errors: Record<string, string[]>

  constructor(message = 'Validation failed', errors: Record<string, string[]> = {}) {
    super(message, 422, 'VALIDATION_ERROR')
    this.errors = errors
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED')
  }
}

export function handleActionError(error: unknown): { success: false; error: string; code?: string } {
  console.error('Action error caught:', error)

  if (error instanceof AppError) {
    return { success: false, error: error.message, code: error.code }
  }

  if (error instanceof Error) {
    return { success: false, error: error.message }
  }

  return { success: false, error: 'An unexpected internal error occurred' }
}
