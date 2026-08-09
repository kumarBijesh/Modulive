interface RateLimitRecord {
  tokens: number
  lastRefill: number
}

class TokenBucketRateLimiter {
  private buckets = new Map<string, RateLimitRecord>()

  /**
   * Check if a request identifier (e.g. IP address or user ID) is within rate limits.
   * @param key Unique key for rate limiting (e.g., "login:192.168.1.1")
   * @param limit Max capacity of tokens
   * @param windowMs Time window in milliseconds to refill tokens
   */
  check(key: string, limit = 5, windowMs = 60000): { allowed: boolean; remaining: number; retryAfterMs: number } {
    const now = Date.now()
    let record = this.buckets.get(key)

    if (!record) {
      record = { tokens: limit, lastRefill: now }
      this.buckets.set(key, record)
    }

    // Calculate token refill
    const timePassed = now - record.lastRefill
    const refillTokens = Math.floor((timePassed / windowMs) * limit)

    if (refillTokens > 0) {
      record.tokens = Math.min(limit, record.tokens + refillTokens)
      record.lastRefill = now
    }

    if (record.tokens > 0) {
      record.tokens -= 1
      return { allowed: true, remaining: record.tokens, retryAfterMs: 0 }
    }

    const retryAfterMs = Math.ceil(windowMs - (now - record.lastRefill))
    return { allowed: false, remaining: 0, retryAfterMs }
  }
}

export const rateLimiter = new TokenBucketRateLimiter()
