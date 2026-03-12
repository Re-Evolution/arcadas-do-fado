const rateLimitMap = new Map<string, { count: number; resetAt: number; dailyCount: number; dailyResetAt: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now()
  const hourMs = 60 * 60 * 1000
  const dayMs = 24 * hourMs

  const entry = rateLimitMap.get(ip)

  if (!entry) {
    rateLimitMap.set(ip, {
      count: 1,
      resetAt: now + hourMs,
      dailyCount: 1,
      dailyResetAt: now + dayMs,
    })
    return { allowed: true }
  }

  // Reset hourly counter
  if (now > entry.resetAt) {
    entry.count = 0
    entry.resetAt = now + hourMs
  }

  // Reset daily counter
  if (now > entry.dailyResetAt) {
    entry.dailyCount = 0
    entry.dailyResetAt = now + dayMs
  }

  if (entry.dailyCount >= 10) {
    return { allowed: false, reason: 'daily_limit' }
  }

  if (entry.count >= 3) {
    return { allowed: false, reason: 'hourly_limit' }
  }

  entry.count++
  entry.dailyCount++
  return { allowed: true }
}

// Clean up old entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (now > entry.dailyResetAt) {
        rateLimitMap.delete(ip)
      }
    }
  }, 60 * 60 * 1000)
}
