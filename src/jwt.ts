// Minimal JWT decode (no validation, just base64 decode)
export function decodeJwtPayload(token: string): any {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(payload)))
  } catch {
    return null
  }
}