/**
 * Helper to ensure Mongoose/MongoDB objects are plain JSON-serializable.
 * Next.js Server Components require "plain objects" when passing data to Client Components.
 * This function recursively strips non-serializable properties (like Mongoose internal methods).
 */
export function serialize<T>(data: T): T {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
}
