interface RateLimitRecord {
  timestamps: number[];
}

const cache = new Map<string, RateLimitRecord>();

export class RateLimiter {
  /**
   * Evaluates if a key has exceeded the number of allowed hits within the window duration.
   * @param key Unique identifier (e.g. IP + Action, or UserID + Action)
   * @param limit Maximum allowed hits
   * @param windowMs Time window in milliseconds (default 1 minute)
   */
  static check(key: string, limit = 5, windowMs = 60000): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = cache.get(key) || { timestamps: [] };

    // Filter timestamps within current window
    const activeTimestamps = record.timestamps.filter(t => now - t < windowMs);

    if (activeTimestamps.length >= limit) {
      return { allowed: false, remaining: 0 };
    }

    activeTimestamps.push(now);
    cache.set(key, { timestamps: activeTimestamps });

    return {
      allowed: true,
      remaining: limit - activeTimestamps.length,
    };
  }
}
