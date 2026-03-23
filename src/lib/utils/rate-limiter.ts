/**
 * Basic In-Memory Rate Limiter
 * For production usage with multiple server instances, use Redis or a similar store.
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    // Reset window if expired
    if (now - record.lastReset > windowMs) {
        record.count = 1;
        record.lastReset = now;
    } else {
        record.count++;
    }

    rateLimitMap.set(ip, record);

    return {
        success: record.count <= limit,
        remaining: Math.max(0, limit - record.count),
        reset: record.lastReset + windowMs
    };
}
